 CREATE OR REPLACE FUNCTION show_results2(ref refcursor) RETURNS refcursor AS $$

    BEGIN
      OPEN ref FOR (

SELECT "name", aksz, hoksz, akprec, hokprec, (akprec+hokprec)/2 as sumprec FROM

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