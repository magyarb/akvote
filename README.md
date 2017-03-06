# akvote

koordi.info

#Telepítés

Lőjj össze valami szervert pl amazonon, én windowst javaslok rá. Beállításokban engedd rá a http forgalmat, a windows tűzfalat meg offold. Telepítsd a node-ot, postgres-t, gitet. Húzd le ezt a repót. A mappában:

npm install
cd public
npm install
cd ..

Ezután töltsd ki az env.js-t az adataiddal, egy fb appet létre kell hozni ehhez.

C:\Program Files\PostgreSQL\9.6\data\pg_hba.conf fájlba írd be az ip-det.

Otthonról csatlakozz rá navicattel vagy datagrippel, és futtasd le az sql mappában található két szkriptet.

Ennyi.
