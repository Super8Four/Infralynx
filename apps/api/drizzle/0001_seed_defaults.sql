INSERT INTO "sites" ("id", "name", "slug", "description")
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'Default site',
  'default',
  'Initial site created for the first IPAM workflow.'
)
ON CONFLICT ("slug") DO NOTHING;--> statement-breakpoint

INSERT INTO "vrfs" ("id", "name", "description")
VALUES (
  '22222222-2222-4222-8222-222222222222',
  'Global',
  'Default global routing table.'
)
ON CONFLICT ("name") DO NOTHING;
