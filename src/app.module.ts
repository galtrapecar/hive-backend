import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { AiController } from './ai/ai.controller';
import { AiService } from './ai/ai.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';
import { RoutingModule } from './routing/routing.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { DriverModule } from './driver/driver.module';
import { MobileController } from './mobile/mobile.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule.forRoot({ auth }),
    PrismaModule,
    OrderModule,
    RoutingModule,
    VehicleModule,
    DriverModule,
  ],
  controllers: [AppController, AiController, MobileController],
  providers: [AppService, AiService],
})
export class AppModule {}
