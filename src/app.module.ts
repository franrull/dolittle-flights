import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FlightsController } from "./flights/flights.controller";
import { FlightsService } from "./flights/flights.service";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController, FlightsController],
  providers: [AppService, FlightsService, PrismaService],
})
export class AppModule {}
