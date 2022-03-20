CREATE TABLE "to-do-list" (
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR(255) NOT NULL,
	"priority" INT,
	"completion_status" BOOLEAN,
    "time_completed" VARCHAR(30)
);
