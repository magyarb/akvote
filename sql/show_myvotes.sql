CREATE FUNCTION "public"."show_myvotes"(IN "myuser" text)
  RETURNS TABLE("name" text, "picurl" text, "fbid" text, "applicationpdf" text, "user" text)  AS $BODY$SELECT
				users."name",
				users.picurl,
				users.fbid,
				users.applicationpdf,
				votes."user"
			FROM
				users
			FULL JOIN votes ON votes.votedfor = users.fbid
			WHERE
				users.applicationpdf IS NOT NULL
			AND (votes."user" = myuser OR votes."user" IS NULL)
ORDER BY users."name"$BODY$
  LANGUAGE 'sql' VOLATILE COST 100
 ROWS 1000
;

ALTER FUNCTION "public"."show_myvotes"(IN "myuser" text) OWNER TO "postgres";

