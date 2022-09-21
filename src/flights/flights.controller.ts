import { Controller, Get, Param } from "@nestjs/common";
import { FlightsService } from "./flights.service";

@Controller()
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get("flights/:airportCode")
  async getFlights(@Param("airportCode") airportCode) {
    return await this.flightsService.getFlightsByAirport(airportCode);
  }
}
