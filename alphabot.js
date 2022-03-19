const Canvas = require('canvas');
const { Client, Intents } = require("discord.js");
const fs = require('fs');

//  The Discord client, see intent docs: https://discord.com/developers/docs/topics/gateway#list-of-intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

let raid  = {};
const guilds = ['892906237799321650', '191716294943440897'];  //  test server, IL
let il_guild = undefined;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.guilds.cache.forEach(guild => {
        console.log('Handling guild: ' + guild.name + ' [' + guild.id + ']');
    });

    il_guild = client.guilds.cache.get('191716294943440897');
});

'use strict';

const commandPrefix = '&';
const debugMode = true;
const { spawnSync } = require('child_process');
const available = fs.readFileSync('slots.txt').toString().trim().split('\n').filter(Boolean);
var slotlist = 'The **Alpha Squad** slots are:\n';
for (let i = 0; i < available.length; i++) {
    slotlist += (i + 1) + '. ' + available[i] + '\n';
}

async function chat(message) {
    const tag = message.author.tag;
    if (tag.includes('AlphaBot')) { // it me, Mario
        return;
    }
    var usuario =  tag.split('#')[0];
    var text = message.content.toLowerCase();
    if (!text.includes('slot')) {
        message.author.send('Sorry, I only talk about the slot builds by DM.').catch(error => { console.log(tag + ' cannot receive bot DM') });
        return;
    }
    const m = guild.member(message.author);
    if (!m.roles.cache.find(role => role.name === 'Alpha Squad')) {
        message.author.send('Sorry, I am only allowed to respond to Alpha Squad members.').catch(error => { console.log(tag + ' cannot receive bot DM') });
    } else {
        if (text.includes('slots')) {
            message.author.send(slotlist);
        } else {
            const start = text.indexOf('slot') + 4;
            const slot = parseInt(text.substring(start));
            if (slot > 0 && slot < 21) {
                const data = fs.readFileSync('slot' + slot + '.txt').toString().trim();
                message.author.send('**Alpha Squad Slot ' + slot + '**\n\n' + data).catch(error => { console.log(tag + ' cannot receive bot DM') });
            } else {
                message.author.send('Sorry, but I only know builds for slots from 1 to 20.').catch(error => { console.log(tag + ' cannot receive bot DM') });
            }
        }
    }
}

const separator = ' # ';
const roleInfo ='\nThe commands *signup* and *maybe* can be accompanied by role info: **d**amage, **s**upport/**u**tility, **h**eals, or **f**lexible (meaning you could take one of 2+ roles if needed). Also class (templar, DK, etc.) and primary resource (magicka or stamina) can be specified. You can also write a custom specification indicating any sets, skills, or ultimates you would like to mention by enclosing them in parenthesis.\n\nYou can set a default role with the *default* command using the same role specifiers; once a default has been set, future sign-ups employ that role unless you specify another one.\n';
const dateInfo = '\nBy default, you will be responding to the next raid; you can use *Mon Fri Sat* to specify a date, whereas using *all* or *week* refers to the next three raids.\n';
const earlyLate = '\nYou can also include the words *late* or *early* to indicate if you will be joining late or leaving early (or even both).\n';
const feedback = '\nIf anything seems broken or unpleasant, just tag *satuelisa* and express your concerns. <:Agswarrior:552592567875928064>'; 
const options = roleInfo + earlyLate + dateInfo + '\nUse __**h**ustle__ to see this help text and __**r**aid__ to just view the sign-ups.';
const help = '**Available commands**:' + '\n(put a ' + commandPrefix + ' in the beginning to address the bot)\n' + '\n__slot N__ sign up to play slot N in the next raid\n__slot clear__ clear a slot that you\'ve signed up for\n__slots__ list the signups for the next raid\n';

const symbols = {0: ':confused:', 1: '<:damage:667107746868625458>',
         2: '<:support:667107765872754738>',
         3: '<:healer:667107717567217678>',
         4: '<:flexible:667163606210707467>',
         5: '<:noshow:674053654067806208>'}; // unavailable
const roleDescr = {0: 'surprise role', 1: 'damage', 2: 'support', 3: 'healer', 4: 'flexible spot'};
const classDescr = {0: '', 1: 'templar ', 2: 'sorc ', 3: 'DK ', 4: 'NB ', 5: 'necro ', 6: 'warden '};
const rssDescr = {0: '', 1: 'mag ', 2: 'stam '}

// <TOON SPECS>
const toonClass= {' t': 1, // templar
          ' so': 2, // sorcerer,
          ' dr': 3, // dragonknight
          ' dk': 3, // dragonknight
          ' nb': 4, // nightblade
          ' ni': 4, // nightblade
          ' ne': 5, // necromancer
          ' w': 6} // warden
const classNames = {0: '', 1: 'templar', 2: 'sorcerer', 3: 'dragonknight', 4: 'nightblade', 5: 'necromancer', 6: 'warden'};
const toonRss = {' ma': 1, // magicka
         ' st': 2, // stamina
         ' hy': 3}; // hybrid
const rssNames = {0: '', 1: 'magicka', 2: 'stamina', 3: 'hybrid'};
const toonRole = {' da': 1, ' dp': 1, ' dm': 1, // dps
          ' su': 2, ' u': 2, // support
          ' he': 3, // heals
          ' mu': 4} // multiple
const roleNames = {0: '', 1: 'damage dealer', 2: 'support/utility', 3: 'healer', 4: 'multitask'}
// </ TOON SPECS>

const classSymbols = {0: ':question:',
              1: '<:templar:698500236200509460>',
              2: '<:sorc:698500294505398283>',
              3: '<:dk:698500389749784606>',
              4: '<:nb:698500311849107456>',
              5: '<:necro:698500303892381784>',
              6: ' <:warden:698500220102770718>'}
const magSymbols = {0: ':blue_circle:',
            1: '<:magplar:698500333198114917>',
            2: '<:magsorc:698500323471523920>',
            3: '<:magdk:698500344098848809>',
            4: '<:magblade:698500374021275710>',
            5: '<:magcro:698500365267763230>',
            6: '<:magden:698500356350672967>'}
const stamSymbols = {0: ':green_circle:',
            1: '<:stamplar:698500259256467471>',
            2: '<:stamsorc:698500249106251806>',
            3: '<:stamdk:698500268840714271>',
            4: '<:stamblade:698500285978640456>',
            5: '<:stamcro:698500494103937094>',
            6: '<:stamden:698500277073870888>'}

const classIcons = {1: 'templar.png',
            2: 'sorc.png',
            3: 'dk.png',
            4: 'nb.png',
            5: 'necro.png',
            6: 'warden.png'}
const magIcons = {1: 'magplar.png',
            2: 'magsorc.png',
            3: 'magdk.png',
            4: 'magblade.png',
            5: 'magcro.png',
            6: 'magden.png'}
const stamIcons = {1: 'stamplar.png',
          2: 'stamsorc.png',
          3: 'stamdk.png',
          4: 'stamblade.png',
          5: 'stamcro.png',
          6: 'stamden.png'}

const timeDescr = {0: '',
           1: ' <:time:668502892432457736> *[joining late, leaving early]* ',
           2: ' <:time:668502892432457736> *[joining late]* ',
           3: ' <:time:668502892432457736>  *[leaving early]* '};
const confirm = {1: 'confirmed', 2: 'possible', 3: 'unavailable'};
const raidNights = [1, 3, 5]; // Mon Wed Fri 
const nextRaid = {0: 1, 1: 3, 2: 3, 3: 5, 4: 5, 5: 1, 6: 1};
const dayNames = {1: 'Monday', 3: 'Wednesday', 5: 'Friday', 8: 'the next three raids'};
const ALL = 8;
const stopWords = ["for", "as", "a", "an", "the", "of", "raid", "up", "tonight", "today", "yo", "me", "sign", "up", "gift", "gods", "to", "please"];
const prefixList = ["mon", "wed", "fri", "all", "week"];
const indices = {'status': 0, 'role': 1,
         'resource': 2, 'class': 3,
         'timing': 4, 'name': 5,
         'nick': 6, 'url': 7, 'specs': 8,
         'defName': 0, 'defRole': 1,
         'defRss': 2, 'defClass': 3, 'defSpecs': 4};
const roleIcons = {1: 'dmg.png', 2: 'sup.png', 3: 'heal.png', 4: 'flex.png'};
const style = {0: '#999999', 1: '#00ee00', 2: '#0000cc', 3: '#dd0000'};
const timeIcon = 'hourglass.png';
const avatarSize = 64;
const iconSize = 128;
const defaultAvatar = 'https://supporst.discordapp.com/hc/user_images/l12c7vKVRCd-XLIdDkLUDg.png';

loadLogs();

function removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b)
};

function formatSpecs(specs) {
    if (specs == undefined) {
    specs = '';
    }
    if (specs.length > 0) {
    specs = ' (' + specs + ') ';
    }
    return specs;
}
function filename(d) {
    return 'alphabot_' +  d + '.log';
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
    if (debugMode) {
    console.log(weekDay, specDate, day);
    }
    return day;
}

function reply(data, day) {
    var status = data[indices['status']];
    var role = data[indices['role']];
    var cID = data[indices['class']];
    var rID = data[indices['resource']];
    var timing = data[indices['timing']];
    var r = 'You are *' + confirm[status] + '*';
    var specs = formatSpecs(data[indices['specs']]);
    if (debugMode) {
    console.log('reply for', day);
    }
    if (status != 3) {
    r += ' as ' + rssDescr[rID] + classDescr[cID] + roleDescr[role];
    }
    return r + specs + ' for ' + dayNames[day]  + timeDescr[timing] + ' ' + symbols[role] + ', ' + data[indices['nick']] + '!';
} 

function daySpec(text) {
    if (text.includes(' mon')) {
    return 1;
    } else if (text.includes(' wed')) {
    return 3;
    } else if (text.includes(' fri')) {
    return 5;
    } else if (text.includes(' all') || text.includes(' week') ||
           (text.includes(' w') && !text.includes(' wa') && !text.includes(' wi')) || text.includes(' a')) {
    return ALL;
    }
    return -1; // none specified
}

function loadLogs() { // update a global storage
    for (var i = 0; i < raidNights.length; i++) {
    var rn = raidNights[i];
    raid[rn] = fs.readFileSync(filename(rn)).toString().trim().split('\n').filter(Boolean).sort();
    }
    return;
}

function roleSelection(text) {
    var fields = text.split(' ');
    for (var i = 1; i < fields.length; i++) { // scan for role specification
    var spec = fields[i];
    if (!stopWords.includes(spec)) {
        var skip = false;
        for (var j = 0; j < prefixList.length; j++) {
        if (spec.startsWith(prefixList[j])) {
            skip = true;
            break;
        }
        }
        if (!skip) {
        if (spec.startsWith('d') && !spec.includes('dk')) { // damage, dps, deeps, dmg
            return 1;
        } else if ((spec.startsWith('s') || spec.startsWith('u')) && !spec.startsWith('st')) { // support, utility
            return 2;
        } else if (spec.startsWith('h')) { // healer, heals, healing
            return 3;
        } else if (spec.startsWith('f')) { // flexible
            return 4;
        }
        }
    }
    }
    return 0; // unspecified
}

function rssSelection(text) {
    var fields = text.split(' ');
    for (var i = 1; i < fields.length; i++) { // scan for role specification
    var spec = fields[i];
    if (!stopWords.includes(spec)) {
        var skip = false;
        for (var j = 0; j < prefixList.length; j++) {
        if (spec.startsWith(prefixList[j])) {
            skip = true;
            break;
        }
        }
        if (!skip) {
        if (spec.startsWith('mag')) { // magicka
            return 1;
        } else if (spec.startsWith('stam')) { // stamina
            return 2;
        }
        }
    }
    }
    return 0; // unspecified
}

function specsSelection(text) {
    var start = text.indexOf('(');
    var end = text.indexOf(')');
    if (start + 1 <  end) {
    return text.substring(start + 1, end);
    } else {
    return '';
    }
}
    
function classSelection(text) {
    var fields = text.split(' ');
    for (var i = 1; i < fields.length; i++) { // scan for role specification
    var spec = fields[i];
    if (!stopWords.includes(spec)) {
        var skip = false;
        for (var j = 0; j < prefixList.length; j++) {
        if (spec.startsWith(prefixList[j])) {
            skip = true;
            break;
        }
        }
        if (!skip) {
        if (spec.startsWith('temp') || spec.endsWith('plar')) { // templar
            return 1;
        } else if (spec.includes('sorc')) { // sorc
            return 2;
        } else if (spec.includes('dk')) { // DK
            return 3;
        } else if (spec.includes('blade') || spec.includes('nb')) { // nightblade
            return 4;
        } else if (spec.endsWith('cro') || spec.startsWith('necro')) { // necromancer
            return 5;
        } else if (spec.endsWith('den') || spec.startsWith('warden')) { // warden
            return 6;
        }
        }
    }
    }
    return 0; // unspecified
}

function currentDefault(name) {
    var defaults = fs.readFileSync('roles.log').toString().trim().split('\n').filter(Boolean);
    for (var i = 0; i < defaults.length; i++) {
    var f = defaults[i].split(separator);
    if (f[indices['defName']] == name) { // default has already been set
        var defs = {'role':  parseInt(f[indices['defRole']]),
            'rss': parseInt(f[indices['defRss']]),
            'class': parseInt(f[indices['defClass']]),
            'specs': ''};
        if (f.length > indices['defSpecs']) {
        defs.specs = f[indices['defSpecs']];
        }
        return defs;
    }
    }
    return {'role': 0, 'rss': 0, 'class': 0, 'specs': ''};
}

function currentStatus(name, day) {
    if (debugMode) {
    console.log('checking current status', name, day);
    }
    var resp = raid[day];
    for (var i = 0; i < resp.length; i++) {
    var f = resp[i].split(separator);
    if (f[indices['name']] == name) {
        var curr = {'role': parseInt(f[indices['role']]),
            'rss': parseInt(f[indices['resource']]),
            'class': parseInt(f[indices['class']])};
        return curr;
    }
    }
    return {'role': 0, 'rss': 0, 'class': 0};    
}

// helper method from https://discordjs.guide/popular-topics/canvas.html#adding-in-text
const applyText = (canvas, text, av) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 50;
    do {
    ctx.font = `${fontSize -= 2}px sans serif`;
    } while (ctx.measureText(text).width >= av);
    return ctx.font;
};

async function ack(data, day, message, msg) {
    var name = data[indices['nick']];
    if (debugMode) {
    console.log('thanking', name);
    }    
    var status = data[indices['status']];
    var role = data[indices['role']];
    var rID = data[indices['resource']];
    var cID = data[indices['class']];
    var url = data[indices['url']];
    var text = name + '\n' + confirm[status]; 
    if (status == 1 || status == 2) {
    text += ' as\n' + rssDescr[rID] + classDescr[cID] + roleDescr[role];	
    }
    if (day != 8) {
    text += '\nfor ' + dayNames[day]; 
    }
    if (debugMode) {
    console.log(text);
    }
    message.channel.send(msg);
    return;
}

function addResponse(data, day, message, thanks) {
    if (debugMode) {
    console.log('new response for', day);
    }
    var appendix = '';
    if (data[indices['status']] !=3 && data[indices['role']] == 0) { 
    appendix = '\n' + roleInfo;
    }
    fs.appendFileSync(filename(day), '\n' + data.join(separator) + '\n', (err) => {
    if (err) throw err;
    });
    raid[day].push(data.join(separator));
    if (thanks) {
        ack(data, day, message, listing(undefined, day, false, false) + appendix);
    }
    return;
}

function updateStatus(data, day) {
    var resp = raid[day];
    var name = data[indices['name']];
    var status = data[indices['status']];
    var role = data[indices['role']];
    var rID = data[indices['resource']];
    var cID = data[indices['class']];
    var timing = data[indices['timing']];
    if (debugMode) {
    console.log('checking', name, 'for', day);
    }
    for (var i = 0; i < resp.length; i++) {
    var f = resp[i].split(separator);
    if (f[indices['name']] == name) {
        if (debugMode) {
        console.log('match of', name, 'for', day, '\n', f);
        }	    
        resp[i] = data.join(separator); // rewrite entry and file
        fs.writeFileSync(filename(day), resp.join('\n') + '\n', (err) => { 
        if (err) throw err;
        });
        return true;
    }
    }
    return false; // no match
}
    
function listing(channel, day) {
    if (debugMode) {
        console.log('listing for', day);
    }
    var resp = raid[day].sort();
    var singular = '';
    var plural = 's';
    var count = resp.length;
    if (resp.length == 1) {
    plural = '';
    singular = 'one';
    count = '';
    }
    var list = 'For **' + dayNames[day] + '**, we have ' + singular +  count + ' response' + plural + ':\n'; 
    var i = 1;
    var prev = 0;
    for (r in resp) {
    var userData = resp[r].split(separator);
    var status = parseInt(userData[indices['status']]);
    var role = parseInt(userData[indices['role']]);
    var rID = parseInt(userData[indices['resource']]);
    var cID = parseInt(userData[indices['class']]);
    var timing = parseInt(userData[indices['timing']]);
    var nickname = userData[indices['nick']];
    var specs = formatSpecs(userData[indices['specs']]);
    var prefix = '';
    if (status != prev) {
        var firstYes = true;
        var firstMaybe = true;
        var firstNo = true;
        prev = status;
    }
    switch (status) {
    case 1: // attendee
        if (firstYes) {
        list += '__Attending:__\n';
        firstYes = false;
        }
        nickname = '**' + nickname + '**'; // boldface	    
        prefix = i + '. ';
        i++;
        break;
    case 2: // maybe
        if (firstMaybe) {
        list += '__Possibly attending:__\n';
        firstMaybe = false;
        }	    
        prefix = '? ';
        break;
    case 3: // declined
        if (firstNo) {
        list += '__Unable to attend:__\n';
        firstNo = false;
        }
        nickname = '~~' + nickname + '~~'; // crossed out
        role = 5;
        break;
    }
    var source = undefined;
    switch (rID) {
    case 0:
        source = classSymbols;
        break;
    case 1:
        source = magSymbols;
        break;
    case 2:
        source = stamSymbols;
        break;
    }
    list += prefix + symbols[role] + ' ' + source[cID] + ' ' + nickname + specs + timeDescr[timing] + '\n';
    }
    return list;
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

function listRaid(channel, day) {
    var text = undefined;
    if (raid[day].length == 0) {
    text = '*Nobody* has responded for **' + dayNames[day] + '**  :frowning2:';
    } else {
    text = listing(channel, day);
    }
    if (channel != undefined && text != undefined) {
    console.log(channel, text);
    channel.send(text);
    } 
    return text;
}

function manageToons(name, nickname, channel, text) {
    if (text.includes(' help')) {
    channel.send('Writing just **!toon** will print out a list of the registered toons.\n' +
             'To define a new toon, use **!toon add <class> <rss> <role>** where\n' +
             '**class** is one of: *templar*, *sorc*, *DK*, *NB*, *warden*, or *necro*;\n' +
             '**rss** is one of: *magicka*, *stamina*, or *hybrid*;\n' +
             '**role** is one of: *damage*, *support*, *healer*, or *multitask.\n' + 
             'I recognize many ways to type each role, resource type, and role.');
    return;
    } if (text.includes(' add')) {
    var tc = 0; // parse class
    for (let entry of Object.entries(toonClass)) {
        let className = entry[0];
        let classID = entry[1];
        if (debugMode) {
        console.log(className, classID);
        }
        if (text.includes(className)) {
        tc = classID;
        break;
        }
    }
    if (tc == 0) {
        channel.send('I am sorry, but I did not understand what the class for this toon is (templar, sorc, DK, NB, warden, or necro).');
        return;
    }
    var tr = 0; // parse primary resource
    for (let entry of Object.entries(toonRss)) {
            let rssName = entry[0];
            let rssID = entry[1];
        if (debugMode) {
        console.log(rssName, rssID);
        }	    
            if (text.includes(rssName)) {
                tr = rssID;
                break;
            }
        }
    if (tr == 0) { 
        channel.send('I am sorry, but I did not understand what the build for this toon is (magicka, stamina, or hybrid).');
        return;
    }
    var tf = 0; // parse function
    for (let entry of Object.entries(toonRole)) {
            let roleName = entry[0];
            let roleID = entry[1];
        if (debugMode) {
        console.log(roleName, roleID);
        }	    
            if (text.includes(roleName)) {
                tf = roleID;
                break;
            }
        }
    if (tf == 0) {
        channel.send('I am sorry, but I did not understand what the role for this toon is (damage, support, heals, or multitask).');
        return;
    }
    data = [name, nickname, tc, tr, tf]; // join data
    channel.send(nickname + ' has defined a ' +  rssNames[tr] + ' ' + classNames[tc] + ' ' + roleNames[tf]);
    fs.appendFileSync('toons.log', '\n' + data.join(separator) + '\n', (err) => {
        if (err) throw err;
    });
    return;
    } else if (text.includes(' del') || text.includes(' rem')) { // delete / remove a toon template
    channel.send('My mom has not taught me how to delete toons yet. She will, though, when she has the time.');
    return; // IMPLEMENTATION PENDING
    } else { // listing
    console.log('toon listing')
    var toons = fs.readFileSync('toons.log').toString().trim().split('\n').filter(Boolean).sort();
    toons = removeDuplicates(toons);
    fs.writeFileSync('toons.log', toons.join('\n') + '\n', (err) => {
        if (err) throw err;
    });			
    var msg = '**The presently registered Alpha toons are**:\n';
    for (var i = 0; i < toons.length; i++) {
        var f = toons[i].split(separator);
        var rn = f[0]; // username
        var nn = f[1]; // nickname
        var tc = parseInt(f[2]);
        var tr = parseInt(f[3]);
        var tf = parseInt(f[4]);
        msg += '*' + nn + '* has a ' + rssNames[tr] + ' ' + classNames[tc] + ' ' +  roleNames[tf] + '\n';
    }
    channel.send(msg);
    }
    return;
}

function manageDefaults(name, nickname, defs, curr, channel) {
    if (curr['role'] != 0) {
    if (defs['role'] == curr['role'] && defs['class'] == curr['class'] && defs['rss'] == curr['rss'] && defs['specs'] == curr['specs']) {
        channel.send('You had already set that as your default.');
        return;
    }
    var repl = rssDescr[curr['rss']] + classDescr[curr['class']] + roleDescr[curr['role']];
    var source = undefined;
    switch (curr['rss']) {
    case 0:
        source = classSymbols;
        break;
    case 1:
        source = magSymbols;
        break;
    case 2:
        source = stamSymbols;
        break;
    }
    repl += ' ' + symbols[curr['role']] + ' ' + source[curr['class']];
    if (debugMode) {
            console.log('current ' + repl);
        }
    var defaults = fs.readFileSync('roles.log').toString().trim().split('\n').filter(Boolean);
    if (debugMode) {
        console.log('default update');
    }
    var i = 0;
    for (; i < defaults.length; i++) {
        var f = defaults[i].split(' ');
        if (f[indices['defName']] == name) { // entry to replace
        // DEFAULT FILE SYNTAX: <name> <role> <rss> <class> <specs>
        defaults[i] = [name, curr['role'], curr['rss'], curr['class'], curr['specs']].join(separator); 
        fs.writeFileSync('roles.log', defaults.join('\n')  + '\n', (err) => {
            if (err) throw err;
        });
        channel.send('Default role for ' + nickname + ' has been updated as ' + repl + formatSpecs(curr['specs']));
        return;
        }
    } 
    if (debugMode) {
        console.log('default append');
    }
    var data = [name, curr['role'], curr['rss'], curr['class'], curr['specs']];
    fs.writeFileSync('roles.log', defaults.join('\n') + '\n' + data.join(separator), (err) => {
        if (err) throw err;
    });
    channel.send('Default for ' + nickname + ' set as ' + repl);
    return;
    } else { // !default was called with no role specified
    if (defs['role'] != 0) {
        var set = rssDescr[defs['rss']] + classDescr[defs['class']] + roleDescr[defs['role']];
        var source = undefined;
        switch (defs['rss']) {
        case 0:
        source = classSymbols;
        break;
        case 1:
        source = magSymbols;
        break;
        case 2:
        source = stamSymbols;
        break;
        }
        var specs = formatSpecs(defs['specs']);
        set += ' ' + symbols[defs['role']] + ' ' + source[defs['class']] + specs;
        channel.send('Your default is set as ' + set);
        return; // nothing more to do
    } 
    channel.send('You should specify which role to set as your default: **d**amage, **s**upport/**u**tility, **h**ealer, or **f**lexible.');
    return;
    }
}

function signupForSlot(nick, day, slot, clear) {
    // data = [status, curr['role'], curr['rss'], curr['class'], timing, name, nickname, url]; // RESPONSE FILE SYNTAX
    var taken = fs.readFileSync('slots_' + day + '.log').toString().trim().split('\n').filter(Boolean);
    var mapping = {};
    var rewrite = false;
    var resp = '';
    var prev = '';
    for (let i = 0; i < taken.length; i++) {
    let fields = taken[i].split(" ");
    if (fields.length > 1) {
        let index = parseInt(fields[0]) - 1;
        if (!(index in mapping)) {
        if (fields[1] == nick) {
            if (slot > 0 || clear) {
            if (!clear) {
                return 'You are already signed up. Please use *!signup slot clear* to eliminate the existing sign-up first.';
            } else {
                rewrite = true;
                taken[i] = '';
                prev = index;        
            }
            }
        }
        mapping[index] = (fields.slice(1, fields.length)).join(' ');       
        }
    }
    }
    console.log(available.length, ' slots', taken, mapping, slotlist);
    if (rewrite) {
    fs.writeFileSync('slots_' + day + '.log', taken.join('\n') + '\n', (err) => { 
        if (err) throw err;
    });
    return 'Your sign-up for slot ' + (prev + 1) + ' has been cleared, ' + nick;
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
    console.log(slot, mapping);
    let index = slot - 1;
    if (index in mapping) {
        return 'That slot is already taken :cry:';
    } else {
        fs.appendFileSync('slots_' + day + '.log', slot + ' ' + nick + '\n', (err) => {
        if (err) throw err;
        });
        return 'You are now signed up for slot ' + slot + ', ' + nick + ' :slight_smile:';
    } 
    }
}

/**
 * Process a command
 * @param {*} message 
 */
async function process(message) {
    
    const channel = message.channel;

    //  Only listen to alpha channels
    if (channel.name.includes('alpha')) {
    
        //  Only process commands in the alpha-signup channel
        if (channel.name == 'alpha-signup') {

            const text = message.content.toLowerCase();
            
            //  Respond to help
            if (text.startsWith(commandPrefix + 'h')) {
                channel.send(help);
            }
        
            //  Respond to other commands
            else if (text.startsWith(commandPrefix) && 'dsmrt'.includes(text[1])) {  //  Filter by first letter of available commands
                const user = message.member.user;
                const member = await il_guild.members.fetch(user);
                const nickname = member.displayName;

                //  The slot command is the only onw IL uses at the moment
                if (text.includes('slot')) {

                    const specDate = daySpec(text);
                    const day = raidDate(specDate);
                    const slot = parseInt(text.substring(text.indexOf('slot') + 4)) || 0;

                    channel.send(signupForSlot(nickname, day, slot, text.includes('clear')));
                }
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
        if (message.content.startsWith(commandPrefix)) {
            console.log("New command from " + message.guild.name);
            process(message);
        }
    
        //  Handle Alpaca messages 
        else {
            alpaca(message); // for Ags
        }
    }
});

//  Read the bot's discord token from the filesystem
const ID = fs.readFileSync('token.txt').toString().trim();

//  Log into discord using the token
client.login(ID);
