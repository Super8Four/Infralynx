CREATE TABLE "aggregates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rir_id" uuid NOT NULL,
	"prefix" "cidr" NOT NULL,
	"family" "address_family" NOT NULL,
	"status" "resource_status" DEFAULT 'active' NOT NULL,
	"description" text,
	"owner" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "aggregates_prefix_unique" UNIQUE("prefix")
);
--> statement-breakpoint
CREATE TABLE "ip_ranges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vrf_id" uuid NOT NULL,
	"prefix_id" uuid NOT NULL,
	"start_address" "inet" NOT NULL,
	"end_address" "inet" NOT NULL,
	"prefix_length" integer NOT NULL,
	"family" "address_family" NOT NULL,
	"status" "resource_status" DEFAULT 'active' NOT NULL,
	"description" text,
	"owner" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prefix_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "prefix_roles_name_unique" UNIQUE("name"),
	CONSTRAINT "prefix_roles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rirs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rirs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "prefixes" ADD COLUMN "aggregate_id" uuid;--> statement-breakpoint
ALTER TABLE "prefixes" ADD COLUMN "role_id" uuid;--> statement-breakpoint
ALTER TABLE "aggregates" ADD CONSTRAINT "aggregates_rir_id_rirs_id_fk" FOREIGN KEY ("rir_id") REFERENCES "public"."rirs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ip_ranges" ADD CONSTRAINT "ip_ranges_vrf_id_vrfs_id_fk" FOREIGN KEY ("vrf_id") REFERENCES "public"."vrfs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ip_ranges" ADD CONSTRAINT "ip_ranges_prefix_id_prefixes_id_fk" FOREIGN KEY ("prefix_id") REFERENCES "public"."prefixes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "aggregates_rir_prefix_unique" ON "aggregates" USING btree ("rir_id","prefix");--> statement-breakpoint
ALTER TABLE "prefixes" ADD CONSTRAINT "prefixes_aggregate_id_aggregates_id_fk" FOREIGN KEY ("aggregate_id") REFERENCES "public"."aggregates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prefixes" ADD CONSTRAINT "prefixes_role_id_prefix_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."prefix_roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prefixes" ADD CONSTRAINT "prefixes_parent_id_prefixes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."prefixes"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "rirs" ("id", "name", "slug", "description")
VALUES (
  '33333333-3333-4333-8333-333333333333',
  'IANA',
  'iana',
  'Internet Assigned Numbers Authority'
)
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint
INSERT INTO "prefix_roles" ("id", "name", "slug", "description")
VALUES
  (
    '44444444-4444-4444-8444-444444444444',
    'Infrastructure',
    'infrastructure',
    'Infrastructure addressing'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Container',
    'container',
    'Prefix intended to contain child prefixes'
  )
ON CONFLICT ("slug") DO NOTHING;
