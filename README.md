## Objective

[NestJs](https://github.com/nestjs/nest) + [Prisma](https://prisma.io/) based POC to show latests Norwegian flight status

## Description

I've used the tools that I'm most familiar with or that would help me save time and built a quick POC to meet [the requirements](https://dolittle.notion.site/Event-Source-Avinor-s-Flight-Time-APIs-5502f6deba0f487db61fc04e37093e27) of the task in hand.

- CRON job executing every 3 minutes (src/flights/flights.service)
- The job fetches all flights that have changed in the past time interval and inserts a FlightStatusEvent for each change that is not recorded
- New flights are also inserted in the same job (duplicates are handled by relying on the DB unique-field contrains)
- The data model is defined in prisma/schema.prisma
- A migration file is used to create the DB structure intially
- No more tests other than those out of the box were coded

Several things can be improved if this were to be a production-grade solution

- Separte event fetching from REST API in two different services
- Replace NestJS with Koa (light-weight and more performant but less opinionated and with much less out of the box). Here, I'm assuming Javascript but obviously there are better choices in other languages (Kotlin/Rust/Go).
- Deploy to cloud using Kubernets with an horizontal pod autoscaler to handle peaks of load
- Use more robust technologies for real-time message/event flows (Kafka, Dolittle, Azure Event Hub) that can handle much more load, be consumed by several actors concurrently and have lower latency.
- Add proper unit & functional tests
- Better parsing/typing (for example of the XML response after being parse to JSON)
- Better data modelling (Airports, Flights, Events)
- Rate limiting and other security measures
- Implement monitoring and probing capabilities to ensure better uptime

## Installation

```bash
$ docker compose up -d
$ yarn
$ npx prisma migrate dev
```

## Running the backend

```bash
$ yarn start
```

## Getting Flights via the REST API (examples)

- [Flights for Oslo](http://localhost:3000/flights/osl)
- [Flights for Bergen](http://localhost:3000/flights/bgo)
- [Flights for Tromso](http://localhost:3000/flights/tos)
- Flights for any other aiport: http://localhost:3000/flights/{airport-code}

### Example of Response

```json
GET http://localhost:3000/flights/tos

[
  {
    "id": 38,
    "airport": "tos",
    "schedule_time": "2022-09-21T18:35:00Z",
    "airline": "WF",
    "flight_id": "WF098",
    "arr_dep": "A",
    "arr_dep_airport": "BOO",
    "FlightStatusEvent": [
      {
        "id": 47,
        "flight_id": "WF098",
        "code": "A",
        "time": "2022-09-21T18:48:00Z"
      }
    ]
  },
  {
    "id": 39,
    "airport": "tos",
    "schedule_time": "2022-09-21T19:10:00Z",
    "airline": "WF",
    "flight_id": "WF978",
    "arr_dep": "D",
    "arr_dep_airport": "KKN",
    "FlightStatusEvent": [
      {
        "id": 786,
        "flight_id": "WF978",
        "code": "E",
        "time": "2022-09-21T21:27:00Z"
      }
    ]
  },
  {
    "id": 87,
    "airport": "tos",
    "schedule_time": "2022-09-21T19:25:00Z",
    "airline": "DX",
    "flight_id": "DX587",
    "arr_dep": "D",
    "arr_dep_airport": "LKL",
    "FlightStatusEvent": [
      {
        "id": 680,
        "flight_id": "DX587",
        "code": "D",
        "time": "2022-09-21T19:23:00Z"
      }
    ]
  },
  {
    "id": 96,
    "airport": "tos",
    "schedule_time": "2022-09-22T18:55:00Z",
    "airline": "SK",
    "flight_id": "SK4434",
    "arr_dep": "D",
    "arr_dep_airport": "ALF",
    "FlightStatusEvent": [
      {
        "id": 858,
        "flight_id": "SK4434",
        "code": "A",
        "time": "2022-09-21T19:29:00Z"
      }
    ]
  },
  {
    "id": 149,
    "airport": "tos",
    "schedule_time": "2022-09-21T19:55:00Z",
    "airline": "SK",
    "flight_id": "SK4432",
    "arr_dep": "A",
    "arr_dep_airport": "OSL",
    "FlightStatusEvent": [
      {
        "id": 840,
        "flight_id": "SK4432",
        "code": "A",
        "time": "2022-09-21T19:55:00Z"
      }
    ]
  }
]
```

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```
