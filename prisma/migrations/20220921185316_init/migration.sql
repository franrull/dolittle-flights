-- CreateTable
CREATE TABLE "Flight" (
    "id" SERIAL NOT NULL,
    "airport" TEXT NOT NULL,
    "schedule_time" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "flight_id" TEXT NOT NULL,
    "arr_dep" TEXT NOT NULL,
    "arr_dep_airport" TEXT NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightStatusEvent" (
    "id" SERIAL NOT NULL,
    "flight_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "FlightStatusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flight_flight_id_key" ON "Flight"("flight_id");

-- CreateIndex
CREATE UNIQUE INDEX "FlightStatusEvent_flight_id_code_time_key" ON "FlightStatusEvent"("flight_id", "code", "time");

-- AddForeignKey
ALTER TABLE "FlightStatusEvent" ADD CONSTRAINT "FlightStatusEvent_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "Flight"("flight_id") ON DELETE RESTRICT ON UPDATE CASCADE;
