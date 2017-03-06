
CREATE
OR REPLACE FUNCTION show_results (REF refcursor) RETURNS refcursor AS $$
BEGIN
	OPEN REF FOR (
		SELECT
			nev,
			aksz,
			aksz * 10000 / (
				SELECT
					COUNT (votedfor) AS voterc
				FROM
					users
				WHERE
					isak = TRUE
				AND ishok IS NOT TRUE
			) AS akprec,
			hoksz,
			hoksz * 10000 / (
				SELECT
					COUNT (votedfor) AS voterc
				FROM
					users
				WHERE
					ishok = TRUE
			) AS hokprec,
			aksz + hoksz AS sumsz,
			(
				aksz * 10000 / (
					SELECT
						COUNT (votedfor) AS voterc
					FROM
						users
					WHERE
						isak = TRUE
					AND ishok IS NOT TRUE
				) + hoksz * 10000 / (
					SELECT
						COUNT (votedfor) AS voterc
					FROM
						users
					WHERE
						ishok = TRUE
				)
			) / 2 AS sumprec
		FROM
			(
				SELECT
					ak.nev,
					ak.szavazatok AS aksz,
					CASE
				WHEN hok.szavazatok IS NULL THEN
					0
				ELSE
					hok.szavazatok
				END AS hoksz
				FROM
					(
						SELECT
							nevek."name" AS nev,
							COUNT (szavazok.votedfor) AS szavazatok
						FROM
							users AS szavazok
						INNER JOIN users AS nevek ON szavazok.votedfor = nevek.fbid
						WHERE
							szavazok.isak = TRUE
						AND szavazok.ishok IS NOT TRUE
						GROUP BY
							nevek."name"
					) AS ak
				LEFT JOIN (
					SELECT
						nevek."name" AS nev,
						COUNT (szavazok.votedfor) AS szavazatok
					FROM
						users AS szavazok
					INNER JOIN users AS nevek ON szavazok.votedfor = nevek.fbid
					WHERE
						szavazok.ishok = TRUE
					GROUP BY
						nevek."name"
				) AS hok ON ak.nev = hok.nev
				UNION
					SELECT
						hok.nev,
						CASE
					WHEN ak.szavazatok IS NULL THEN
						0
					ELSE
						ak.szavazatok
					END,
					hok.szavazatok
				FROM
					(
						SELECT
							nevek."name" AS nev,
							COUNT (szavazok.votedfor) AS szavazatok
						FROM
							users AS szavazok
						INNER JOIN users AS nevek ON szavazok.votedfor = nevek.fbid
						WHERE
							szavazok.isak = TRUE
						AND szavazok.ishok IS NOT TRUE
						GROUP BY
							nevek."name"
					) AS ak
				RIGHT JOIN (
					SELECT
						nevek."name" AS nev,
						COUNT (szavazok.votedfor) AS szavazatok
					FROM
						users AS szavazok
					INNER JOIN users AS nevek ON szavazok.votedfor = nevek.fbid
					WHERE
						szavazok.ishok = TRUE
					GROUP BY
						nevek."name"
				) AS hok ON ak.nev = hok.nev
			) AS tabla
		ORDER BY
			sumprec DESC
	) ; RETURN REF ;
END ; $$ LANGUAGE plpgsql;
