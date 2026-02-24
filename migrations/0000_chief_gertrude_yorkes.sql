CREATE TABLE "event_sponsors" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar NOT NULL,
	"sponsor_id" varchar NOT NULL,
	"tier" text,
	CONSTRAINT "event_sponsors_event_id_sponsor_id_unique" UNIQUE("event_id","sponsor_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"slug" text NOT NULL,
	"date" timestamp NOT NULL,
	"venue" text,
	"city" text,
	"country" text,
	"address" text,
	"map_embed_url" text,
	"poster_url" text,
	"hero_image_url" text,
	"ticket_url" text,
	"ticket_cta_text" text,
	"description" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "fighters" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"nickname" text,
	"nationality" text,
	"city" text,
	"date_of_birth" date,
	"gender" text DEFAULT 'male' NOT NULL,
	"weight_class" text,
	"weight_lbs" integer,
	"height_cm" integer,
	"reach_cm" integer,
	"stance" text,
	"wins" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"draws" integer DEFAULT 0 NOT NULL,
	"kos" integer DEFAULT 0 NOT NULL,
	"bio" text,
	"photo_url" text,
	"photo_action" text,
	"instagram" text,
	"facebook" text,
	"tiktok" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matchups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar NOT NULL,
	"red_corner_id" varchar,
	"blue_corner_id" varchar,
	"weight_class" text,
	"weight_lbs" integer,
	"rounds" integer,
	"card_section" text DEFAULT 'main' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"label" text,
	"result" text,
	"result_method" text,
	"result_round" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"category" text DEFAULT 'general',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo_url" text,
	"website_url" text,
	"tier" text DEFAULT 'bronze' NOT NULL,
	"brand_color" text,
	"tagline" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "event_sponsors" ADD CONSTRAINT "event_sponsors_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_sponsors" ADD CONSTRAINT "event_sponsors_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_red_corner_id_fighters_id_fk" FOREIGN KEY ("red_corner_id") REFERENCES "public"."fighters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_blue_corner_id_fighters_id_fk" FOREIGN KEY ("blue_corner_id") REFERENCES "public"."fighters"("id") ON DELETE no action ON UPDATE no action;