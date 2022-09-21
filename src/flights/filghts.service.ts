import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { combineLatest, from, map, mergeAll, of } from "rxjs";

import airports from "./airports";
import { PrismaService } from "src/prisma.ts/prisma.service";
import { Flight } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const convert = require("xml-js");

@Injectable()
export class FlightsService {
  constructor(
    private readonly httpService: HttpService,
    private prisma: PrismaService
  ) {}

  getFlightsByAirport(airportCode: string): Promise<Flight[]> {
    return this.prisma.flight.findMany({
      where: { airport: airportCode },
      include: {
        FlightStatusEvent: {
          orderBy: {
            time: "desc",
          },
          take: 1,
        },
      },
    });
  }

  @Cron("0 */3 * * * *")
  fetchFlightsAndEvents(): void {
    from(airports)
      .pipe(
        map((airport) => {
          // Fetch all flights that were updated in the last 3 minutes (strip miliseconds)
          const date =
            new Date(Date.now() - 1000 * 60 * 3).toISOString().split(".")[0] +
            "Z";
          const flights = this.httpService.get<string>(
            `https://flydata.avinor.no/XmlFeed.asp?TimeFrom=1&TimeTo=24&airport=${airport.code.toUpperCase()}&lastUpdate=${date}`
          );
          return combineLatest({ airport: of(airport), flights });
        }),
        mergeAll()
      )
      .subscribe(async ({ airport, flights }) => {
        const data = JSON.parse(
          convert.xml2json(flights.data, { compact: true, spaces: 2 })
        );
        if (Array.isArray(data?.airport?.flights?.flight))
          for (const flight of data.airport.flights.flight) {
            const {
              flight_id: { _text: flight_id },
              airline: { _text: airline },
              schedule_time: { _text: schedule_time },
              arr_dep: { _text: arr_dep },
              airport: { _text: arr_dep_airport },
              status,
            } = flight;
            try {
              if (
                !(await this.prisma.flight.findUnique({
                  where: {
                    flight_id,
                  },
                }))
              ) {
                const flight = await this.prisma.flight.create({
                  data: {
                    airport: airport.code,
                    schedule_time,
                    airline,
                    flight_id,
                    arr_dep,
                    arr_dep_airport,
                  },
                });
                console.log(flight);
              }
            } catch (error) {
              console.error("error saving flight", error);
            }

            try {
              if (!status?._attributes?.code || !status?._attributes?.time)
                return;

              const eventPayload = {
                flight_id,
                code: status._attributes?.code,
                time: status._attributes?.time,
              };
              if (
                !(await this.prisma.flightStatusEvent.findUnique({
                  where: {
                    flight_id_code_time: eventPayload,
                  },
                }))
              ) {
                const statusEvent = await this.prisma.flightStatusEvent.create({
                  data: eventPayload,
                });
                console.log(statusEvent);
              }
            } catch (error) {
              console.error("error saving status event", error);
            }
          }
      });
  }
}
