CREATE TABLE "to-do-list" (
	"id" SERIAL PRIMARY KEY,
	"task" VARCHAR(255) NOT NULL,
	"priority" INT DEFAULT 1,
	"completion_status" BOOLEAN DEFAULT false,
    "time_completed" VARCHAR(30)
);