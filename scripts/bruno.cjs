const { openApiToBruno } = require('@usebruno/converters');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');

async function fetchOpenApiSchema() {
  try {
    const res = await fetch('http://localhost:3000/swagger/json');
    return await res.json();
  } catch (error) {
    console.error('failed to fetch openapi schema:', error);
  }
}

async function convertOpenApiToBruno(outputFile) {
  try {
    const brunoCollection = openApiToBruno(await fetchOpenApiSchema());

    await writeFile(outputFile, JSON.stringify(brunoCollection, null, 2));
    console.log('OpenAPI JSON conversion successful!');
  } catch (error) {
    console.error('Error during OpenAPI JSON conversion:', error);
  }
}

convertOpenApiToBruno(path.join(__dirname, '../bruno-collection.json'));
