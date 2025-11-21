ALTER TABLE "playersData" RENAME COLUMN "image_url" TO "face_image_url";--> statement-breakpoint
ALTER TABLE "playersData" ADD COLUMN "rarity" text DEFAULT 'bronze' NOT NULL;