/*
Navicat PGSQL Data Transfer

Source Server         : postgres2
Source Server Version : 90601
Source Host           : localhost:5432
Source Database       : postgres
Source Schema         : public

Target Server Type    : PGSQL
Target Server Version : 90601
File Encoding         : 65001

Date: 2017-03-06 18:10:15
*/


-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
"fbid" varchar(255) COLLATE "default" NOT NULL,
"fbtoken" varchar(255) COLLATE "default",
"email" varchar(255) COLLATE "default",
"name" varchar(255) COLLATE "default",
"picurl" varchar(255) COLLATE "default",
"isak" bool,
"ishok" bool,
"votedfor" varchar(255) COLLATE "default",
"applicationpdf" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD PRIMARY KEY ("fbid");
/*
Navicat PGSQL Data Transfer

Source Server         : postgres2
Source Server Version : 90601
Source Host           : localhost:5432
Source Database       : postgres
Source Schema         : public

Target Server Type    : PGSQL
Target Server Version : 90601
File Encoding         : 65001

Date: 2017-03-18 19:40:39
*/


-- ----------------------------
-- Table structure for votes
-- ----------------------------
DROP TABLE IF EXISTS "public"."votes";
CREATE TABLE "public"."votes" (
"user" varchar(255) COLLATE "default",
"votedfor" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Alter Sequences Owned By 
-- ----------------------------

-- ----------------------------
-- Indexes structure for table votes
-- ----------------------------
CREATE UNIQUE INDEX "egyszer" ON "public"."votes" USING btree ("votedfor", "user");

 CREATE OR REPLACE FUNCTION show_results2(ref refcursor) RETURNS refcursor AS $$

    BEGIN
      OPEN ref FOR (

SELECT "name", aksz, hoksz, akprec, hokprec, aksz+hoksz as sumsz, (akprec+hokprec)/2 as sumprec FROM

(
SELECT "name", aksz, hoksz, 

CASE
				WHEN hokprec IS NULL THEN
					0
				ELSE
					hokprec
				END AS hokprec,
CASE
				WHEN akprec IS NULL THEN
					0
				ELSE
					akprec
				END AS akprec
 FROM

(

SELECT 
CASE
				WHEN hok."name" IS NULL THEN
					ak."name"
				ELSE
					hok."name"
				END AS "name",
CASE
WHEN ak.aksz IS NULL THEN
					0
				ELSE
					ak.aksz
				END AS aksz,
CASE
WHEN hok.hoksz IS NULL THEN
					0
				ELSE
					hok.hoksz
				END AS hoksz,

hoksz*1000000/(SELECT COUNT(ishok)*100 FROM (
SELECT DISTINCT ON (szavazo."name")
szavazo.ishok
FROM	users as jelolt
INNER JOIN votes ON votes.votedfor = jelolt.fbid
INNER JOIN users as szavazo ON votes."user" = szavazo.fbid) as foo) as hokprec,

aksz*1000000/(SELECT COUNT(isak)*100 FROM (
SELECT DISTINCT ON (szavazo."name")
szavazo.isak
FROM	users as jelolt
INNER JOIN votes ON votes.votedfor = jelolt.fbid
INNER JOIN users as szavazo ON votes."user" = szavazo.fbid) as foo) as akprec

FROM
--AK szavazatok
(
SELECT
	jelolt."name" as "name",
	COUNT (szavazo."name") AS aksz
FROM	users as jelolt
INNER JOIN votes ON votes.votedfor = jelolt.fbid
INNER JOIN users as szavazo ON votes."user" = szavazo.fbid
WHERE
szavazo.isak IS TRUE
AND szavazo.ishok IS NOT TRUE
GROUP BY jelolt."name"
ORDER BY	aksz DESC 
) as ak
FULL JOIN 

--HOK szavazatok
(SELECT
	jelolt."name" as "name",
	COUNT (szavazo."name") AS hoksz
FROM	users as jelolt
INNER JOIN votes ON votes.votedfor = jelolt.fbid
INNER JOIN users as szavazo ON votes."user" = szavazo.fbid
WHERE
szavazo.ishok IS TRUE
GROUP BY jelolt."name"
ORDER BY	hoksz DESC ) as hok

ON ak."name" = hok."name") as foo )
 as foo ORDER BY sumprec DESC
);
      RETURN ref;
    END;
    $$ LANGUAGE plpgsql;

CREATE  OR REPLACE FUNCTION "public"."show_myvotes"(IN "myuser" text)
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


