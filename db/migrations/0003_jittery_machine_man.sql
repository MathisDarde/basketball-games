CREATE TYPE "public"."market_exchange_status" AS ENUM('pending', 'validated');--> statement-breakpoint
CREATE TABLE "market_card_exchange" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"receivedCardId" text NOT NULL,
	"givenCardsId" text NOT NULL,
	"status" "market_exchange_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "market_card_exchange" ADD CONSTRAINT "market_card_exchange_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_card_exchange" ADD CONSTRAINT "market_card_exchange_receivedCardId_playersData_id_fk" FOREIGN KEY ("receivedCardId") REFERENCES "public"."playersData"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_card_exchange" ADD CONSTRAINT "market_card_exchange_givenCardsId_playersData_id_fk" FOREIGN KEY ("givenCardsId") REFERENCES "public"."playersData"("id") ON DELETE cascade ON UPDATE no action;