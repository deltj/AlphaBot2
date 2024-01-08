# AlphaBot2

[![DeepScan grade](https://deepscan.io/api/teams/3139/projects/20566/branches/562849/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3139&pid=20566&bid=562849)

A Discord bot for ESO PvP raid signups, used by Iron Legion, an ESO PvP guild on PC NA.  This is a pared down verson of the previous AlphaBot, which is available here: https://github.com/satuelisa/AlphaBot.  

This bot uses [Discord.js](https://discord.js.org/#/) version 13, and therefore requires [node.js](https://nodejs.org/en/) version 16.6 or newer.

## Run the bot locally with pm2

First export the Discord API key so the bot can read it

`export DISCORD_TOKEN=secret_key`

Then start the bot

`pm2 start ./alphabot.js`

If you want, you can monitor the bot's output

`pm2 log`

If everything is working, the last couple of lines should say "Handling guild: Some Guild [some big number]"


