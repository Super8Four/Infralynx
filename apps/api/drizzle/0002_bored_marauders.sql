CREATE TYPE "public"."facility_status" AS ENUM('active', 'planned', 'retired');--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"status" "facility_status" DEFAULT 'active' NOT NULL,
	"parent_id" uuid,
	"facility" varchar(100),
	"description" text,
	"owner" varchar(200),
	"comments" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"parent_id" uuid,
	"description" text,
	"owner" varchar(200),
	"comments" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "regions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"parent_id" uuid,
	"description" text,
	"owner" varchar(200),
	"comments" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_groups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "status" "facility_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "region_id" uuid;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "facility" varchar(100);--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "time_zone" varchar(100);--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "physical_address" text;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "shipping_address" text;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "latitude" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "longitude" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "owner" varchar(200);--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "comments" text;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_locations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_parent_id_regions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_groups" ADD CONSTRAINT "site_groups_parent_id_site_groups_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "locations_site_slug_unique" ON "locations" USING btree ("site_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "locations_site_parent_name_unique" ON "locations" USING btree ("site_id","parent_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "regions_parent_name_unique" ON "regions" USING btree ("parent_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "site_groups_parent_name_unique" ON "site_groups" USING btree ("parent_id","name");--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_group_id_site_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."site_groups"("id") ON DELETE set null ON UPDATE no action;