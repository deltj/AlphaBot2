//import {jest} from '@jest/globals'
var alphabot = require('./alphabot.js');

describe('daySpec', () => {
    test('mon', () => {
        const input = 'slot 1 mon';
        const output = alphabot.daySpec(input);
        expect(output).toBe(1);
    });

    test('MON', () => {
        const input = 'slot 1 MON';
        const output = alphabot.daySpec(input);
        expect(output).toBe(1);
    });

    test('monday', () => {
        const input = 'slot 1 monday';
        const output = alphabot.daySpec(input);
        expect(output).toBe(1);
    });

    test('Monday', () => {
        const input = 'slot 1 Monday';
        const output = alphabot.daySpec(input);
        expect(output).toBe(1);
    });

    test('wed', () => {
        const input = 'slot 1 wed';
        const output = alphabot.daySpec(input);
        expect(output).toBe(3);
    });

    test('WED', () => {
        const input = 'slot 1 WED';
        const output = alphabot.daySpec(input);
        expect(output).toBe(3);
    });

    test('wednesday', () => {
        const input = 'slot 1 wednesday';
        const output = alphabot.daySpec(input);
        expect(output).toBe(3);
    });

    test('Wednesday', () => {
        const input = 'slot 1 Wednesday';
        const output = alphabot.daySpec(input);
        expect(output).toBe(3);
    });

    test('blahday', () => {
        const input = 'slot 1 blahday';
        const output = alphabot.daySpec(input);
        expect(output).toBe(-1);
    });

    test('slot 11 monday', () => {
        const input = 'slot 11 monday';
        const output = alphabot.daySpec(input);
        expect(output).toBe(1);
    })
});

describe('raidDate', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('Sunday', () => {
        const testDate = new Date('02 Jan 2022 13:00:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate().getDay();
        expect(raidDay).toBe(1);
    });

    test('Sunday, spec=1', () => {
        const testDate = new Date('02 Jan 2022 13:00:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate(1).getDay();
        expect(raidDay).toBe(1);
    });

    test('Monday, before cutoff', () => {
        const testDate = new Date('03 Jan 2022 22:29:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate().getDay();
        expect(raidDay).toBe(1);
    });

    test('Monday, after cutoff', () => {
        const testDate = new Date('03 Jan 2022 22:30:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate().getDay();
        expect(raidDay).toBe(3);
    });

    test('Monday, spec=1, before cutoff', () => {
        const testDate = new Date('03 Jan 2022 19:59:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate(1).getDay();
        expect(raidDay).toBe(1);
    });

    test('Monday, spec=1, after cutoff', () => {
        const testDate = new Date('03 Jan 2022 23:00:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate(1).getDay();
        expect(raidDay).toBe(1);
    });

    test('Tuesday', () => {
        const testDate = new Date('04 Jan 2022 13:00:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate().getDay();
        expect(raidDay).toBe(3);
    });

    test('Wednesday, spec=3, before cutoff', () => {
        const testDate = new Date('05 Jan 2022 19:59:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate(3).getDay();
        expect(raidDay).toBe(3);
    });

    test('Wednesday, spec=3, after cutoff', () => {
        const testDate = new Date('05 Jan 2022 22:00:00 EST');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate(3).getDay();
        expect(raidDay).toBe(3);
    });

    //  Bug hunting...
    test('Monday, spec=1, after cutoff', () => {
        const testDate = new Date('08 Aug 2022 23:44:00 EDT');
        jest.setSystemTime(testDate);

        const raidDay = alphabot.raidDate(1).getDay();
        expect(raidDay).toBe(1);
    });
});

describe('nextRaid', () => {
    test('1', () => {
        const input = 1;
        const output = alphabot.nextRaid(input);
        expect(output).toBe(3);
    });

    test('2', () => {
        const input = 2;
        const output = alphabot.nextRaid(input);
        expect(output).toBe(3);
    });

    test('3', () => {
        const input = 3;
        const output = alphabot.nextRaid(input);
        expect(output).toBe(5);
    });

    test('5', () => {
        const input = 5;
        const output = alphabot.nextRaid(input);
        expect(output).toBe(1);
    });
});
