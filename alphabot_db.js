'use strict';

module.exports = { initDb, initSlots, userIsSignedUp, slotIsTaken };

/*const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('/var/db/AlphaBot2/alphabot.db', (err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Connected to the AlphaBot database.');
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS signups (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, discord_user TEXT, raid_date TEXT, slot INTEGER)');

    let user = 'testuser';
    let raid_date = '2022-11-26';

    db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['test', '2018-01-01', 1], function(err) {
        if(err) {
            return console.log(err);
        }

        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
});

db.close((err) => {
    if(err) {
        return console.log(err);
    }

    console.log('Closed the database connection.');
});
*/

/**
 * Create tables for the AlphaBot database
 * @param {*} db The SQLite database to use
 */
function initDb(db) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS signups (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, discord_user TEXT, raid_date TEXT, slot INTEGER)');
            db.run('CREATE TABLE IF NOT EXISTS slots (id INTEGER PRIMARY KEY, desc TEXT)');

            resolve();
        });
    });
}

/**
 * Initialize raid slots in a default 5/5/2 configuration.
 * @param {*} db The SQLite database to use
 */
function initSlots(db) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [1, 'DD']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [2, 'DD']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [3, 'DD']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [4, 'DD']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [5, 'DD']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [6, 'Healer']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [7, 'Healer']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [8, 'Healer']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [9, 'Healer']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [10, 'Healer']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [11, 'Support']);
            db.run('INSERT INTO slots (id, desc) VALUES (?, ?)', [12, 'Support']);
        });
    });
}

/**
 * Checks whether the specified user is signed up for the specified raid date.
 * 
 * @param {*} db The SQLite database to use
 * @param {*} raidDate The date of the raid to check
 * @param {*} userName The user to check
 */
function userIsSignedUp(db, raidDate, userName) {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS count FROM signups WHERE discord_user = ? AND raid_date = ?', [userName, raidDate], (err, row) => {
            if(err) {
                reject(err);
            }

            resolve(row.count > 0);
        });
    });
}

/**
 * Checks whether the specified slot is taken for the specified raid date.
 * 
 * @param {*} db The SQLite database to use
 * @param {*} raidDate The date of the raid to check
 * @param {*} slot The slot to check
 */
function slotIsTaken(db, raidDate, slot) {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS count FROM signups WHERE slot = ? AND raid_date = ?', [slot, raidDate], (err, row) => {
            if(err) {
                reject(err);
            }

            resolve(row.count > 0);
        });
    });
}
