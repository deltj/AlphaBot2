const alphabot_db = require('./alphabot_db.js');
const sqlite3 = require('sqlite3').verbose();

describe('databaseTests', () => {
    let db;

    beforeAll(() => {
        db = new sqlite3.Database(':memory:');
        db.run('CREATE TABLE IF NOT EXISTS signups (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, discord_user TEXT, raid_date TEXT, slot INTEGER)');
    });

    afterAll(() => {
        db.close();
    });

    beforeEach(() => {
        db.serialize(() => {
            db.run('DELETE FROM signups');
        });
    });

    describe('userIsSignedUp', () => {
        test('false_empty', () => {
            const discordUser = 'testuser';
            const raidDate = '2022-11-26';

            alphabot_db.userIsSignedUp(db, raidDate, discordUser).then((result) => {
                expect(result).toBeFalsy();
            });
        });

        test('false_others', () => {
            const discordUser = 'testuser';
            const raidDate = '2022-11-26';

            //  Add another user to a slot
            db.serialize(() => {
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user', raidDate, 1]);
            });

            alphabot_db.userIsSignedUp(db, raidDate, discordUser).then((result) => {
                expect(result).toBeFalsy();
            });
        });

        test('false_others2', () => {
            const discordUser = 'testuser';
            const raidDate = '2022-11-26';

            //  Add another user to a slot
            db.serialize(() => {
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 1', raidDate, 1]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 2', raidDate, 2]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 3', raidDate, 3]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 4', raidDate, 4]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 5', raidDate, 5]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 6', raidDate, 6]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 7', raidDate, 7]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 8', raidDate, 8]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 9', raidDate, 9]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 10', raidDate, 10]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 11', raidDate, 11]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 12', raidDate, 12]);
            });

            alphabot_db.userIsSignedUp(db, raidDate, discordUser).then((result) => {
                expect(result).toBeFalsy();
            });
        });

        test('true', () => {
            const discordUser = 'testuser';
            const raidDate = '2022-11-26';
            const slot = 1;

            //  Add this user to a slot
            db.serialize(() => {
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', [discordUser, raidDate, 1]);
            });

            alphabot_db.userIsSignedUp(db, raidDate, discordUser).then((result) => {
                expect(result).toBeTruthy();
            });
        });
    });

    describe('slotIsTaken', () => {
        test('false_empty', () => {
            const slot = 1;
            const raidDate = '2022-11-26';

            alphabot_db.slotIsTaken(db, raidDate, slot).then((result) => {
                expect(result).toBeFalsy();
            });
        });

        test('false_others', () => {
            const slot = 1;
            const raidDate = '2022-11-26';

            //  Add some other signups besides this slot
            db.serialize(() => {
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 2', raidDate, 2]);
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 3', raidDate, 3]);
            });

            alphabot_db.slotIsTaken(db, raidDate, slot).then((result) => {
                expect(result).toBeFalsy();
            });
        });

        test('true', () => {
            const slot = 1;
            const raidDate = '2022-11-26';

            //  Add another signup for this slot
            db.serialize(() => {
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user 1', raidDate, 1]);
            });

            alphabot_db.slotIsTaken(db, raidDate, slot).then((result) => {
                expect(result).toBeTruthy();
            });
        });
    });
});