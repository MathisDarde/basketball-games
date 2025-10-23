CREATE TABLE "cardcollection" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"cardId" text NOT NULL,
	"period" text NOT NULL,
	"possessed" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "careerpath_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"playerId" text NOT NULL,
	"difficulty" text NOT NULL,
	"period" text NOT NULL,
	"correct" boolean NOT NULL,
	"attempts" integer NOT NULL,
	"streak" integer NOT NULL,
	"playedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dailydraws" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"date" timestamp NOT NULL,
	"period" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dailydraws_players" (
	"dailydrawId" text NOT NULL,
	"playerId" text NOT NULL,
	"flipped" boolean DEFAULT false NOT NULL,
	CONSTRAINT "dailydraws_players_dailydrawId_playerId_pk" PRIMARY KEY("dailydrawId","playerId")
);
--> statement-breakpoint
CREATE TABLE "playtogether_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"period" text NOT NULL,
	"correct" boolean NOT NULL,
	"streak" integer NOT NULL,
	"difficulty" text NOT NULL,
	"playedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "highscores" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "highscores" CASCADE;--> statement-breakpoint
ALTER TABLE "playersData" ALTER COLUMN "position" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "playersData" ALTER COLUMN "position" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "playersData" ADD COLUMN "period" text NOT NULL;--> statement-breakpoint
ALTER TABLE "playersData" ADD COLUMN "teams_history" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "playersData" ADD COLUMN "image_link" text;--> statement-breakpoint
ALTER TABLE "playersData" ADD COLUMN "wikipedia_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "playersData" ADD COLUMN "awards" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "cardcollection" ADD CONSTRAINT "cardcollection_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cardcollection" ADD CONSTRAINT "cardcollection_cardId_playersData_id_fk" FOREIGN KEY ("cardId") REFERENCES "public"."playersData"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "careerpath_sessions" ADD CONSTRAINT "careerpath_sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "careerpath_sessions" ADD CONSTRAINT "careerpath_sessions_playerId_playersData_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."playersData"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dailydraws" ADD CONSTRAINT "dailydraws_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dailydraws_players" ADD CONSTRAINT "dailydraws_players_dailydrawId_dailydraws_id_fk" FOREIGN KEY ("dailydrawId") REFERENCES "public"."dailydraws"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dailydraws_players" ADD CONSTRAINT "dailydraws_players_playerId_playersData_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."playersData"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playtogether_sessions" ADD CONSTRAINT "playtogether_sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playersData" DROP COLUMN "teams";--> statement-breakpoint
ALTER TABLE "playersData" DROP COLUMN "img_url";--> statement-breakpoint
ALTER TABLE "playersData" DROP COLUMN "rarity";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "profilepicture";