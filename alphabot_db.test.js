const alphabot_db = require('./alphabot_db.js');
const sqlite3 = require('sqlite3').verbose();

describe('databaseTests', () => {
    let db;

    beforeAll(() => {
        db = new sqlite3.Database(':memory:');
        alphabot_db.initDb(db);
    });

    afterAll(() => {
        db.close();
    });

    beforeEach(() => {
        db.serialize(() => {
            db.run('DELETE FROM signups');
        });
    });

    describe('initSlots', () => {
        test('should be 12 slots', () => {
            alphabot_db.initSlots(db).then(() => {

                let count = 0;

                db.get('SELECT COUNT(*) AS count FROM slots', (err, row) => {
                    if(err) {
                        reject(err);
                    }
        
                    count = row.count;
                });

                expect(count).toBe(12);
            });
        });
    });

    describe('userIsSignedUp', () => {
        test('empty signup table', async () => {
            const discordUser = 'testuser';
            const raidDate = '2022-11-26';

            await expect(alphabot_db.userIsSignedUp(db, raidDate, discordUser)).resolves.toBeFalsy();
        });

        test('other users (1) signed up', async () => {
            const discordUser = 'testuser';
            const raidDate = '2022-11-26';

            //  Add another user to a slot
            db.serialize(() => {
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', ['foo user', raidDate, 1]);
            });

            await expect(alphabot_db.userIsSignedUp(db, raidDate, discordUser)).resolves.toBeFalsy();
        });

        test('other users (12) signed up', async () => {
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

            await expect(alphabot_db.userIsSignedUp(db, raidDate, discordUser)).resolves.toBeFalsy();
        });

        test('user is signed up', async () => {
            const discordUser = 'testuser';
            const raidDate = '2022-11-26';
            const slot = 1;

            //  Add this user to a slot
            db.serialize(() => {
                db.run('INSERT INTO signups (discord_user, raid_date, slot) VALUES (?, ?, ?)', [discordUser, raidDate, 1]);
            });

            await expect(alphabot_db.userIsSignedUp(db, raidDate, discordUser)).resolves.toBeTruthy();
        });
    });

    describe('slotIsTaken', () => {
        /*
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
        });*/
    });
});