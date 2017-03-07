# akvote

koordi.info

# Telepítés

Lőjj össze valami szervert pl amazonon, én windowst javaslok rá. Beállításokban engedd rá a http forgalmat, a windows tűzfalat meg offold. Telepítsd a node-ot, postgres-t, gitet. Húzd le ezt a repót. A mappában:

npm install

cd public

npm install

cd ..

Csinálj a gyökérmappába egy env.js-t az adataiddal, egy fb appet létre kell hozni ehhez. Ez a template:

~~~~ var env = {
    addr: "http://localhost:3000",
    port: 3000,
    votingStarts: new Date("2017.03.05. 12:30:00"),
    votingEnds: new Date("2017.03.06. 12:30:00"),
    fbclient: "*",
    fbsecret: "*",
    postgresSettings: {
        user: 'postgres', //env var: PGUSER
        database: 'postgres', //env var: PGDATABASE
        password: '*', //env var: PGPASSWORD
        host: 'localhost', // Server hosting the postgres database
        port: 5432, //env var: PGPORT
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    }
};


module.exports.env = env; 
~~~~

C:\Program Files\PostgreSQL\9.6\data\pg_hba.conf fájlba írd be az ip-det.

Otthonról csatlakozz rá az adatbázisra navicattel vagy datagrippel, és futtasd le az sql mappában található két szkriptet.

Ennyi. Futtatás:
node index.js
