CREATE TABLE IF NOT EXISTS "feedback" (
	"feedbackid" serial PRIMARY KEY NOT NULL,
	"predictionid" integer NOT NULL,
	"userid" integer,
	"accuracy_rating" integer NOT NULL,
	"comment" varchar(1000),
	"actual_yield" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "predictions" (
	"predictionid" serial PRIMARY KEY NOT NULL,
	"userid" integer NOT NULL,
	"crop_type" varchar(100) NOT NULL,
	"planting_date" timestamp NOT NULL,
	"yield_prediction" varchar(100) NOT NULL,
	"harvest_date" timestamp NOT NULL,
	"prediction_data" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"userid" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) DEFAULT '' NOT NULL,
	"location" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_predictionid_predictions_predictionid_fk" FOREIGN KEY ("predictionid") REFERENCES "public"."predictions"("predictionid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_userid_users_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "predictions" ADD CONSTRAINT "predictions_userid_users_userid_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
