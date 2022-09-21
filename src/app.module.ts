import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FlightsService } from "./flights/filghts.service";
import { PrismaService } from "./prisma.ts/prisma.service";

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, FlightsService, PrismaService],
})
export class AppModule {}
