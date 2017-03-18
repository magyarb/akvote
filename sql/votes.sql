CREATE TABLE "public"."votes" (
"user" varchar(255) COLLATE "default",
"votedfor" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)
;

ALTER TABLE "public"."votes" OWNER TO "postgres";

CREATE UNIQUE INDEX "egyszer" ON "public"."votes" USING btree ("votedfor" "pg_catalog"."text_ops", "user" "pg_catalog"."text_ops");

