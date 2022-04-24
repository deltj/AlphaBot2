'use strict';

const pjson = require('./package.json');
const { Client, Intents } = require("discord.js");
const fs = require('fs');

//  Add timestamps to console.log output
require('console-stamp')(console, {
    format: ':date(yyyy/mm/dd HH:MM:ss.l)'
});

//  The Discord client, see intent docs: https://discord.com/developers/docs/topics/gateway#list-of-intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const guilds = ['892906237799321650', '191716294943440897'];  //  test server, IL
let il_guild = undefined;

const commandPrefixes = '&!';
const available = fs.readFileSync('slots.txt').toString().trim().split('\n').filter(Boolean);

var slotlist = 'The **Alpha Squad** slots are:\n';
for (let i = 0; i < available.length; i++) {
    slotlist += (i + 1) + '. ' + available[i] + '\n';
}

const help = '**Available commands**:' + '\n(put a & in the beginning to address the bot)\n' + '\n__slot N__ sign up to play slot N in the next raid\n__slot clear__ clear a slot that you\'ve signed up for\n__slots__ list the signups for the next raid\n';

const raidNights = [1, 3, 5]; // Mon Wed Fri 
const nextRaid = {0: 1, 1: 3, 2: 3, 3: 5, 4: 5, 5: 1, 6: 1};
const dayNames = {1: 'Monday', 3: 'Wednesday', 5: 'Friday', 8: 'the next three raids'};
const ALL = 8;
const faces = [':slight_smile:', ':nerd:', ':star_struck:', ':rolling_eyes:', ':grimacing:', ':upside_down:', ':expressionless:'];

function face() {
    return faces[Math.floor(Math.random() * faces.length)];
}

function raidDate(specDate) {
    var date = new Date();
    var weekDay = date.getDay();
    if (raidNights.includes(weekDay)) {
        if (date.getHours() < 20) { // before eight on a raid Night
            weekDay = ((weekDay - 1) + 7) % 7; // sign up for today (js modulo sucks)
        }
    }
    var day = nextRaid[weekDay]; // default is next raid
    if (specDate != -1) {
        day = specDate;
    }
    return day;
}

/**
 * Given an attempt to describe a day of the week, for example "Wednesday" or "wed",
 * return the one-based day index.  The special value eight means all days of the week.
 * 
 * @param {*} text The text to analyze
 * @returns 1-8
 */
function daySpec(text) {
    if (text.includes(' sun')) {
        return 0;
    } else if (text.includes(' mon')) {
        return 1;
    } else if (text.includes(' tue')) {
        return 2;
    } else if (text.includes(' wed')) {
        return 3;
    } else if (text.includes(' thu')) {
        return 4;
    } else if (text.includes(' fri')) {
        return 5;
    } else if (text.includes(' sat')) {
        return 6;
    } else if (text.includes(' all') || text.includes(' week') ||
           (text.includes(' w') && !text.includes(' wa') && !text.includes(' wi')) || text.includes(' a')) {
        return ALL;
    }
    return -1; // none specified
}

/**
 * Respond to "alpaca" with a llama graphic
 * @param {*} message 
 */
function alpaca(message) {
    //  Check if there are any alpacas
    const text = message.content.toLowerCase();
    const n = (text.match(/alpaca/g) || []).length;
    if (n > 0) {

        //  Reply with a llama graphic for each instance of the word alpaca
        var a = '';
        for (var i = 0; i < n; i++) {
            a += ':llama:';
        }
        message.channel.send(a);
    }
}

/**
 * Process a slot command and return a response for the user
 * 
 * @param {*} nick The nickname of the person signing up
 * @param {*} day An integer representing the day of the week (same numbers as cron) 
 * @param {*} slot An integer representing the slot being signed up for
 * @param {*} clear If true, clear this person's slot
 * @returns A response for the channel/person who issued the command
 */
function signupForSlot(nick, day, slot, clear) {

    // data = [status, curr['role'], curr['rss'], curr['class'], timing, name, nickname, url]; // RESPONSE FILE SYNTAX

    //  Read the slots file for the specified day

    //  The format of the slots file is: <N> <member>
    //  Where N is a slot number (1-12) and member is the name of the person who
    //  signed up.  They are separated by a single space.
    let taken = fs.readFileSync('slots_' + day + '.log').toString().trim().split('\n').filter(Boolean);

    var mapping = {};
    var rewrite = false;
    var resp = '';
    var prev = '';

    //  Iterate the slots that are already taken for this raid and look for a match
    for (let i = 0; i < taken.length; i++) {
        //  Each item in the taken array describes a slot that someone has signed up for
        //    fields[0] is the slot number
        //    fields[1] is the nickname of the person signed up
        const tokens = taken[i].split(" ");

        //  We expect (at least) two fields for each entry (slot, nickname)
        if (tokens.length > 1) {

            //  We can't simply split the file entry on the space character, because
            //  some nicknames may include spaces.  To accommodate this we'll consider
            //  the first token the slot number, and join all subsequent tokens to
            //  recover the nickname
            const takenSlot = tokens.shift();
            const takenNick = tokens.join(" ");

            //  Slot index in the mapping object is zero-based
            const index = parseInt(takenSlot) - 1;

            if (!(index in mapping)) {
                if (takenNick == nick) {
                    if (slot > 0 || clear) {
                        if (!clear) {
                            return 'You are already signed up. Please use *&slot clear* to clear the existing sign-up first.';
                        } else {

                            rewrite = true;
                            taken[i] = '';
                            prev = index;        
                        }
                    }
                }
                mapping[index] = takenNick;
            }
        }
    }
    //console.log(available.length, ' slots', taken, mapping, slotlist);

    if (rewrite) {
        fs.writeFileSync('slots_' + day + '.log', taken.join('\n') + '\n', (err) => { 
            if (err) throw err;
        });

        if(day == 8) {
            return 'Your sign-up for slot ' + (prev + 1) + 'has been cleared, ' + nick;
        } else {
            return 'Your sign-up for slot ' + (prev + 1) + ' on ' + dayNames[day] + ' has been cleared, ' + nick;
        }
    }

    var show = available.length;
    if (slot < 1) { // display slots
        resp = 'The raid slots for ' + dayNames[day] + ' are:\n\n';

        for (let i = 0; i < show; i++) {
            resp += (i + 1) + '. ' + available[i];
            if (i in mapping) {
                resp += ' **' + mapping[i] + '**';
            } else {
                resp += ' *available*';
            }
            resp += '\n';
        }
        return resp;
    } else {
        //console.log(slot, mapping);
        let index = slot - 1;
        if (index in mapping) {
            return 'That slot is already taken :cry:';
        } else {
            fs.appendFileSync('slots_' + day + '.log', slot + ' ' + nick + '\n', (err) => {
                if (err) throw err;
            });

            if(day == 8) {
                return 'You are now signed up for slot ' + slot + ', ' + nick + face();
            } else {
                return 'You are now signed up for slot ' + slot + ' on ' + dayNames[day] + ', ' + nick + ' ' + face();
            }
            
        } 
    }
}

/**
 * Process a command
 * @param {*} message 
 */
async function process(message) {
    
    const channel = message.channel;
    const user = message.member.user;
    const member = await il_guild.members.fetch(user);
    const nickname = member.displayName;

    console.log(message.guild.name + '/' + message.channel.name + '/' + nickname + ': ' + message.content)

    //  Only listen to alpha channels
    if (channel.name.includes('alpha')) {
    
        //  Only process commands in the alpha-signup channel
        if (channel.name == 'alpha-signup') {

            //  Force command to lowercase to simplify parsing, trim whitespace, and strip command prefix
            const text = message.content.toLowerCase().trim().substring(1);
            
            //  Respond to help
            if (text.startsWith('h')) {
                channel.send(help);
            }
        
            //  Respond to slot command
            else if (text.includes('slot')) {            
                const specDate = daySpec(text);
                const day = raidDate(specDate);
                const slot = parseInt(text.substring(text.indexOf('slot') + 4)) || 0;

                channel.send(signupForSlot(nickname, day, slot, text.includes('clear')));
            }

            //  Respond to version command
            else if (text.includes('ver')) {
                channel.send('I am AlphaBot version ' + pjson.version + '.  Details here: https://github.com/deltj/AlphaBot2');
            }

            else {
                //  Unrecognized command
                channel.send('wat');
            }
        } else {
            channel.send('I have been confined to the <#667529156212293664> channel. Please talk to me there.')
        }
    }
}

/**
 * Emitted whenever a message is created.
 * 
 * Note that the message event was deprecated in Discord.js v13
 */
client.on("messageCreate", (message) => {

    //  Only handle messages from configured guilds
    if (guilds.indexOf(message.guild.id) > -1) {

        //  Handle commands
        if (commandPrefixes.includes(message.content.trim().at(0))) {
            process(message);
        }
    
        //  Handle Alpaca messages 
        else {
            alpaca(message); // for Ags
        }
    }
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.guilds.cache.forEach(guild => {
        console.log('Handling guild: ' + guild.name + ' [' + guild.id + ']');
    });

    il_guild = client.guilds.cache.get('191716294943440897');
});

//  Read the bot's discord token from the filesystem
const ID = fs.readFileSync('token.txt').toString().trim();

//  Log into discord using the token
client.login(ID);
