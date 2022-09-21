import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from "./app.service";
import { FlightsService } from "./flights/filghts.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly flightsService: FlightsService
  ) {
    flightsService.fetchFlightsAndEvents();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("flights/:airportCode")
  async getFlights(@Param("airportCode") airportCode) {
    return await this.flightsService.getFlightsByAirport(airportCode);
  }
}
