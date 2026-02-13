const { openApiToBruno } = require('@usebruno/converters');
const { writeFile, mkdir, rm } = require('fs/promises');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../bruno');

async function fetchOpenApiSchema() {
  const res = await fetch('http://localhost:3000/swagger/json');
  if (!res.ok) throw new Error(`Failed to fetch OpenAPI schema: ${res.status}`);
  return res.json();
}

function toBruMethod(method) {
  return method.toLowerCase();
}

function buildBruRequest(item) {
  const req = item.request;
  const method = toBruMethod(req.method);
  const bodyMode = req.body?.mode || 'none';

  let bru = '';

  // meta
  bru += `meta {\n  name: ${item.name}\n  type: http\n  seq: ${item.seq || 1}\n}\n\n`;

  // method block
  bru += `${method} {\n  url: ${req.url}\n  body: ${bodyMode}\n  auth: inherit\n}\n`;

  // query params
  const queryParams = (req.params || []).filter((p) => p.type === 'query');
  if (queryParams.length) {
    bru += `\nparams:query {\n`;
    for (const p of queryParams) {
      const prefix = p.enabled === false ? '~' : '';
      bru += `  ${prefix}${p.name}: ${p.value || ''}\n`;
    }
    bru += `}\n`;
  }

  // path params
  const pathParams = (req.params || []).filter((p) => p.type === 'path');
  if (pathParams.length) {
    bru += `\nparams:path {\n`;
    for (const p of pathParams) {
      bru += `  ${p.name}: ${p.value || ''}\n`;
    }
    bru += `}\n`;
  }

  // body
  if (bodyMode === 'json' && req.body?.json) {
    bru += `\nbody:json ${req.body.json}\n`;
  } else if (bodyMode === 'multipartForm' && req.body?.multipartForm?.length) {
    bru += `\nbody:multipart-form {\n`;
    for (const f of req.body.multipartForm) {
      bru += `  ${f.name}: ${f.value || ''}\n`;
    }
    bru += `}\n`;
  }

  return bru;
}

async function writeFolder(items, dir) {
  await mkdir(dir, { recursive: true });

  for (const item of items) {
    if (item.type === 'folder') {
      const folderDir = path.join(dir, item.name);
      await writeFolder(item.items || [], folderDir);
    } else if (item.type === 'http-request') {
      const fileName = item.name.replace(/[/\\?%*:|"<>]/g, '-') + '.bru';
      const content = buildBruRequest(item);
      await writeFile(path.join(dir, fileName), content);
    }
  }
}

async function writeAuthRequests() {
  const authDir = path.join(OUTPUT_DIR, 'Auth');
  await mkdir(authDir, { recursive: true });

  const signUp = `meta {
  name: Sign Up
  type: http
  seq: 1
}

post {
  url: {{baseUrl}}/api/auth/sign-up/email
  body: json
  auth: none
}

body:json {
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
}

script:post-response {
  const body = res.getBody();
  if (body.token) {
    bru.setEnvVar("token", body.token);
    console.log("Token saved to environment");
  }
}
`;

  const signIn = `meta {
  name: Sign In
  type: http
  seq: 2
}

post {
  url: {{baseUrl}}/api/auth/sign-in/email
  body: json
  auth: none
}

body:json {
  {
    "email": "test@example.com",
    "password": "password123"
  }
}

script:post-response {
  const body = res.getBody();
  if (body.token) {
    bru.setEnvVar("token", body.token);
    console.log("Token saved to environment");
  }
}
`;

  await writeFile(path.join(authDir, 'Sign Up.bru'), signUp);
  await writeFile(path.join(authDir, 'Sign In.bru'), signIn);
}

async function main() {
  console.log(
    'Fetching OpenAPI schema from http://localhost:3000/swagger/json ...',
  );
  const schema = await fetchOpenApiSchema();

  console.log('Converting to Bruno collection...');
  const collection = openApiToBruno(schema);

  // Clean and recreate output dir
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  // bruno.json
  await writeFile(
    path.join(OUTPUT_DIR, 'bruno.json'),
    JSON.stringify(
      {
        version: '1',
        name: 'Hive Backend',
        type: 'collection',
        ignore: ['node_modules', 'dist'],
      },
      null,
      2,
    ),
  );

  // collection.bru - collection-level bearer auth
  await writeFile(
    path.join(OUTPUT_DIR, 'collection.bru'),
    `meta {
  name: Hive Backend
}

auth {
  mode: bearer
}

auth:bearer {
  token: {{token}}
}
`,
  );

  // environments
  const envDir = path.join(OUTPUT_DIR, 'environments');
  await mkdir(envDir, { recursive: true });
  await writeFile(
    path.join(envDir, 'local.bru'),
    `vars {
  baseUrl: http://localhost:3000
}
`,
  );

  // Auth requests with token automation
  await writeAuthRequests();

  // API requests from OpenAPI
  await writeFolder(collection.items || [], OUTPUT_DIR);

  console.log(`Bruno collection generated at ${OUTPUT_DIR}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
