var http = require('http');
var url = require('url');
var fs = require('fs');
var roles = require('./roleinfo');
var ws = require('ws');
var crypto = require('crypto');
var verified = []; //List of ips that are verified to use the MCP.
var createdList = [];
var gm = require('./gm.js');
var jailorcom = false;
var request = require('request');
// Set the headers
var headers = {
	'User-Agent': 'Super Agent/0.0.1',
	'Content-Type': 'application/x-www-form-urlencoded',
};
var commandList = {
	all: {
		help: 'Displays this message.',
		whisper: 'Whisper to another player. This is silent during Pregame, but once ingame other players will know that you are whispering. Usage: /w name message',
		mod: 'Send a message directly to the mod. Usage: /mod message',
		target: 'Target a player with a night action. Usage: /target player or /target playerone playertwo',
		vote: 'Command for voting, should only be used if there is a problem with the voting interface. Usage: /vote name',
		role: 'View your current rolecard, or use /role name to view another rolecard. Usage /role to view your role, /role name to view a rolecard.',
		rolelist: 'Display the current rolelist.',
		confirm: 'Use during the roles phase to confirm you have your role. Usage: /confirm',
		ping: 'Show your ping. Usage: /ping',
		afk: 'Go afk. Only usable in pregame. Usage: /afk',
		back: 'Return. Usage /back, after using /afk',
	},
	roles: {
		reveal: 'Reveal yourself as the Mayor, if you have that role. Usage: /reveal, during the day.',
		execute: 'Choose to execute the person you have jailed. Usage /execute, then /execute again to cancel.',
		seance: 'Choose a player to talk to at night. You may only use this once during the day.',
		jail: 'Choose to jail a player. Usage: /jail [target] during the day.',
		duel: 'Choose to duel a player. Usage: /duel [target] during the day.',
	},
	mod: {
		givemod: 'Pass the mod onto another person. Usage: /givemod name',
		a: 'Send a public message to everyone (outside of Pregame). Usage: /a message',
		d: 'Send a public death message to everyone (outside of Pregame). Example: /d WW - Usage: /d message',
		disguise: 'Disguise one player as another. Usage: /disguise playerone playertwo',
		random: 'Choose a random player. Usage: /random',
		roll: 'Roll a dice. Usage /roll or /roll sides',
		msg: 'Send a message to a player. <span class="mod">From</span> <b>Mod:</b> <span class="mod">This looks like this</span>. Usage: /msg name message',
		sys: 'Send a system message to a player. <b>This looks like this</b>',
		clean: "Set a player's will to not show upon death.",
		forcevote: 'Forces a player to vote for a particular person. Usage: /forcevote person1 person2',
		lockvote: "Locks the player's vote. They will be unable to vote or cancel their vote after you use this command, except through /forcevote. Usage: /lockvote person",
		unlockvote: "Unlocks the player's vote. They will be able to vote and cancel their vote once more after you use this command. /unlockvote person",
		settrial: 'Forces a trial on a player. They will automatically be voted to the stand.',
	},
	dev: {
		dev: 'Activate developer powers.',
		setspectate: 'Toggle someone\'s spectator setting. Usage: /setspectate name',
		alert: 'Send an audio alert to a player.',
		kick: 'Kick a player.',
		ban: 'Ban an ip.',
		silence: 'Silence a player until the end of the current phase. This effects all messages that are shown to other players.',
	},
	fun: {
		me: 'Do something. Eg. <em>Player waves!</emY. Only usable during Pregame.',
		hug: 'Send a hug to a person. Only usable during Pregame.',
	},
};
//Enums
var Type = {
	PING: 0,
	PONG: 1,
	MSG: 2,
	ROOMLIST: 3,
	TOGGLE: 4,
	JOINROOM: 5,
	JOIN: 6,
	LEAVE: 7,
	SYSTEM: 9,
	SETROLE: 10,
	HIGHLIGHT: 11,
	SETPHASE: 12,
	WHISPER: 13,
	MOD: 14,
	TOGGLELIVING: 15,
	PRENOT: 16,
	VOTE: 17,
	CLEARVOTES: 18,
	VERDICT: 19,
	TICK: 20,
	JUDGEMENT: 21,
	SETDEV: 22,
	WILL: 23,
	SETMOD: 24,
	SWITCH: 25,
	ACCEPT: 26,
	ROLEUPDATE: 27,
	DENY: 28,
	KICK: 29,
	ROLECARD: 30,
	ROLL: 31,
	SETROLESBYLIST: 32,
	MASSROLEUPDATE: 33,
	SHOWLIST: 34,
	SHOWALLROLES: 35,
	LATENCIES: 36,
	GETWILL: 37,
	HEY: 38,
	TARGET: 39,
	HUG: 40,
	ME: 41,
	ROLELIST: 42,
	AUTOLEVEL: 43,
	SUGGESTIONS: 44,
	SYSSENT: 45,
	CUSTOMROLES: 46,
	HELP: 47,
	PAUSEPHASE: 48,
	SETDAYNUMBER: 49,
	SETSPEC: 50,
	REMSPEC: 51,
	LOGINDEXI: 52,
	LOGINDEXO: 53,
	MAYOR: 54,
	GUARDIAN_ANGEL: 55,
	REMOVE_EMOJI: 56,
	NOTES: 57,
	GETNOTES: 58,
	DISCONNECT: 59,
	RECONNECT: 60,
};
var autoLevel = 1;
/*
 * 0 = No auto
 * 1 = Semi auto
 * 2 = Full auto
 * */
var Phase = {
	PREGAME: 0,
	ROLES: 1,
	MODTIME: 2,
	DAY: 3,
	VOTING: 4,
	TRIAL: 5,
	VERDICTS: 6,
	LASTWORDS: 7,
	NIGHT: 8,
	FIRSTDAY: 9,
};
//Game variables
var phase = Phase.PREGAME;
var mod = undefined;
var ontrial = undefined;
var apass;
loadPassword();
loadBanlist();
var prev_rolled;
var testTime = new Date();
loadDate();
//Banlist
var banlist = [];
var server = http.createServer(function (req, res) {
	var path = url.parse(req.url).pathname;
	//Routing
	switch (path) {
		case '/':
			if (apass) {
				fs.readFile(__dirname + '/index.html', function (error, data) {
					if (error) {
						res.writeHead(404);
						res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
						res.end();
					} else {
						res.writeHead(200, { 'Content-Type': 'text/html' });
						res.write(data, 'utf8');
						res.end();
					}
				});
			} else {
				res.write('<h1>Server is busy loading... Please wait a few minutes then refresh the page.</h1>');
				res.end();
			}
			break;
		case '/MCP':
			if (req.method == 'POST') {
				var pass;
				req.on('data', function (p) {
					pass = p.toString();
					pass = pass.substring(5, pass.length); //Drop the preceding 'pass='
				});
				req.on('end', function () {
					//Check the password.
					if (pass == apass) {
						var ip = getIpReq(req);
						if (!verified[ip]) {
							verified[ip] = setTimeout(function () {
								//Connection expired.
								expireVerification(ip);
							}, 5 * 60 * 1000);
						}
						fs.readFile(__dirname + '/MCP/mod.html', function (error, data) {
							if (error) {
								res.writeHead(404);
								res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
								res.end();
							} else {
								res.writeHead(200, { 'Content-Type': 'text/html' });
								res.write(data, 'utf8');
								res.end();
							}
						});
					} else {
						fs.readFile(__dirname + '/modpass.html', function (error, data) {
							if (error) {
								res.writeHead(404);
								res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
								res.end();
							} else {
								res.writeHead(200, { 'Content-Type': 'text/html' });
								res.write(data, 'utf8');
								res.end();
							}
						});
					}
				});
			} else {
				fs.readFile(__dirname + '/modpass.html', function (error, data) {
					if (error) {
						res.writeHead(404);
						res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
						res.end();
					} else {
						res.writeHead(200, { 'Content-Type': 'text/html' });
						res.write(data, 'utf8');
						res.end();
					}
				});
			}
			break;
		case '/MCP/Admin':
		case '/MCP/Players':
		case '/MCP/Roles':
		case '/MCP/Banlist':
			if (isVerified(getIpReq(req))) {
				fs.readFile(__dirname + path + '.html', 'utf-8', function (error, data) {
					if (error) {
						res.writeHead(404);
						res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
						res.end();
					} else {
						res.writeHead(200, { 'Content-Type': 'text/html' });
						data = formatData(data);
						res.write(data, 'utf8');
						res.end();
					}
				});
			} else {
				res.write('You do not have permission to access this page.');
				res.end();
			}
			break;
		case '/MCP/setPass':
			{
				res.write('You do not have permission to access this page.');
				res.end();
			}
			break;
		case '/MCP/setDate':
			if (isVerified(getIpReq(req))) {
				var datetime = url.parse(req.url).query;
				//Make sure the date is in the correct format.
				var sides = datetime.split('-');
				var date = sides[0].split('/');
				var time = sides[1];
				var valid = true;
				var error = '';
				for (i in date) {
					if (isNaN(date[i]) || !(date[i].length == 2 || (i == 2 && date[i].length == 4))) {
						valid = false;
						error = date[i];
						break;
					}
				}
				if (!/\d\d:\d\d/.test(time)) {
					valid = false;
					error = time;
				}
				res.write(error + ' is not formatted correctly.');
				res.end();
			} else {
				res.write('You do not have permission to access this page.');
				res.end();
			}
			break;
		case '/MCP/playerList':
			res.write('You do not have permission to access this page.');
			res.end();
			break;
		case '/play':
			var name = url.parse(req.url, true).query.name;
			if(!name) {
				res.writeHead(302, { Location: '/' }); //Send em home
				res.end();
				break;
			}
			//Serve the page.
			fs.readFile(__dirname + path + '.html', function (error, data) {
				if (error) {
					res.writeHead(404);
					res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
					res.end();
				} else {
					res.writeHead(200, { 'Content-Type': 'text/html' });
					res.write(data, 'utf8');
					res.end();
				}
			});
			break;
		case '/time':
			//Calculate time until the test.
			var now = new Date().getTime();
			var timeToTest = testTime.getTime() - now;
			timeToTest = timeToTest / 1000; //To seconds.
			if (timeToTest > 0) {
				res.write(timeToTest + '');
			} else {
				res.write('now');
			}
			res.end();
			break;
		case '/namecheck':
			var name = url.parse(req.url).query;
			if (name && typeof name == 'string') {
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				if (nameTaken(name, getIpReq(req))) {
					res.write('taken');
				} else if (name.length == 0) {
					res.write('empty');
				} else if (name.toLowerCase() == 'empty') {
					res.write('lol');
				} else if (name.length > 20) {
					res.write('toolong');
				} else if (!/[a-z]/i.test(name)) {
					res.write('noletters');
				} else if (/^[a-z0-9-_]+$/i.test(name)) {
					res.write('good');
				} else {
					res.write('invalid');
				}
			} else {
				res.write('empty');
			}
			res.end();
			break;
		case '/socketstuff.js':
		case '/script.js':
		case '/playscript.js':
		case '/MCP/modscript.js':
		case '/MCP/passscript.js':
		case '/jquery-2.1.4.min.js':
		case '/glDatePicker.min.js':
		case '/snowstorm.js':
			fs.readFile(__dirname + path, function (error, data) {
				if (error) {
					res.writeHead(404);
					res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
					res.end();
				} else {
					res.writeHead(200, { 'Content-Type': 'text/js' });
					res.write(data, 'utf8');
					res.end();
				}
			});
			break;
		case '/style.css':
		case '/playstyle.css':
		case '/MCP/modstyle.css':
		case '/MCP/calstyles/glDatePicker.default.css':
		case '/MCP/calstyles/glDatePicker.darkneon.css':
		case '/MCP/calstyles/glDatePicker.flatwhite.css':
			fs.readFile(__dirname + path, function (error, data) {
				if (error) {
					res.writeHead(404);
					res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
					res.end();
				} else {
					res.writeHead(200, { 'Content-Type': 'text/css' });
					res.write(data, 'utf8');
					res.end();
				}
			});
			break;
		case '/invest.png':
		case '/sheriff.png':
		case '/moon.png':
		case '/maf.png':
		case '/cov.png':
		case '/mayor.png':
		case '/med.png':
		case '/jailor.png':
		case '/blackmailer.png':
		case '/will.png':
		case '/willicon.png':
		case '/notes.png':
		case '/notesicon.png':
		case '/button.png':
		case '/list.png':
		case '/settings.png':
		case '/edit.png':
		case '/accept.png':
		case '/roll.png':
		case '/back1.png':
		case '/back2.png':
		case '/back3.png':
		case '/lastwillbutton.png':
		case '/paste.png':
		case '/notesbutton.png':
		case '/notesclose.png':
		case '/music.png':
		case '/nomusic.png':
		case '/Snowback1.png':
			fs.readFile(__dirname + '/images/' + path, function (error, data) {
				if (error) {
					res.writeHead(404);
					res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
					res.end();
				} else {
					res.writeHead(200, { 'Content-Type': 'text/png' });
					res.write(data, 'utf8');
					res.end();
				}
			});
			break;
		case '/dancingkitteh.gif':
			fs.readFile(__dirname + '/images/' + path, function (error, data) {
				if (error) {
					res.writeHead(404);
					res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
					res.end();
				} else {
					res.writeHead(200, { 'Content-Type': 'text/gif' });
					res.write(data, 'utf8');
					res.end();
				}
			});
			break;
		case '/ping.wav':
		case '/Giratina.wav':
			fs.readFile(__dirname + '/sounds/' + path, function (error, data) {
				if (error) {
					res.writeHead(404);
					res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
					res.end();
				} else {
					res.writeHead(200, { 'Content-Type': 'text/wav' });
					res.write(data, 'utf8');
					res.end();
				}
			});
			break;
		case '/Aquabatics.mp3':
		case '/Bewitching.mp3':
		case '/CalmBeforeTheStorm.mp3':
		case '/CareFree.mp3':
		case '/Cauldron.mp3':
		case '/Chaos.mp3':
		case '/CosmicCove.mp3':
		case '/DarkAlley.mp3':
		case '/DarkHolidays.mp3':
		case '/GardenGridlock.mp3':
		case '/GreenMeadows.mp3':
		case '/Heated.mp3':
		case '/Homecoming.mp3':
		case '/Inevitable.mp3':
		case '/Innocence.mp3':
		case '/KakarikoNight.mp3':
		case '/KakarikoSaved.mp3':
		case '/LittleItaly.mp3':
		case '/MountHylia.mp3':
		case '/PeaceAndTranquility.mp3':
		case '/Remembrance.mp3':
		case '/Searching.mp3':
		case '/ShockAndAwe.mp3':
		case '/Skyworld.mp3':
		case '/Spinwheel.m4a':
		case '/StarlitSky.mp3':
		case '/Suspicion.mp3':
		case '/Touchstone.mp3':
		case '/Valkyrie.mp3':
		case '/Vampiric.mp3':
		case '/WhatLurksInTheNight.mp3':
		case '/Remembrance.mp3':
		case '/WhoAmI.mp3':
			fs.readFile(__dirname + '/sounds/' + path, function (error, data) {
				if (error) {
					res.writeHead(404);
					res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
					res.end();
				} else {
					res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'audio/m4a' });
					res.write(data, 'utf8');
					res.end();
				}
			});
			break;
		default:
			res.writeHead(404);
			res.write("<h1>Oops! This page doesn't seem to exist! 404</h1>");
			res.end();
			break;
	}
});
var port = process.env.PORT || 8080;
server.listen(port, function () {
	console.log('Listening on port ' + port + '...');
});

//Server variables
//List of player objects.
var players = [];
//To store the order of players.
var playernums = [];
//List of names with their socket.id's. Needed to provide quick access to the player objects.
var playernames = [];

var io = new ws.WebSocketServer({ server: server });
//Start the timer.
var timer = Timer();
timer.tick();
timer.ping();
//Let the pinging begin
ping();

function sendPublicMessage() {
	for(var i in players) {
		players[i].s.sendMessage.apply(players[i].s, arguments);
	}
}
io.on('connection', function (socket, req) {
	socket.id = crypto.randomBytes(16).toString("hex");

	var listeners = {};
	function addSocketListener(type, callback) {
		listeners[type] = callback;
	}
	socket.addEventListener('message', function(event) {
		var [type, ...args] = JSON.parse(event.data);
		if(type !== Type.JOIN && !players[socket.id]) {
			return;
		}
		if(listeners[type]) {
			listeners[type].apply(socket, args);
		}
	});
	socket.sendMessage = function() {
		this.send(JSON.stringify(Array.prototype.slice.call(arguments)));
	}

	var ip = getIpReq(req);
	addSocketListener(Type.JOIN, function(connecting_as_name, simple_resume) {
		var banned = false;
		var reason = '';
		for (i in banlist) {
			if (banlist[i].ip == ip) {
				banned = true;
				reason = banlist[i].reason;
			}
		}
		if (banned) {
			socket.sendMessage(
				Type.SYSTEM,
				'This ip is banned. Reason: ' +
					reason +
					'.<br>If you believe this to be in error, bring it up on the <a href="https://discord.gg/EVS55Zb">Testing Grounds Discord Server</a>.'
			);
			socket.sendMessage(Type.KICK);
			console.log('Connection attempt from banned ip: ' + ip);
			socket.close();
		} else if (!nameCheck(connecting_as_name)) {
			socket.sendMessage(Type.SYSTEM, 'Invalid name!');
			socket.sendMessage(Type.KICK);
			socket.close();
		} else {
			//Check if the person is reconnecting or an alt.
			var reconnecting = null;
			var alts = [];
			for (i in players) {
				if (ip == players[i].ip) {
					if(connecting_as_name == players[i].name) {
						reconnecting = players[i];
					} else {
						alts.push(players[i].name);
					}
				}
			}
			//If reconnecting, give them their old slot back
			if(reconnecting) {
				//Rejoining after a dc
				//If the player is a mod who disconnected, set them as the mod.
				if (reconnecting.s.id == mod) {
					mod = socket.id;
				}
				if (reconnecting.s.readyState == ws.OPEN) {
					//The player might have duplicated the tab.  Disconnect the old one in a non-confusing way.
					reconnecting.s.sendMessage(Type.SYSTEM, 'You have been disconnected because you connected again elsewhere.');
					reconnecting.s.sendMessage(Type.KICK);
					reconnecting.s.close();
				}
				//Welcome back!
				delete players[reconnecting.s.id];
				players[socket.id] = reconnecting;
				playernums[playernums.indexOf(reconnecting.s.id)] = socket.id;
				playernames[players[socket.id].name] = socket.id;
				//Replace the old socket.
				players[socket.id].s = socket;
				//Reset ping.
				players[socket.id].ping = 0;

				socket.sendMessage(Type.ACCEPT);

				if(mod == socket.id) {
					socket.sendMessage(Type.SETMOD, true);
				} else {
					socket.sendMessage(Type.SETMOD, false);
				}
				if(simple_resume && !players[socket.id].visibly_disconnected) {
					return;
				}

				socket.sendMessage(Type.PAUSEPHASE, timer.paused);
				socket.sendMessage(Type.SETDAYNUMBER, gm.getDay());

				socket.sendMessage(Type.SYSTEM, 'You have reconnected. Welcome back!');
				var name = players[socket.id].name;
				//Inform everyone of the new arrival.
				sendPublicMessage(Type.RECONNECT, name);
				players[socket.id].visibly_disconnected = false;
				//Tell the new arrival what phase it is.
				socket.sendMessage(Type.SETPHASE, phase, true, timer.time);

				if (players[mod] && mod != socket.id) {
					var send = {};

					for (i in players[socket.id].chats) {
						if (players[socket.id].chats[i]) {
							send[i] = players[socket.id].chats[i];
						}
					}
					//Exceptions
					send.name = players[socket.id].name;
					send.alive = players[socket.id].alive;
					send.blackmailer = players[socket.id].hearwhispers;
					send.mayor = players[socket.id].mayor !== undefined;
					send.role = players[socket.id].role;

					players[mod].s.sendMessage(Type.ROLEUPDATE, send);
				}
				//Resend the list.
				var namelist = [];
				//Send the roles of any dead players
				for (i in playernums) {
					var p = {};
					p.name = players[playernums[i]].name;
					p.spectate = players[playernums[i]].spectate;
					p.dev = players[playernums[i]].dev;
					if (!players[playernums[i]].alive) {
						p.role = players[playernums[i]].role;
						p.rolecolor = roles.getRoleData(players[playernums[i]].role).color;
						p.haswill = !!players[playernums[i]].publicwill;
					}
					namelist.push(p);
				}
				socket.sendMessage(Type.ROOMLIST, namelist);
				//Set the rejoining player's will.
				socket.sendMessage(Type.GETWILL, undefined, players[socket.id].will);
				//Set the rejoining player's notes.
				socket.sendMessage(Type.GETNOTES, undefined, players[socket.id].notes);

				//If the mod is reconnecting, send the role data for all players
				if(mod == socket.id) {
					sendPlayerInfo();
				}
			} else if (!nameTaken(connecting_as_name)) { //Second check for the name being taken
				if (connecting_as_name) {
					socket.sendMessage(Type.PAUSEPHASE, timer.paused);
					socket.sendMessage(Type.SETDAYNUMBER, gm.getDay());
					//If the player is first, set them as the mod.
					if (Object.keys(players).length == 0) {
						mod = socket.id;
					}
					//Send the list of names in the game to the new arrival
					var namelist = [];
					//Send the roles of any dead players
					for (i in playernums) {
						var p = {};
						p.name = players[playernums[i]].name;
						p.spectate = players[playernums[i]].spectate;
						p.dev = players[playernums[i]].dev;
						if (!players[playernums[i]].alive) {
							p.role = players[playernums[i]].role;
							p.rolecolor = roles.getRoleData(players[playernums[i]].role).color;
							p.haswill = !!players[playernums[i]].publicwill;
						}
						namelist.push(p);
					}
					socket.sendMessage(Type.ROOMLIST, namelist);
					socket.sendMessage(Type.ACCEPT);
					players[socket.id] = Player(socket, connecting_as_name, ip);
					//Inform everyone of the new arrival.
					sendPublicMessage(Type.JOIN, connecting_as_name);
					if (phase != 0) {
						for (i in players) {
							if (connecting_as_name == players[i].name) {
								players[i].spectate = true;
								players[i].setRole('Spectator');
							}
						}
						sendPublicMessage(Type.SETSPEC, connecting_as_name);
					}
					if (alts.length > 0) {
						//Inform everyone of the alt.
						sendPublicMessage(Type.HIGHLIGHT, 'Please be aware that ' + connecting_as_name + ' is an alt of ' + gm.grammarList(alts) + '.');
					}
					//Tell the new arrival what phase it is.
					socket.sendMessage(Type.SETPHASE, phase, true, timer.time);
					//Inform the new arrival of any devs and spectators present.
					for (i in players) {
						if (players[i].spectate) {
							socket.sendMessage(Type.SETSPEC, players[i].name);
						}
						if (players[i].dev) {
							socket.sendMessage(Type.SETDEV, players[i].name);
						}
					}
				}
			} else {
				socket.sendMessage(Type.DENY, 'Sorry, this name is taken.');
				socket.close();
			}
		}
	});
	addSocketListener(Type.AUTOLEVEL, function (lvl) {
		if (socket.id == mod) {
			autoLevel = lvl;
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can set the level of automation.');
		}
	});
	addSocketListener(Type.GUARDIAN_ANGEL, function (name) {
		sendPublicMessage(Type.GUARDIAN_ANGEL, name);
	});

	addSocketListener(Type.REMOVE_EMOJI, function (emojiId) {
		sendPublicMessage(Type.REMOVE_EMOJI, emojiId);
	});

	addSocketListener(Type.MSG, function (msg) {
		if (msg.length > 256) {
			socket.sendMessage(Type.SYSTEM, 'Your message was too long.');
		} else if (msg.trim() == '') {
			socket.sendMessage(Type.SYSTEM, 'Cannot send an empty message.');
		} else if (msg[0] == '/') {
			players[socket.id].command(msg.substring(1, msg.length));
		} else {
			players[socket.id].message(msg);
		}
	});
	addSocketListener(Type.CUSTOMROLES, function (bool) {
		roles.setCustomRoles(bool);
	});
	addSocketListener(Type.PRENOT, function (name, prenot) {
		if (socket.id == mod) {
			var player = getPlayerByName(name);
			switch (prenot) {
				case 'HEAL':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was attacked and healed.');
					break;
				case 'SAVED_BY_BG':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was attacked and saved by a Bodyguard.');
					break;
				case 'PROTECTED':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was attacked and protected.');
					break;
				case 'SAVED_BY_TRAP':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was attacked and saved by a trap.');
					break;
				case 'DEAD':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was killed.');
					break;
				case 'DOUSE':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was doused.');
					break;
				case 'BLACKMAIL':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was blackmailed.');
					break;
				case 'TARGETIMMUNE':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' attacked someone with too strong of a defense.');
					break;
				case 'IMMUNE':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was attacked but immune.');
					break;
				case 'SHOTVET':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was shot by a Veteran.');
					break;
				case 'VETSHOT':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' shot one of their visitors.');
					break;
				case 'RB':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was roleblocked.');
					break;
				case 'WITCHED':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was controlled.');
					break;
				case 'REVIVE':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was revived.');
					break;
				case 'JAILED':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was hauled off to jail.');
					break;
				case 'GUARDIAN_ANGEL':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was watched by their Guardian Angel.');
					break;
				case 'SAVED_BY_GA':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was attacked but their Guardian Angel saved them.');
					break;
				case 'POISON_CURABLE':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was poisoned. They will die unless they are cured.');
					break;
				case 'POISON_UNCURABLE':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was poisoned.');
					break;
				case 'MEDUSA_STONE':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' stoned someone.');
					break;
				case 'TRANSPORT':
					players[mod].s.sendMessage(Type.SYSTEM, name + ' was transported.');
					break;
			}
			player.s.sendMessage(Type.PRENOT, prenot);
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.ROLL, function (rolelist, custom, exceptions) {
		if (socket.id == mod) {
			var result = roles.sortRoles(rolelist, custom, exceptions);
			createdList = rolelist;
			var names = Object.keys(playernames);
			names.splice(names.indexOf(players[mod].name), 1); //Get rid of the mod.
			for (i in players) {
				if (players[i].spectate) {
					names.splice(names.indexOf(players[i].name), 1);
				}
			}
			shuffleArray(names);
			//Format the roles
			for (i in result) {
				result[i] = roles.formatAlignment(result[i]);
			}
			socket.sendMessage(Type.ROLL, result, names, []);
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.SETROLE, function (name, role) {
		if (socket.id == mod) {
			if (role.length > 32) {
				socket.sendMessage(Type.SYSTEM, 'Role name cannot be more than 32 characters.');
			} else {
				var p = getPlayerByName(name);
				if (p) {
					p.setRole(role);
				} else {
					socket.sendMessage(Type.SYSTEM, 'Invalid name "' + name + '", did you break something?');
				}
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.SETROLESBYLIST, function (roles, names) {
		if (socket.id == mod) {
			prev_rolled = roles;
			for (i in names) {
				if (roles[i].length > 32) {
					socket.sendMessage(Type.SYSTEM, 'Invalid rolelist! Role name cannot be more than 32 characters: ' + roles[i]);
					break;
				}
				var p = getPlayerByName(names[i]);
				if (p) {
					p.setRole(roles[i]);
				} else {
					socket.sendMessage(Type.SYSTEM, 'Invalid rolelist! Could not find player: ' + names[i]);
					break;
				}
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.GETWILL, function (num) {
		var p = getPlayerByNumber(num);
		if (!p) {
			socket.sendMessage(Type.SYSTEM, 'Invalid player number: ' + num);
		} else if (socket.id == mod) {
			socket.sendMessage(Type.GETWILL, p.name, p.will);
		} else if (p.publicwill) {
			socket.sendMessage(Type.GETWILL, p.name, p.publicwill);
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.GETNOTES, function (num) {
		if (socket.id == mod) {
			var p = getPlayerByNumber(num);
			if (p) {
				socket.sendMessage(Type.GETNOTES, p.name, p.notes);
			} else {
				socket.sendMessage(Type.SYSTEM, 'Invalid player number: ' + num);
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.SHOWLIST, function (list) {
		if (socket.id == mod) {
			for (i in list) {
				list[i] = sanitize(list[i]);
				list[i] = roles.formatAlignment(list[i]);
			}
			if (!players[socket.id].silenced) {
				sendPublicMessage(Type.SHOWLIST, list);
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.SHOWALLROLES, function () {
		if (socket.id == mod) {
			var c = 0;
			var list = [];
			for (i in players) {
				if (players[i].s.id != mod) {
					list.push({ name: players[i].name, role: roles.formatAlignment(players[i].role) });
					c++;
				}
			}
			if (players[socket.id]) {
				sendPublicMessage(Type.SHOWALLROLES, list);
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.SETPHASE, function (p) {
		if (mod == socket.id && p >= 0 && p < Object.keys(Phase).length) {
			setPhase(p);
		}
	});
	addSocketListener(Type.SETDAYNUMBER, function (num) {
		if (socket.id == mod) {
			gm.setDay(num);
			sendPublicMessage(Type.SETDAYNUMBER, gm.getDay());
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can set the day number.');
		}
	});
	addSocketListener(Type.PAUSEPHASE, function () {
		if (mod == socket.id) {
			timer.paused = !timer.paused;
			sendPublicMessage(Type.PAUSEPHASE, timer.paused);
		} else {
			socket.sendMessage(Type.SYSTEM, 'You need to be the mod to pause or unpause.');
		}
	});
	addSocketListener(Type.WILL, function (will, name) {
		if (will !== undefined && will !== null) {
			if (name) {
				if (mod == socket.id) {
					var p = getPlayerByName(name);
					if (p) {
						p.will = will;
					} else {
						socket.sendMessage(Type.SYSTEM, 'Invalid player name:' + name);
					}
				} else {
					socket.sendMessage(Type.SYSTEM, 'Can\t edit another player\'s will: you are not the mod.');
				}
			} else {
				if(phase == Phase.MODTIME) {
					socket.sendMessage(Type.SYSTEM, 'Please don\'t edit your will during modtime.');
				} else {
					players[socket.id].will = will;
				}
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'You sent a null will. Did you break something?');
		}
	});
	addSocketListener(Type.NOTES, function (notes, name) {
		if (notes !== undefined && notes !== null) {
			if (name && mod == socket.id) {
				var p = getPlayerByName(name);
				if (p) {
					p.notes = notes;
				} else {
					socket.sendMessage(Type.SYSTEM, 'Invalid player name:' + name);
				}
			} else {
				players[socket.id].notes = notes;
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'You sent a null notes. Did you break something?');
		}
	});
	addSocketListener(Type.TOGGLELIVING, function (name) {
		if (socket.id == mod) {
			var player = getPlayerByName(name);
			if (player) {
				player.alive = !player.alive;
				player.chats.dead = !player.chats.dead;
				if (player.alive) {
					if (!players[socket.id].silenced) {
						sendPublicMessage(Type.HIGHLIGHT, name + ' has been revived!', 'reviving');
						player.s.sendMessage(Type.PRENOT, 'REVIVE');
					}
					delete player.publicwill;
					sendPublicMessage(Type.TOGGLELIVING, { name: name });
				} else {
					if (!players[socket.id].silenced) {
						sendPublicMessage(Type.HIGHLIGHT, name + ' has died!', 'dying');
						sendPublicMessage(Type.HIGHLIGHT, 'Their role was ' + sanitize(player.role));
						var show = sanitize(player.will);
						show = show.replace(/(\n)/g, '<br />');
						if (!player.cleaned) {
							player.publicwill = player.will;
							sendPublicMessage(Type.WILL, show);
						} else {
							sendPublicMessage(Type.HIGHLIGHT, 'We could not find a last will.');
						}
						player.s.sendMessage(Type.PRENOT, 'DEAD');
					}
					sendPublicMessage(Type.TOGGLELIVING, {
						name: name,
						role: player.role,
						rolecolor: roles.getRoleData(player.role).color,
						haswill: !!player.publicwill,
					});
				}
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.VOTE, function (name) {
		players[socket.id].vote(name);
	});
	addSocketListener(Type.TARGET, function (name) {
		players[socket.id].command('target ' + name);
	});
	addSocketListener(Type.LOGINDEXI, function (username, password) {
		// Configure the request
		var options = {
			url: 'http://www.blankmediagames.com/phpbb/ucp.php?mode=login',
			method: 'POST',
			headers: headers,
			form: { username: username, password: password, viewonline: 'on', redirect: 'http://www.blankmediagames.com/phpbb/index.php', sid: '872f8d72364f836d8d26be4df3d9fccc', login: 'Login' },
		};

		// Start the request
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// Print out the response body
				if (body.includes('title="Logout [ ' + username + ' ]"')) {
					console.log(`${username} logged in successfully!`);
					socket.sendMessage(Type.LOGINDEXO, 'success', username);
				} else {
					var captcha = body.substring(body.lastIndexOf('Spell this word backwards: ') + 27, body.lastIndexOf(':</label><br /><span>This'));
					var captcharev = captcha.split('').reverse().join('');
					var captchaconfirm = body.substring(body.lastIndexOf('id="qa_confirm_id" value="') + 26, body.lastIndexOf('id="qa_confirm_id" value="') + 58);
					var sid = body.substring(body.lastIndexOf('name="sid" value="') + 18, body.lastIndexOf('name="sid" value="') + 50);
					options.form.qa_answer = captcharev;
					options.form.qa_confirm_id = captchaconfirm;
					options.form.sid = sid;
					request(options, function (error2, response2, body2) {
						if (!error2 && response2.statusCode == 200) {
							// Print out the response body
							if (body2.includes('title="Logout [ ' + username + ' ]"')) {
								console.log(`${username} logged in successfully!`);
								socket.sendMessage(Type.LOGINDEXO, 'success', username);
							} else {
								console.log(`${username} inserted a wrong username or password!`);
								socket.sendMessage(Type.LOGINDEXO, 'failed', username);
							}
						}
					});
				}
			}
		});
	});
	addSocketListener(Type.TOGGLE, function (name, chat) {
		if (socket.id == mod) {
			var player = players[playernames[name]];
			if (player) {
				if (player.chats[chat] !== undefined) {
					//Chat related role modifiers.
					player.chats[chat] = !player.chats[chat];
					var notify;
					if (player.chats[chat]) {
						switch (chat) {
							case 'jailor':
								player.jailorcom = true;
								if (!players[socket.id].silenced) {
									player.s.sendMessage(
										Type.SYSTEM,
										'You are now the Jailor. Use /jail [target] to jail. Use /execute, /exe or /x to execute your prisoner.'
									);
								}
								break;
							case 'jailed':
								notify = undefined;
								break; //No message
							case 'linked':
								players[mod].s.sendMessage(Type.SYSTEM, player.name + ' is now linked.');
								break;
							case 'medium':
								notify = 'You can now hear the dead at night.';
								player.canSeance = true;
								break;
							default:
								notify = 'You can now talk in the ' + chat + ' chat.';
								break;
						}
					} else {
						switch (chat) {
							case 'jailor':
								player.jailorcom = false;
								if (!players[socket.id].silenced) {
									player.s.sendMessage(Type.SYSTEM, 'You are no longer the Jailor.');
								}
								break;
							case 'jailed':
								notify = undefined;
								break; //No message
							case 'linked':
								players[mod].s.sendMessage(Type.SYSTEM, player.name + ' is no longer linked.');
								break;
							case 'medium':
								notify = 'You can no longer hear the dead at night.';
								player.canSeance = false;
								break;
							default:
								notify = 'You can no longer talk in the ' + chat + ' chat.';
								break;
						}
					}
					if (!players[socket.id].silenced) {
						if (notify) player.s.sendMessage(Type.SYSTEM, notify);
					}
				} else {
					switch (chat) {
						case 'mayor':
							if (player.mayor === undefined) {
								player.mayor = false; //False, meaning not revealed.
								if (!players[socket.id].silenced) {
									player.s.sendMessage(Type.SYSTEM, 'You are now the Mayor. Use /reveal to reveal yourself and get 3 votes.');
								}
							} else {
								player.mayor = undefined; //Undefined, meaning not mayor.
								if (!players[socket.id].silenced) {
									player.s.sendMessage(Type.SYSTEM, 'You are no longer the Mayor.');
								}
							}
							break;
							break;
						case 'blackmailer':
							player.hearwhispers = !player.hearwhispers;
							if (!players[socket.id].silenced) {
								if (player.hearwhispers) {
									player.s.sendMessage(Type.SYSTEM, 'You can now hear whispers.');
								} else {
									player.s.sendMessage(Type.SYSTEM, 'You can no longer hear whispers.');
								}
							}
							break;
						case 'blackmail':
							player.blackmailed = !player.blackmailed;
							if (!players[socket.id].silenced) {
								if (player.blackmailed) {
									player.s.sendMessage(Type.PRENOT, 'BLACKMAIL');
									players[mod].s.sendMessage(Type.SYSTEM, player.name + ' is now blackmailed.');
								} else {
									player.s.sendMessage(Type.SYSTEM, 'You are no longer blackmailed.');
									players[mod].s.sendMessage(Type.SYSTEM, player.name + ' is no longer blackmailed.');
								}
							}
							break;
						case 'douse':
							player.doused = !player.doused;
							if (!players[socket.id].silenced) {
								if (player.doused) {
									players[mod].s.sendMessage(Type.SYSTEM, player.name + ' is now doused.');
								} else {
									players[mod].s.sendMessage(Type.SYSTEM, player.name + ' is no longer doused.');
								}
							}
							break;
						default:
							socket.sendMessage(Type.SYSTEM, 'Invalid chat selection. Did you break something?');
							break;
					}
				}
			} else {
				socket.sendMessage(Type.SYSTEM, 'Invalid user "' + name + '"! Did you break something?');
			}
		} else {
			socket.sendMessage(Type.SYSTEM, 'Only the mod can do that.');
		}
	});
	addSocketListener(Type.VERDICT, function (verdict) {
		players[socket.id].castVerdict(verdict);
	});
	//addSocketListener(TYPE.ROLELIST, function()
	//{
	//	for (role in createdList)
	//	{
	//		socket.sendMessage(role);
	//	}
	//	socket.sendMessage
	//});
	addSocketListener(Type.PONG, function () {
		players[socket.id].ping = players[socket.id].pingTime;
	});
	socket.addEventListener('close',function() {
		if (players[socket.id]) {
			var player = players[socket.id];
			setTimeout(function() {
				if(player.s.readyState != ws.OPEN)
				{
					player.dc();
				}
			}, 100);
		}
	});
});
//Functions
function nameTaken(name, ip) {
	var match = false;
	for (i in players) {
		if (name == players[i].name) {
			match = true;
			if(ip == players[i].ip && players[i].s.readyState != ws.OPEN) {
				// Allow reconnecting
				return false;
			}
		}
	}
	return match;
}
function nameCheck(name) {
	return name && typeof name == 'string' && name.length != 0 && name.length <= 20 && /[a-z]/i.test(name) && /^[a-z0-9-_]+$/i.test(name);
}
function sanitize(msg) {
	msg = msg.replace(/&/g, '&amp'); //This needs to be replaced first, in order to not mess up the other codes.
	msg = msg.replace(/</g, '&lt;');
	msg = msg.replace(/>/g, '&gt;');
	msg = msg.replace(/\"/g, '&quot;');
	msg = msg.replace(/\'/g, '&#39;');
	msg = msg.replace(/:/g, '&#58;');
	return msg;
}
//Getting players
function getPlayerByName(name) {
	if (playernames[name]) {
		//Valid
		return players[playernames[name]];
	} else {
		return false;
	}
}
function getPlayerByNumber(num) {
	var p = playernums[num];
	if (p) {
		return players[p];
	}
	//We tried, can't find it.
	return -1;
}
//--Phase change
function setPhase(p) {
	if (phase >= Phase.DAY && phase <= Phase.FIRSTDAY && p <= Phase.MODTIME) {
		if (autoLevel > 0) {
			//Evaluate night actions.
			var results = gm.evaluate(players, playernames, playernums, mod, roles, autoLevel, phase);
			if (autoLevel == 3) {
				for (i in results.targets) {
					var type = results.actions[i][0];
					if (type[0] == '<') {
						type = type.substring(1, type.length - 1);
					}
					var label = results.actions[i][0].substring(1, results.actions[i][0].length - 1);
					if (results.targets[i][1]) {
						players[mod].s.sendMessage(
							Type.SYSTEM,
							'Resultname: ' + i + ' Targets: ' + results.targets[i] + ' Target: ' + results.targets[i][1] + ' Actions: ' + results.actions + ' Messages: ' + results.messages
						);
					}
				}
				for (i in results.actions) {
					var type = results.actions[i][0];
					if (type[0] == '<') {
						type = type.substring(1, type.length - 1);
					}
					var label = results.actions[i][0].substring(1, results.actions[i][0].length - 1);
					players[mod].s.sendMessage(Type.SYSTEM, 'ResultAction: ' + results.actions[i] + 'Label: ' + label);
				}
			} else {
				players[mod].s.sendMessage(Type.SUGGESTIONS, results);
			}
			gm.clear();
		}
		for (i in players) {
			if (players[i].seancing) {
				players[i].seancing.beingSeanced = undefined;
				players[i].seancing = undefined;
			}
		}
	} else if(phase == Phase.PREGAME && p != Phase.PREGAME) {
		//Game start!
		//Send all spectators to the end of the list
		var notspec = playernums.filter(i=>!players[i].spectate);
		var spec = playernums.filter(i=>players[i].spectate);
		playernums = notspec.concat(spec);

		//Resend the list.
		var namelist = playernums.map(function(id) {
			var p = {};
			p.name = players[id].name;
			p.spectate = players[id].spectate;
			p.dev = players[id].dev;
			if (!players[id].alive) {
				p.role = players[id].role;
				p.rolecolor = roles.getRoleData(players[id].role).color;
				p.haswill = !!players[id].publicwill;
			}
			return p;
		});
		sendPublicMessage(Type.ROOMLIST, namelist);
	}
	phase = p;
	timer.setPhase(p);
	sendPublicMessage(Type.SETPHASE, phase, false, timer.time);
	//Reset all silenced players. And the medium seancing
	for (i in players) {
		if (players[i].silenced) {
			players[i].silenced = undefined;
			players[i].s.sendMessage(Type.SYSTEM, 'You are no longer silenced.');
		}
	}
	if (p == Phase.PREGAME) {
		for (i in players) {
			{
				players[i].seance = undefined;
				players[i].doused = false;
				players[i].blackmailed = false;
				players[i].chats.linked = false;

				//Now that the game is over, we can remove all disconnected players
				if(players[i].s.readyState != ws.OPEN) {
					sendPublicMessage(Type.LEAVE, players[i].name);
					//Splice them from the numbers array.
					playernums.splice(playernums.indexOf(i), 1);
					delete playernames[players[i].name];
					delete players[i];
				}
			}
		}
		if(!players[mod]) {
			//Mod was disconnected, give it to someone else.
			if (Object.keys(players).length > 0) {
				mod = getPlayerByNumber(0).s.id;
				players[mod].s.sendMessage(Type.SETMOD, true);
				sendPlayerInfo();
			}
		}
		rainnumber = 0;
	}
	if (p == Phase.NIGHT) {
		//Reset cleaning.
		//Special beginning of night messages.
		for (i in players) {
			//Reset cleaning
			if (players[i].cleaned) {
				players[i].cleaned = false;
				players[mod].s.sendMessage(Type.SYSTEM, players[i].name + "'s Last Will will show upon death.");
			}
			//Werewolf transforming
			var n = gm.getDay();
			if (n % 2 == 0) {
				players[i].s.sendMessage(Type.SYSTEM, 'There is a full moon out tonight.', { styling: 'fullmoon' });
			}
			if (n % 2 == 0 && players[i].role.toLowerCase() == 'werewolf') {
				//Even number, full moon
				if (players[i] == players[mod]) {
				} else {
					players[i].s.sendMessage(Type.SYSTEM, 'The light of the full moon has transformed you into a rampaging Werewolf!', { styling: 'dying' });
				}
			}
			//Jailed player
			if (players[i].chats.linked) {
				players[i].s.sendMessage(Type.PRENOT, 'LINKED');
			}
			if (players[i].chats.jailed) {
				players[i].s.sendMessage(Type.PRENOT, 'JAILED');
				//inform the jailor of their success.
				for (j in players) {
					if (players[j].chats.jailor) {
						players[j].s.sendMessage(Type.PRENOT, 'JAILING');
						players[j].executing = false;
					}
					if ((players[j].chats.mafia && !players[j].chats.jailed && players[i].chats.mafia) || players[j].spectate) {
						players[j].s.sendMessage(Type.SYSTEM, players[i].name + ' was hauled off to jail.');
					}
					if ((players[j].chats.coven && !players[j].chats.jailed && players[i].chats.coven) || players[j].spectate) {
						players[j].s.sendMessage(Type.SYSTEM, players[i].name + ' was hauled off to jail.');
					}
					if ((players[j].chats.vamp && !players[j].chats.jailed && players[i].chats.vamp) || players[j].spectate) {
						players[j].s.sendMessage(Type.SYSTEM, players[i].name + ' was hauled off to jail.');
					}
				}
			}
			//Target info, else if because you do not recieve it if you are jailed.
			else if (i != mod && players[i].alive) {
				if (!players[i].spectate) {
					players[i].s.sendMessage(Type.SYSTEM, 'Use "/target name" or "/t name" to send in your night action.');
				}
			}
			//Medium messages.
			if (players[i].seancing) {
				players[i].s.sendMessage(Type.SYSTEM, 'You have opened a communication with the living!');
				players[i].seance = true;
				players[mod].s.sendMessage(Type.SYSTEM, players[i].name + ' is now talking to ' + players[i].seancing.name);
				players[i].seancing.s.sendMessage(Type.SYSTEM, 'A medium is talking to you!');
				players[i].canSeance = true;
			}
		}
	}
	if (p == Phase.VERDICTS) {
		if (ontrial) {
			sendPublicMessage(Type.HIGHLIGHT, 'Cast your votes now.');
		} else {
			players[mod].s.sendMessage(Type.SYSTEM, 'No player is currently on trial. Phase is being set back to voting.');
			p = Phase.VOTING;
			sendPublicMessage(Type.SETPHASE, Phase.VOTING, false, timer.time);
		}
	}
	if (p == Phase.VOTING) {
		clearVotes();
	}
	if (p == Phase.FIRSTDAY) {
		var mafmembers;
		mafmembers = 'Your partners in crime are:';
		for (i in players) {
			if (players[i].chats.mafia && !players[i].spectate) {
				mafmembers = mafmembers + ' ' + players[i].name + ' (' + sanitize(players[i].role) + ')';
			}
		}
		for (i in players) {
			if (players[i].chats.mafia && !players[i].spectate) {
				players[i].s.sendMessage(Type.SYSTEM, mafmembers);
			}
		}
		var covmembers;
		covmembers = 'Your partners in witchery are:';
		for (i in players) {
			if (players[i].chats.coven && !players[i].spectate) {
				covmembers = covmembers + ' ' + players[i].name + '(' + sanitize(players[i].role) + ')';
			}
		}
		for (i in players) {
			if (players[i].chats.coven && !players[i].spectate) {
				players[i].s.sendMessage(Type.SYSTEM, covmembers);
			}
		}
		var vampmembers;
		vampmembers = 'Your fellow Vampires are:';
		for (i in players) {
			if (players[i].chats.vamp && !players[i].spectate) {
				vampmembers = vampmembers + ' ' + players[i].name + '(' + sanitize(players[i].role) + ')';
			}
		}
		for (i in players) {
			if (players[i].chats.vamp && !players[i].spectate) {
				players[i].s.sendMessage(Type.SYSTEM, vampmembers);
			}
		}
	}
	if (p == Phase.ROLES) {
		for (i in players) {
			players[i].confirm = false;
			if (i != mod) {
				players[i].s.sendMessage(Type.SYSTEM, 'Please type /confirm if you have received a role and are ready to play.');
			}
		}
	}
}
//--IP functions
function getIpReq(req) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket?.remoteAddress || req.connection.socket?.remoteAddress;
	if(!ip || ip.trim() == '::1') return '127.0.0.1';
	return ip;
}
//--Number of living players
function numLivingPlayers() {
	var c = 0;
	for (i in players) {
		if (players[i].alive && !players[i].spectate && i != mod) {
			c++;
		}
	}
	return c;
}
//--Clear the votes, used when putting someone on trial or entering the voting phase.
function clearVotes() {
	for (i in players) {
		players[i].votes = 0;
		players[i].votingFor = undefined;
		sendPublicMessage(Type.CLEARVOTES);
	}
}
//--Check if the player is on trial
function trialCheck(player) {
	//Check if the player has been put on trial
	var living = numLivingPlayers();
	var threshold = Math.floor(living / 2) + 1;
	if (player.votes >= threshold) {
		//Put the player on trial.
		clearVotes();
		setPhase(Phase.TRIAL);
		sendPublicMessage(Type.HIGHLIGHT, player.name + ' has been put on trial. What is your defense?');
		sendPublicMessage(Type.SETPHASE, phase, true, timer.time);
		ontrial = player.s.id;
	}
}
function isVerified(ip) {
	if (verified[ip]) {
		//Reset timeout.
		clearTimeout(verified[ip]);
		verified[ip] = setTimeout(function () {
			expireVerification(ip);
		}, 5 * 60 * 1000);
		return true;
	} else {
		return false;
	}
}
function expireVerification(ip) {
	if (verified[ip]) {
		delete verified[ip];
	}
}
//--Timer object

function Timer() {
	return {
		paused: false,
		time: 0,
		buffertime: undefined,
		phase: [
			0,
			0,
			0, //Pregame, Roles, Modtime.
			60, //Day		60
			30, //Voting
			20, //Trial
			20, //Verdict
			10, //Last words
			60, //Night		60
			30, //Day 1		30
		],
		tock: function () {
			switch (phase) {
				case Phase.DAY:
					//Change to voting.
					setPhase(Phase.VOTING);
					break;
				case Phase.VOTING:
				case Phase.NIGHT:
					var prevphase = phase;
					//Change to modtime.
					setPhase(Phase.MODTIME);
					break;
				case Phase.TRIAL:
					//Change to verdicts.
					setPhase(Phase.VERDICTS);
					break;
				case Phase.VERDICTS:
					//Count the verdicts and declare the person guilty or inno.
					var result = 0;
					var votes = {};
					for (i in players) {
						if (players[i].alive && players[i].s.id != mod && players[i].s.id != ontrial && !players[i].spectate) {
							result += players[i].verdict;
							votes[players[i].name] = players[i].verdict;
						}
						players[i].verdict = 0;
					}
					if (result < 0) {
						//Guilty, die!
						setPhase(Phase.LASTWORDS);
					} //Innocent
					else {
						setPhase(Phase.VOTING);
					}
					sendPublicMessage(Type.JUDGEMENT, votes, result < 0);
					break;
				case Phase.LASTWORDS:
					//Change to firstday.
					setPhase(Phase.FIRSTDAY);
					break;
				case Phase.FIRSTDAY:
					//Change to modtime.
					setPhase(Phase.NIGHT);
					break;
			}
		},
		tick: function () {
			if (!this.paused) {
				if (this.time > 0) {
					this.time--;
				} else {
					this.tock();
				}
				sendPublicMessage(Type.TICK, this.time);
			}
			setTimeout(function () {
				timer.tick();
			}, 1000);
		},
		ping: function () {
			for (i in players) {
				if (players[i].ping == -1) {
					players[i].pingTime += 10;
				}
			}
			setTimeout(timer.ping, 10);
		},
		setPhase: function (num) {
			if (num == Phase.TRIAL) {
				this.buffertime = this.time;
				this.time = this.phase[num];
			} else if (num == Phase.VOTING && this.buffertime) {
				this.time = this.buffertime;
				this.buffertime = undefined;
			} else if (num == Phase.LASTWORDS) {
				this.buffertime = undefined;
				this.time = this.phase[num];
			} else {
				this.time = this.phase[num];
			}
		},
	};
}
function formatData(data) {
	var date = addZero(testTime.getDate() + 1) + '/' + addZero(testTime.getMonth() + 1) + '/' + testTime.getFullYear();
	data = data.replace('%date%', date);
	var time = addZero(testTime.getHours()) + ':' + addZero(testTime.getMinutes());
	data = data.replace('%time%', time);
	return data;
}
function addZero(num) {
	if ((num + '').length == 1) {
		num = '0' + num;
	}
	return num;
}
function loadDate() {
	console.log('Loading date...');
}
function loadBanlist() {
	console.log('Loading banlist...');
	banlist = [];
}
function loadPassword() {
	console.log('Loading password...');
	apass = 'ferriswheels';
	console.log('Password is: ' + apass);
}
function showConfirms() {
	var c = 0;
	var unconfirmed = [];
	for (i in players) {
		if (players[i].confirm) {
			c++;
		} else if (mod != players[i].s.id) {
			unconfirmed.push(players[i].name);
		}
	}
	var total = Object.keys(players).length - 1;
	if (c < total) {
		sendPublicMessage(Type.SYSTEM, c + '/' + total + ' players confirmed.');
		sendPublicMessage(Type.SYSTEM, 'Unconfirmed: ' + unconfirmed.join(', '));
	} else {
		sendPublicMessage(Type.SYSTEM, 'All players confirmed.');
	}
}
//Pinging functions
function ping() {
	for (i in players) {
		players[i].ping = -1;
		players[i].pingTime = 0;
		players[i].s.sendMessage(Type.PING);
	}
	setTimeout(checkPing, 10000);
}
function checkPing() {
	for (i in players) {
		if (players[i].ping == -1) {
			//Player did not reply after 10 seconds. Disconnected.
			players[i].s.close();
		}
	}
	setTimeout(ping, 0);
}
//Durstenfeld shuffle
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
//Send all info about players to the new mod
function sendPlayerInfo() {
	var final = [];
	for (j in players) {
		var send = {};
		for (i in players[j].chats) {
			if (players[j].chats[i]) {
				send[i] = players[j].chats[i];
			}
		}
		//Exceptions
		send.name = players[j].name;
		send.alive = players[j].alive;
		send.blackmailer = players[j].hearwhispers;
		send.mayor = players[j].mayor !== undefined;
		send.jailor = players[j].jailor !== undefined;
		send.role = players[j].role;

		final.push(send);
	}
	players[mod].s.sendMessage(Type.MASSROLEUPDATE, final);
}
//--Player object
function Player(socket, name, ip) {
	//Add to the playernames array, allowing this object to be referenced by name.
	playernames[name] = socket.id;
	//Add to the playernums array, allowing this object to be referenced by number.
	playernums.push(socket.id);
	return {
		s: socket,
		name: name,
		dev: false,
		ip: ip,
		will: '',
		notes: '',
		ping: 0,
		pingTime: 0,
		fault: 0,
		role: 'NoRole',
		alive: true,
		canSeance: false,
		votelock: false,
		mayor: undefined,
		jailorcom: false,
		spectate: false,
		afk: undefined,
		seance: undefined,
		blackmailed: false,
		doused: false,
		hearwhispers: false,
		votingFor: undefined,
		confirm: false,
		executing: false,
		votes: 0,
		verdict: 0, //0 for abstain, -1 for guilty, 1 for inno
		chats: {
			dead: false,
			mafia: false,
			coven: false,
			vamp: false,
			jailor: false,
			jailed: false,
			medium: false,
			linked: false,
			spectate: false,
		},
		//Player functions
		setRole: function (role) {
			this.role = role = role.trim();
			if (role.length == 0) {
				this.role = 'NoRole';
				this.s.sendMessage(Type.System, 'Your role has been removed.');
			} else if (roles.hasRolecard(role)) {
				var rolecard = roles.getRoleCard(role, {});
				this.s.sendMessage(Type.ROLECARD, rolecard);
			} else {
				this.s.sendMessage(Type.SYSTEM, 'Your role is ' + sanitize(role));
			}
			this.s.sendMessage(Type.SETROLE, {
				role: this.role,
				rolecolor: roles.getRoleData(this.role).color,
			});
		},
		dc: function () {
			sendPublicMessage(Type.DISCONNECT, this.name);
			this.visibly_disconnected = true;
			var is_late_spectator = playernums.slice(playernums.indexOf(this.s.id)).every(function(id) {
				//It's OK to renumber spectators
				return players[id].spectate;
			});
			if(phase === Phase.PREGAME || is_late_spectator) {
				sendPublicMessage(Type.LEAVE, this.name);
				//Splice them from the numbers array.
				playernums.splice(playernums.indexOf(this.s.id), 1);
				delete playernames[this.name];
				delete players[this.s.id];
				if (mod == this.s.id) {
					//Player was mod, give it to someone else.
					if (Object.keys(players).length > 0) {
						mod = getPlayerByNumber(0).s.id;
						players[mod].s.sendMessage(Type.SETMOD, true);
						sendPlayerInfo();
					}
				}
			} else {
				if (mod == this.s.id) {
					setTimeout(function () {
						if(!(players[mod] && players[mod].s.readyState == ws.OPEN)) {
							sendPublicMessage(Type.SYSTEM, 'Game canceled because the mod has been disconnected for over a minute.');
							setPhase(Phase.PREGAME);
						}
					}, 1 * 60 * 1000); // 1 minute.
				}
			}
		},
		castVerdict: function (verdict, forced) {
			if (ontrial == this.s.id) {
				this.s.sendMessage(Type.SYSTEM, 'You cannot vote on your own trial.');
			} else if (this.spectate) {
				this.s.sendMessage(Type.SYSTEM, 'You are already omniscient, what do you want more?');
			} else if (!this.alive) {
				this.s.sendMessage(Type.SYSTEM, 'You need to be alive to vote.');
			} else if (this.votelock && !forced) {
				this.s.sendMessage(Type.SYSTEM, 'You cannot cast a verdict while votelocked.');
			} else {
				var name = this.name;
				if (verdict === true) {
					//Inno
					if (this.verdict == 1) {
						//Already inno, cancel
						this.verdict = 0;
						sendPublicMessage(Type.VERDICT, name, 2);
					} else if (this.verdict == -1) {
						//Guilty, change
						this.verdict = this.mayor ? 3 : 1;
						sendPublicMessage(Type.VERDICT, name, 1);
					} else {
						this.verdict = this.mayor ? 3 : 1;
						sendPublicMessage(Type.VERDICT, name, 0);
					}
				} else if (verdict === false) {
					//Guilty
					if (this.verdict == -1) {
						//Already guilty, cancel
						this.verdict = 0;
						sendPublicMessage(Type.VERDICT, name, 2);
					} else if (this.verdict == 1) {
						//Inno, change
						this.verdict = this.mayor ? -3 : -1;
						sendPublicMessage(Type.VERDICT, name, 1);
					} else {
						this.verdict = this.mayor ? -3 : -1;
						sendPublicMessage(Type.VERDICT, name, 0);
					}
				}
			}
		},
		vote: function (name, forced) {
			if (phase != Phase.VOTING) {
				socket.sendMessage(Type.SYSTEM, 'You can only vote in the voting phase.');
			} else if (!this.alive) {
				socket.sendMessage(Type.SYSTEM, 'You need to be alive to vote.');
			} else if (this.spectate) {
				this.s.sendMessage(Type.SYSTEM, 'You are already omniscient, what do you want more?');
			} else {
				var player = getPlayerByName(name);
				if (player) {
					var isspec = false;
					for (i in players) {
						if (players[i].spectate && players[i].name == name) {
							isspec = true;
						}
					}
					if (isspec) {
						this.s.sendMessage(Type.SYSTEM, 'You cannot vote a Spectator');
					} else if (this.votelock && !forced) {
						this.s.sendMessage(Type.SYSTEM, 'Your vote has been locked by the mod. You cannot vote or cancel your vote until it is unlocked.');
					} else if (name == this.name && !forced) {
						this.s.sendMessage(Type.SYSTEM, 'You cannot vote for yourself.');
					} else if (name == players[mod].name) {
						this.s.sendMessage(Type.SYSTEM, 'You cannot vote for the mod.');
					} else if (this.s.id == mod) {
						this.s.sendMessage(Type.SYSTEM, 'The mod cannot vote.');
					} else if (this.votingFor == player.s.id) {
						//Same person, cancel vote.
						var prev = player.name;
						if (this.mayor) {
							players[this.votingFor].votes -= 3;
						} else {
							players[this.votingFor].votes--; //subtract a vote from the person that was being voted.
						}
						if (!this.silenced) {
							sendPublicMessage(Type.VOTE, this.name, ' has cancelled their vote.', '', prev);
						}
						this.votingFor = undefined;
					} else if (this.votingFor) {
						//Previous voter
						var prev = this.votingFor;
						if (this.mayor) {
							players[prev].votes -= 3; //subtract 3 votes from the person that was being voted.
							player.votes += 3; //Add 3 votes to the new person
						} else if (players[prev]) {
							players[prev].votes--; //subtract a vote from the person that was being voted.
							player.votes++; //Add a vote to the new person
						}
						if (!this.silenced) {
							sendPublicMessage(Type.VOTE, this.name, ' has changed their vote to ', player.name, players[prev].name);
						}
						this.votingFor = player.s.id;
					} else {
						if (!this.silenced) {
							sendPublicMessage(Type.VOTE, this.name, ' has voted for ', player.name);
						}
						this.votingFor = player.s.id;
						if (this.mayor) {
							player.votes += 3;
						} else {
							player.votes++;
						}
					}
					trialCheck(player);
				} else {
					socket.sendMessage(Type.SYSTEM, '"' + sanitize(name) + '" is not a valid player.');
				}
			}
		},
		command: function (com) {
			var c = com.split(' ');
			switch (c[0].toLowerCase()) {
				case 'help':
					var list = {
						all: clone(commandList.all),
					};
					if (mod == this.s.id) {
						list.mod = clone(commandList.mod);
					}
					if (this.dev) {
						list.dev = clone(commandList.dev);
					}
					list.fun = clone(commandList.fun);
					this.s.sendMessage(Type.HELP, list);
					break;
				case 'whisper':
				case 'w':
					if (this.silenced) {
						this.silencedError();
					} else if (this.spectate) {
						this.s.sendMessage(Type.SYSTEM, 'As a Spectator you cannot whisper');
					} else if ((phase >= Phase.DAY && phase <= Phase.LASTWORDS) || phase == Phase.PREGAME || phase == Phase.FIRSTDAY) {
						if (this.blackmailed && phase != Phase.PREGAME) {
							this.s.sendMessage(Type.SYSTEM, 'You cannot whisper while blackmailed.');
						} else if (!this.alive && phase != Phase.PREGAME) {
							this.s.sendMessage(Type.SYSTEM, 'You need to be alive to whisper.');
						} else {
							if (c.length > 2) {
								if (playernames[c[1]]) {
									//Valid player name.
									var msg = c.slice();
									msg.splice(0, 2);
									msg = msg.join(' ');
									msg = sanitize(msg);
									this.whisper(msg, players[playernames[c[1]]]);
								} else if (!isNaN(c[1])) {
									//It's a number.
									//Get the numbered player.
									var target = getPlayerByNumber(c[1]);
									if (target != -1) {
										var name = target.name;
										var msg = c.slice();
										msg.splice(0, 2);
										msg = msg.join(' ');
										msg = sanitize(msg);
										this.whisper(msg, target);
									} else {
										this.s.sendMessage(Type.SYSTEM, 'Could not find player number ' + sanitize(c[1]) + '!');
									}
								} else {
									this.s.sendMessage(Type.SYSTEM, "'" + sanitize(c[1]) + "' is not a valid player.");
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/w name message'.");
							}
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You can only whisper during the day.');
					}
					break;
				case 'seance':
					if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'The mod cannot use this command.');
					} else if (this.chats.medium) {
						if (this.canSeance) {
							if (!this.alive) {
								if ((phase >= Phase.DAY && phase <= Phase.LASTWORDS) || phase == Phase.FIRSTDAY) {
									if (this.seance === undefined) {
										var seance = function (medium, target) {
											if (target.name == medium.name) {
												medium.s.sendMessage(Type.SYSTEM, 'You cannot seance yourself.');
											} else if (!target.alive) {
												medium.s.sendMessage(Type.SYSTEM, 'You cannot seance a dead person.');
											} else if (mod == target.s.id) {
												if (medium.seancing) {
													medium.s.sendMessage(Type.SYSTEM, 'You cancel your seance.');
													medium.seancing.beingSeanced = undefined;
													medium.seancing = undefined;
													players[mod].s.sendMessage(Type.SYSTEM, medium.name + ' cancels their seance.');
												} else {
													medium.s.sendMessage(Type.SYSTEM, 'You are not targetting anyone.');
												}
											} else if (medium.seancing && medium.seancing == target) {
												medium.s.sendMessage(Type.SYSTEM, 'You cancel your seance.');
												medium.seancing.beingSeanced = undefined;
												medium.seancing = undefined;
												players[mod].s.sendMessage(Type.SYSTEM, medium.name + ' cancels their seance.');
											} else {
												medium.s.sendMessage(Type.SYSTEM, 'You are now seancing ' + target.name + '.');
												medium.seancing = target;
												medium.seancing.beingSeanced = medium;
												players[mod].s.sendMessage(Type.SYSTEM, medium.name + ' is now seancing ' + target.name + '.');
												for (i in players) {
													if (players[i].spectate) {
														players[i].s.sendMessage(Type.SYSTEM, medium.name + ' is now seancing ' + target.name + '.');
													}
												}
											}
										};
										if (playernames[c[1]]) {
											seance(this, players[playernames[c[1]]]);
										} else if (!isNaN(c[1])) {
											//Get the numbered player.
											var target = getPlayerByNumber(c[1]);
											if (target != -1) {
												seance(this, target);
											} else {
												this.s.sendMessage(Type.SYSTEM, 'Could not find player number ' + sanitize(c[1]) + '!');
											}
										} else {
											this.s.sendMessage(Type.SYSTEM, sanitize(c[1]) + ' is not a valid player.');
										}
									} else {
										this.s.sendMessage(Type.SYSTEM, 'You have 0 seances left.');
									}
								} else {
									this.s.sendMessage(Type.SYSTEM, 'You can only use this command during the day.');
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, 'You need to be dead to seance.');
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You have 0 seances left.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'Only a medium can seance.');
					}
					break;
				case 'clean':
					if (mod == this.s.id) {
						if (c.length == 2) {
							if (playernames[c[1]]) {
								players[playernames[c[1]]].cleaned = !players[playernames[c[1]]].cleaned;
								if (players[playernames[c[1]]].cleaned) {
									this.s.sendMessage(Type.SYSTEM, sanitize(c[1]) + "'s Last Will will no longer show upon death.");
								} else {
									this.s.sendMessage(Type.SYSTEM, sanitize(c[1]) + "'s Last Will will show upon death.");
								}
							} else if (!isNaN(c[1])) {
								//Get the numbered player.
								var target = getPlayerByNumber(c[1]);
								if (target != -1) {
									target.cleaned = !target.cleaned;
									if (target.cleaned) {
										this.s.sendMessage(Type.SYSTEM, target.name + "'s Last Will will no longer show upon death.");
									} else {
										this.s.sendMessage(Type.SYSTEM, target.name + "'s Last Will will show upon death.");
									}
								} else {
									this.s.sendMessage(Type.SYSTEM, 'Could not find player number ' + sanitize(c[1]) + '!');
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, sanitize(c[1]) + ' is not a valid player.');
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /clean [name/number]');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'Only the mod can use that command.');
					}
					break;
				case 'disguise':
					if (mod == this.s.id) {
						if (c.length == 3) {
							//Disguiser
							var first = undefined;
							if (isNaN(c[1])) {
								first = getPlayerByName(c[1]);
							} else {
								first = getPlayerByNumber(c[1]);
							}
							//Target
							var second = undefined;
							if (isNaN(c[2])) {
								second = getPlayerByName(c[2]);
							} else {
								second = getPlayerByNumber(c[2]);
							}
							if (first && second && first != -1 && second != -1) {
								socket.sendMessage(Type.SYSTEM, first.name + ' disguised as ' + second.name + '.');
								first.s.sendMessage(Type.HIGHLIGHT, 'You successfully disguised!');
								second.s.sendMessage(Type.HIGHLIGHT, 'A disguiser stole your identity!');
								//Swap names in the playernames
								var temp = playernames[first.name];
								playernames[first.name] = second.s.id;
								playernames[second.name] = temp;
								//Swap names
								var temp = first.name;
								first.name = second.name;
								second.name = temp;
								//Swap numbers
								var one = playernums.indexOf(first.s.id);
								var two = playernums.indexOf(second.s.id);
								var temp = playernums[one];
								playernums[one] = playernums[two];
								playernums[two] = temp;
								sendPlayerInfo();
							} else {
								this.s.sendMessage(Type.SYSTEM, 'Invalid players!');
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /disguise disguiser target');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the mod to use this command.');
					}
					break;
				case 'givemod':
					if (mod == this.s.id || this.dev) {
						if (c.length < 2) {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/givemod player'.");
						} else {
							if (playernames[c[1]]) {
								//Valid player name.
								players[mod].s.sendMessage(Type.SETMOD, false);
								if (players[playernames[c[1]]].s.id == players[mod].s.id) {
									this.s.sendMessage(Type.SYSTEM, 'You are already the mod.');
								} else {
									var prevMod = mod;
									mod = players[playernames[c[1]]].s.id;
									players[mod].s.sendMessage(Type.SETMOD, true);
									sendPublicMessage(Type.HIGHLIGHT, this.name + ' gives mod to ' + players[mod].name + '.');
									sendPublicMessage(Type.SWITCH, players[prevMod].name, players[mod].name);
									//Switch the numbers.
									var a = playernums.indexOf(players[prevMod].s.id);
									var b = playernums.indexOf(mod);
									var temp = playernums[a];
									playernums[a] = playernums[b];
									playernums[b] = temp;
									sendPlayerInfo();
								}
							} else if (!isNaN(c[1])) {
								//It's a number.
								//Get the numbered player.
								var target = getPlayerByNumber(c[1]);
								if (target != -1) {
									var prevMod = mod;
									var name = target.name;
									if (target.s.id != players[prevMod].s.id) {
										players[mod].s.sendMessage(Type.SETMOD, false);
										mod = target.s.id;
										players[mod].s.sendMessage(Type.SETMOD, true);
										sendPublicMessage(Type.HIGHLIGHT, this.name + ' gives mod to ' + players[mod].name + '.');
										sendPublicMessage(Type.SWITCH, players[prevMod].name, players[mod].name);
										//Switch the numbers.
										var a = playernums.indexOf(players[prevMod].s.id);
										var b = playernums.indexOf(mod);
										var temp = playernums[a];
										playernums[a] = playernums[b];
										playernums[b] = temp;
										sendPlayerInfo();
									} else {
										this.s.sendMessage(Type.SYSTEM, 'You are already the mod.');
									}
								} else {
									this.s.sendMessage(Type.SYSTEM, 'Could not find player number ' + sanitize(c[1]) + '!');
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, "'" + sanitize(c[1]) + "' is not a valid player.");
							}
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You do not have permission to use this command.');
					}
					break;
				case 'mod':
					if (this.silenced) {
						this.silencedError();
					} else if (c.length < 2) {
						this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/mod message'.");
					} else {
						var msg = c.slice();
						msg.splice(0, 1);
						msg = msg.join(' ');
						msg = sanitize(msg);
						players[mod].s.sendMessage(Type.MOD, { from: this.name, msg: msg });
						this.s.sendMessage(Type.MOD, { to: 'Mod', msg: msg });
					}
					break;
				case 'unsilence':
					if (this.dev) {
						if (c.length < 2) {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/unsilence player'.");
						} else {
							if (playernames[c[1]]) {
								if (!players[playernames[c[1]]].silenced) {
									this.s.sendMessage(Type.SYSTEM, sanitize(c[1]) + ' is not silenced.');
								} else {
									sendPublicMessage(Type.HIGHLIGHT, sanitize(c[1]) + ' is now unsilenced.');
									players[playernames[c[1]]].silenced = undefined;
								}
							} else if (!isNaN(c[1])) {
								//It's a number.
								//Get the numbered player.
								var target = getPlayerByNumber(c[1]);
								if (target != -1) {
									if (!target.silenced) {
										this.s.sendMessage(Type.SYSTEM, target.name + ' is not silenced.');
									} else {
										sendPublicMessage(Type.HIGHLIGHT, target.name + ' is now unsilenced.');
										target.silenced = undefined;
									}
								} else {
									this.s.sendMessage(Type.SYSTEM, 'Could not find player number ' + sanitize(c[1]) + '!');
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, 'Could not find player ' + sanitize(c[1]) + '!');
							}
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You do not have the correct permissions to use this command.');
					}
					break;
				case 'silence':
					if (this.dev) {
						if (c.length < 2) {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/silence player [reason]'.");
						} else {
							if (playernames[c[1]]) {
								if (players[playernames[c[1]]].silenced) {
									this.s.sendMessage(Type.SYSTEM, c[1] + ' is already silenced.');
								} else {
									players[playernames[c[1]]].silenced = this.name;
									if (c[2]) {
										players[playernames[c[1]]].silenced += '/' + c.slice(2, c.length).join(' ');
									}
									this.s.sendMessage(Type.SYSTEM, 'You have silenced ' + sanitize(c[1]) + ' for the phase. You can use /unsilence to unsilence them early.');
									var msg = players[playernames[c[1]]].name + ' was silenced for this phase by ' + this.name + '.';
									if (c[2]) {
										msg += ' Reason: ' + sanitize(c.slice(2, c.length).join(' '));
									}
									sendPublicMessage(Type.HIGHLIGHT, msg);
								}
							} else if (!isNaN(c[1])) {
								//It's a number.
								//Get the numbered player.
								var target = getPlayerByNumber(c[1]);
								if (target != -1) {
									if (target.silenced) {
										this.s.sendMessage(Type.SYSTEM, target.name + ' is already silenced.');
									} else {
										target.silenced = this.name;
										if (c[2]) {
											target.silenced += '/' + c.slice(2, c.length).join(' ');
										}
										this.s.sendMessage(Type.SYSTEM, 'You have silenced ' + target.name + ' for the phase. You can use /unsilence to unsilence them early.');
										var msg = target.name + ' was silenced for the phase by ' + this.name + '.';
										if (c[2]) {
											msg += ' Reason: ' + sanitize(c.slice(2, c.length).join(' '));
										}
										sendPublicMessage(Type.HIGHLIGHT, msg);
									}
								} else {
									this.s.sendMessage(Type.SYSTEM, 'Could not find player number ' + sanitize(c[1]) + '!');
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, 'Could not find player ' + sanitize(c[1]) + '!');
							}
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You do not have the correct permissions to use this command.');
					}
					break;
				case 'random':
					if (mod == this.s.id) {
						if (c.length != 1) {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/random'.");
						} else {
							var length = Object.keys(players).length - 1; //Minus mod
							if (length > 0) {
								var randomNumber = Math.floor(Math.random() * length) + 1;
								this.s.sendMessage(Type.SYSTEM, 'Random player: ' + getPlayerByNumber(randomNumber).name);
							} else {
								this.s.sendMessage(Type.SYSTEM, 'Not enough players to use this command.');
							}
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the mod to use this command.');
					}
					break;
				case 'roll':
					if (mod == this.s.id) {
						if (c.length > 2) {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/roll number'.");
						} else {
							var sides = c[1] ? c[1] : 6; //Specified value or 6.
							var randomNumber = Math.floor(Math.random() * sides) + 1;
							this.s.sendMessage(Type.SYSTEM, 'Dice roll (' + sides + ' sides): ' + randomNumber);
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the mod to use this command.');
					}
					break;
				case 'forceverdict':
					if (mod == this.s.id) {
						if (phase == Phase.VERDICTS) {
							if (c.length == 3) {
								var one = c[1];
								if (!isNaN(one)) {
									p = getPlayerByNumber(one);
									if (p == -1) {
										if (!error) {
											this.s.sendMessage(Type.SYSTEM, one + ' is not a valid player.');
											error = true;
										}
									} else {
										one = p.name;
									}
								}
								if (!error) {
									if (c[2] == 'guilty' || c[2] == 'g') {
										p.castVerdict(false, true);
									} else if (c[2] == 'innocent' || c[2] == 'inno' || c[2] == 'i') {
										p.castVerdict(true, true);
									} else {
										this.s.sendMessage(Type.SYSTEM, "'" + sanitize(c[2]) + "' is not a valid option.");
										error = true;
									}
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /forceverdict player [guilty/innocent]');
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'This command can only be used during the verdicts phase.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the mod to use this command.');
					}
					break;
				case 'settrial':
					if (mod == this.s.id) {
						if (c.length == 2) {
							var error = false;
							var one = sanitize(c[1]);
							if (!isNaN(one)) {
								p = getPlayerByNumber(one);
								if (p == -1) {
									this.s.sendMessage(Type.SYSTEM, one + ' is not a valid player.');
									error = true;
								} else {
									one = p.name;
								}
							}
							var p = getPlayerByName(one);
							if (p) {
							} else {
								this.s.sendMessage(Type.SYSTEM, "'" + one + "' is not a player.");
								error = true;
							}
							if (!error) {
								sendPublicMessage(Type.HIGHLIGHT, 'The mod has put ' + one + ' on trial.');
								setPhase(Phase.TRIAL);
								ontrial = p.s.id;
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /settrial person.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the mod to use this command.');
					}
					break;
				case 'lockvote':
					if (mod == this.s.id) {
						if (c.length == 2) {
							var error = false;
							var one = sanitize(c[1]);
							if (!isNaN(one)) {
								p = getPlayerByNumber(one);
								if (p == -1) {
									this.s.sendMessage(Type.SYSTEM, one + ' is not a valid player.');
									error = true;
								} else {
									one = p.name;
								}
							}
							var p = getPlayerByName(one);
							if (p) {
							} else {
								this.s.sendMessage(Type.SYSTEM, "'" + one + "' is not a player.");
								error = true;
							}
							if (!error && players[playernames[one]].votelock) {
								error = true;
								this.s.sendMessage(Type.SYSTEM, one + "'s vote is already locked.");
							}
							if (!error) {
								players[playernames[one]].s.sendMessage(Type.SYSTEM, 'Your vote has been locked.');
								players[playernames[one]].votelock = true;
								this.s.sendMessage(Type.SYSTEM, one + "'s vote is now locked.");
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /lockvote person.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the mod to use this command.');
					}
					break;
				case 'unlockvote':
					if (mod == this.s.id) {
						if (c.length == 2) {
							var error = false;
							var one = sanitize(c[1]);
							if (!isNaN(one)) {
								p = getPlayerByNumber(one);
								if (p == -1) {
									this.s.sendMessage(Type.SYSTEM, one + ' is not a valid player.');
									error = true;
								} else {
									one = p.name;
								}
							}
							var p = getPlayerByName(one);
							if (p) {
							} else {
								this.s.sendMessage(Type.SYSTEM, "'" + one + "' is not a player.");
								error = true;
							}
							if (!error && !players[playernames[one]].votelock) {
								error = true;
								this.s.sendMessage(Type.SYSTEM, one + "'s vote is not locked.");
							}
							if (!error) {
								players[playernames[one]].s.sendMessage(Type.SYSTEM, 'Your vote has been unlocked.');
								players[playernames[one]].votelock = false;
								this.s.sendMessage(Type.SYSTEM, one + "'s vote is now unlocked.");
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /unlockvote person.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the mod to use this command.');
					}
					break;
				case 'forcevote':
					if (mod == this.s.id) {
						if (phase == Phase.VOTING) {
							if (c.length == 3) {
								var error = false;
								var one = sanitize(c[1]);
								var two = sanitize(c[2]);
								if (!isNaN(one)) {
									p = getPlayerByNumber(one);
									if (p == -1) {
										if (!error) {
											this.s.sendMessage(Type.SYSTEM, one + ' is not a valid player.');
											error = true;
										}
									} else {
										one = p.name;
									}
								}
								if (!isNaN(two)) {
									p = getPlayerByNumber(two);
									if (p == -1) {
										if (!error) {
											this.s.sendMessage(Type.SYSTEM, two + ' is not a valid player.');
											error = true;
										}
									} else {
										two = p.name;
									}
								}
								//Namecheck
								var p = getPlayerByName(one);
								var p2 = getPlayerByName(two);
								if (p) {
								} else {
									this.s.sendMessage(Type.SYSTEM, "'" + one + "' is not a player.");
									error = true;
								}
								if (p2) {
								} else {
									this.s.sendMessage(Type.SYSTEM, "'" + two + "' is not a player.");
									error = true;
								}
								if (!error) {
									players[playernames[one]].s.sendMessage(Type.SYSTEM, 'The mod has forced you to vote for ' + two + '.');
									players[playernames[one]].vote(two, true);
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /forcevote person1 person2.');
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You cannot use this command outside of the voting phase.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the mod to use this command.');
					}
					break;
				case 'vote':
					if (c.length == 2) {
						if (isNaN(c[1])) {
							this.vote(c[1]);
						} else {
							this.s.sendMessage(Type.SYSTEM, 'This command only accepts names, and is only to be used if the voting interface is not working.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/vote name'");
					}
					break;
				case 'dev':
					if (c.length == 2) {
						var password = c[1];
						if (this.dev) {
							this.s.sendMessage(Type.SYSTEM, 'You already have access to the dev commands.');
						} else if (apass == password) {
							this.s.sendMessage(Type.SYSTEM, 'Password accepted. You now have access to dev commands.');
							this.dev = true;
							sendPublicMessage(Type.SETDEV, this.name);
						} else {
							this.s.sendMessage(Type.SYSTEM, 'Incorrect password!');
						}
					} else {
						socket.sendMessage(Type.SYSTEM, "The syntax of this command is '/dev password'.");
					}
					break;
				case 'reveal':
					if (this.mayor === undefined) {
						this.s.sendMessage(Type.SYSTEM, "...but you aren't the Mayor.");
					} else if (this.mayor) {
						this.s.sendMessage(Type.SYSTEM, 'You have already revealed yourself as the Mayor.');
					} else if (!this.alive) {
						this.s.sendMessage(Type.SYSTEM, 'You must be alive to reveal.');
					} else if ((phase >= Phase.DAY && phase <= Phase.LASTWORDS) || phase == Phase.FIRSTDAY) {
						sendPublicMessage(Type.MAYOR, this.name);
						this.mayor = true;
						if (this.votingFor) {
							players[this.votingFor].votes += 2;
							trialCheck(players[this.votingFor]);
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You can only reveal as the Mayor during the day.');
					}
					break;
				case 'jail':
					if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'The mod cannot use this command.');
					} else if (this.jailorcom === false) {
						this.s.sendMessage(Type.SYSTEM, 'Only the jailor can detain people.');
					} else if (!this.alive) {
						this.s.sendMessage(Type.SYSTEM, 'You must be alive to jail.');
					} else if ((phase >= Phase.DAY && phase <= Phase.LASTWORDS) || phase == Phase.FIRSTDAY) {
						var args = c.slice(1, c.length);
						var targets = [];
						var error = false;
						if (args.length == 0 || args[0] == '0') {
							var actions = gm.getActions(this.name);
							if (actions && actions.length > 0) {
								//This is a cancel
							} else {
								error = true;
								this.s.sendMessage(Type.SYSTEM, 'You are not targetting anyone.');
							}
						} else {
							//Check if the targetting is valid
							var vt = gm.validTarget(args, this.role.toLowerCase(), players, playernames, playernums, this, phase);
							if (vt == 'notfound' || vt == 'ok' || free) {
								for (i in args) {
									if (args[i] != '') {
										if (isNaN(args[i])) {
											var p = getPlayerByName(args[i]);
										} else {
											var p = getPlayerByNumber(parseInt(args[i]));
										}
										if (p && p != -1) {
											if (p.s.id != mod) {
												targets.push(p.name);
											} else {
												this.s.sendMessage(Type.SYSTEM, 'You cannot jail the mod.');
												error = true;
												break;
											}
										} else {
											this.s.sendMessage(Type.SYSTEM, 'Invalid player: ' + sanitize(args[i]));
											error = true;
											break;
										}
									}
								}
							} else {
								error = true;
								var message = vt;
								this.s.sendMessage(Type.SYSTEM, message);
							}
						}
						if (!error) {
							this.target(targets);
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You can only jail during the day.');
					}
					break;
				case 't':
				case 'target':
				case 'freetarget':
				case 'ft':
					var free = false;
					if (c[0].toLowerCase() == 'ft' || c[0].toLowerCase() == 'freetarget') {
						free = true;
					}
					if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'The mod cannot use this command.');
					} else if (this.spectate) {
						this.s.sendMessage(Type.SYSTEM, 'You are not allowed to take influence in the game.');
					} else if (this.chats.jailed) {
						this.s.sendMessage(Type.SYSTEM, 'You cannot use this command while jailed.');
					} else if (!this.alive) {
						this.s.sendMessage(Type.SYSTEM, 'You cannot use this while dead.');
					} else if (phase != Phase.NIGHT) {
						this.s.sendMessage(Type.SYSTEM, 'You can only use this command at night.');
					} else {
						var args = c.slice(1, c.length);
						var targets = [];
						var error = false;
						if (args.length == 0 || args[0] == '0') {
							var actions = gm.getActions(this.name);
							if (actions && actions.length > 0) {
								//This is a cancel
							} else {
								error = true;
								this.s.sendMessage(Type.SYSTEM, 'You are not targetting anyone.');
							}
						} else {
							//Check if the targetting is valid
							var vt = gm.validTarget(args, this.role.toLowerCase(), players, playernames, playernums, this, phase);
							if (vt == 'notfound' || vt == 'ok' || free) {
								for (i in args) {
									if (args[i] != '') {
										if (isNaN(args[i])) {
											var p = getPlayerByName(args[i]);
										} else {
											var p = getPlayerByNumber(parseInt(args[i]));
										}
										if (p && p != -1) {
											if (p.s.id != mod) {
												targets.push(p.name);
											} else {
												this.s.sendMessage(Type.SYSTEM, 'You cannot target the mod.');
												error = true;
												break;
											}
										} else {
											this.s.sendMessage(Type.SYSTEM, 'Invalid player: ' + sanitize(args[i]));
											error = true;
											break;
										}
									}
								}
							} else {
								error = true;
								var message = vt;
								this.s.sendMessage(Type.SYSTEM, message);
							}
						}
						if (!error) {
							this.target(targets);
						}
					}
					break;
				case 'exe':
				case 'execute':
				case 'x':
					var n = gm.getDay();
					if (!this.chats.jailor) {
						this.s.sendMessage(Type.SYSTEM, 'You need to be the Jailor to use this.');
					} else if (phase != Phase.NIGHT) {
						this.s.sendMessage(Type.SYSTEM, 'You can only use this at night.');
					} else if (n == 1) {
						this.s.sendMessage(Type.SYSTEM, "You can't execute your target Night 1!");
					} else {
						var modjailed = false;
						var found = false;
						var msg = this.executing ? 'The Jailor has changed his mind.' : 'The Jailor has decided to execute you.';
						var jmsg = this.executing ? 'You have changed your mind.' : 'You have decided to execute your prisoner.';
						for (i in players) {
							if (players[i].chats.jailed) {
								if (i == mod) {
									modjailed = true;
								} else {
									found = players[i].name;
									players[i].s.sendMessage(Type.SYSTEM, msg);
									socket.sendMessage(Type.SYSTEM, jmsg);
									players[mod].s.sendMessage(Type.SYSTEM, this.executing ? this.name + ' has changed their mind.' : this.name + ' has decided to execute ' + players[i].name + '.');
								}
							}
						}
						if (modjailed) {
							this.s.sendMessage(Type.SYSTEM, 'You cannot execute the mod.');
						} else if (found) {
							this.executing = !this.executing;
							if (this.executing) {
								gm.log(this.name, [found]);
							} else {
								gm.log(this.name, []);
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You do not have a prisoner to execute!');
						}
					}
					break;
				case 'me':
					if (this.silenced) {
						this.silencedError();
					} else if (phase == Phase.PREGAME) {
						if (c.length < 2) {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/me action'.");
						} else {
							var msg = c.slice();
							msg.splice(0, 1);
							msg = msg.join(' ');
							msg = sanitize(msg);
							sendPublicMessage(Type.ME, this.name, msg);
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'Sorry! This command is only available in Pregame.');
					}
					break;
				case 'hug':
					if (this.silenced) {
						this.silencedError();
					} else if (phase == Phase.PREGAME) {
						if (c.length == 2) {
							var str = sanitize(c[1]);
							if (isNaN(str)) {
								if (str.toLowerCase() == 'everyone') {
									var p = { name: str + '!' };
								} else {
									var p = getPlayerByName(str);
								}
							} else {
								var p = getPlayerByNumber(parseInt(str));
							}
							if (p && p != -1) {
								sendPublicMessage(Type.HUG, this.name, p.name);
								if (this.name == p.name) {
									sendPublicMessage(Type.SYSTEM, 'Is someone feeling lonely?');
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, 'Invalid selection: ' + str);
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /hug name.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'Sorry! Please keep your hugs to pregame.');
					}
					break;
				case 'role':
					if (c.length == 1) {
						//Return own role.
						if (this.role == 'NoRole') {
							this.s.sendMessage(Type.SYSTEM, 'You were not assigned a role, yet.');
						} else if (roles.hasRolecard(this.role)) {
							var results = {};
							var investGroup = gm.getRoleGroup(this.role.toLowerCase());
							if (investGroup) {
								results.investResult = gm.getInvestFlavor(investGroup) + ' They must be a ' + gm.grammarList(gm.getInvestGroupings(investGroup), 'or');
							}
							var sheriffAlignment = gm.getAlignment(this.role.toLowerCase());
							if (sheriffAlignment) {
								results.sheriffResult = gm.getSheriffResult(sheriffAlignment);
							}
							this.s.sendMessage(Type.ROLECARD, roles.getRoleCard(this.role, results));
						} else {
							this.s.sendMessage(Type.SYSTEM, 'Your role is ' + sanitize(this.role) + '.');
						}
					} else {
						c.splice(0, 1);
						var rolename = c.join(' ');
						if (roles.hasRolecard(rolename)) {
							var results = {};
							var investGroup = gm.getRoleGroup(rolename.toLowerCase());
							if (investGroup) {
								results.investResult = gm.getInvestFlavor(investGroup) + ' They must be a ' + gm.grammarList(gm.getInvestGroupings(investGroup), 'or');
							}
							var sheriffAlignment = gm.getAlignment(rolename.toLowerCase());
							if (sheriffAlignment) {
								results.sheriffResult = gm.getSheriffResult(sheriffAlignment);
							}
							this.s.sendMessage(Type.ROLECARD, roles.getRoleCard(rolename, results));
						} else {
							this.s.sendMessage(Type.SYSTEM, "'" + sanitize(rolename) + "' could not be found.");
						}
					}
					break;
				case 'confirm':
					if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'The mod cannot use this command.');
					} else if (phase == Phase.ROLES) {
						if (this.confirm) {
							socket.sendMessage(Type.SYSTEM, 'You have already confirmed.');
						} else {
							this.confirm = true;
							sendPublicMessage(Type.SYSTEM, this.name + ' has confirmed.');
							showConfirms();
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You can only use this command while the mod is giving out roles.');
					}
					break;
				case 'spectate':
					if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'The mod cannot use this command.');
					} else if (this.spectate === false) {
						if (phase == Phase.PREGAME) {
							this.spectate = true;
							sendPublicMessage(Type.SETSPEC, this.name);
							players[mod].s.sendMessage(Type.SYSTEM, this.name + ' is now spectating.');
							this.s.sendMessage(Type.SYSTEM, 'You are now spectating.');
							var p = getPlayerByName(this.name);
							p.setRole('Spectator');
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You can only become a spectator in pregame.');
						}
					} else if (this.spectate) {
						if (phase == Phase.PREGAME) {
							this.spectate = false;
							sendPublicMessage(Type.REMSPEC, this.name);
							players[mod].s.sendMessage(Type.SYSTEM, this.name + ' is no longer spectating.');
							this.s.sendMessage(Type.SYSTEM, 'You are no longer spectating.');
							var p = getPlayerByName(this.name);
							p.setRole('NoRole');
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You can only leave spectator in pregame.');
						}
					}
					break;
				case 'setspectate':
				case 'ss':
					if (this.dev || mod == this.s.id) {
						if (c.length < 2) {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/setspectate player' or '/ss player'.");
						} else if (playernames[c[1]]) {
							if (!players[playernames[c[1]]].spectate) {
								players[playernames[c[1]]].spectate = true;
								sendPublicMessage(Type.SETSPEC, players[playernames[c[1]]].name);
								this.s.sendMessage(Type.SYSTEM, c[1] + ' has been set to spectate.');
								players[playernames[c[1]]].s.sendMessage(Type.SYSTEM, 'You are now spectating.');
								if (!mod == this.s.id) {
									players[mod].s.sendMessage(Type.SYSTEM, c[1] + ' has been set to spectate by ' + this.name);
								}
								players[playernames[c[1]]].setRole('Spectator');
							} else {
								players[playernames[c[1]]].spectate = false;
								sendPublicMessage(Type.REMSPEC, players[playernames[c[1]]].name);
								this.s.sendMessage(Type.SYSTEM, c[1] + ' is no longer set to spectate.');
								players[playernames[c[1]]].s.sendMessage(Type.SYSTEM, 'You are no longer spectating.');
								if (!mod == this.s.id) {
									players[mod].s.sendMessage(Type.SYSTEM, c[1] + ' is no longer set to spectate by ' + this.name);
								}
								players[playernames[c[1]]].setRole('NoRole');
							}
						} else if (!isNaN(c[1])) {
							//It's a number.
							//Get the numbered player.
							var target = getPlayerByNumber(c[1]);
							var name = target.name;
							if (target != -1) {
								if (!target.spectate) {
									target.spectate = true;
									sendPublicMessage(Type.SETSPEC, target.name);
									this.s.sendMessage(Type.SYSTEM, name + ' has been set to spectate.');
									target.s.sendMessage(Type.SYSTEM, 'You are now spectating.');
									if (mod != this.s.id) {
										players[mod].s.sendMessage(Type.SYSTEM, name + ' has been set to spectate by ' + this.name);
									}
									target.setRole('Spectator');
								} else {
									target.spectate = false;
									sendPublicMessage(Type.REMSPEC, target.name);
									this.s.sendMessage(Type.SYSTEM, name + ' is no longer set to spectate.');
									target.s.sendMessage(Type.SYSTEM, 'You are no longer spectating.');
									if (mod != this.s.id) {
										players[mod].s.sendMessage(Type.SYSTEM, name + ' is no longer set to spectate by ' + this.name);
									}
									target.setRole('NoRole');
								}
							}
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'You do not have the correct permissions to use this command.');
					}
					break;
				case 'roles':
					{
						this.s.sendMessage(Type.SYSTEM, roles.getRolenames());
					}
					break;
				case 'ban':
					if (c.length > 2) {
						if (this.dev) {
							var first = sanitize(c[1]);
							var reason = sanitize(c.slice(2).join(' '));
							if (!isNaN(first[0])) {
								//Ip
								//Check if the ip is formatted correctly.
								if (/\d+\.\d+\.\d+\.\d+/.test(c[1])) {
									ban(c[1], reason, this.name);
									this.s.sendMessage(Type.SYSTEM, 'You banned the ip: ' + first + '. Reason: ' + reason);
								} else {
									this.s.sendMessage(Type.SYSTEM, 'The argument ' + first + ' was not recognized as an ip.');
								}
							} //name
							else {
								if (playernames[c[1]]) {
									var ip = getPlayerByName(c[1]).ip;
									kick(c[1], reason, this.name);
									ban(ip, reason, this.name);
								} else {
									this.s.sendMessage(Type.SYSTEM, "The name '" + first + "' could not be found.");
								}
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You do not have the correct permissions to use this command.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'The syntax of this command is /ban [name/ip] reason. A reason is mandatory.');
					}
					break;
				case 'kick':
					if (c.length >= 2) {
						if (this.dev) {
							var name = sanitize(c[1]);
							var reason = sanitize(c.slice(2).join(' '));
							var tokick = getPlayerByName(name);
							if (!isNaN(name)) {
								this.s.sendMessage(Type.SYSTEM, 'Please use the name of the player you wish to kick, not the number. This is to ensure no players are kicked accidentally.');
							} else if (tokick) {
								kick(name, reason, this.name);
							} else {
								this.s.sendMessage(Type.SYSTEM, "'" + name + "' is not a valid player.");
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You do not have the correct permissions to use this command.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/kick user reason'.");
					}
					break;
				case 'alert':
					if (c.length >= 2) {
						if (this.dev) {
							if (isNaN(c[1])) {
								//Name
								var player = getPlayerByName(c[1]);
								if (player) {
									player.s.sendMessage(Type.HEY);
									player.s.sendMessage(Type.SYSTEM, 'ALERT!');
									this.s.sendMessage(Type.SYSTEM, 'You sent an alert to ' + player.name + '.');
								} else {
									this.s.sendMessage(Type.SYSTEM, "Cannot find player '" + sanitize(c[1]) + "'");
								}
							} else if (parseInt(c[1]) >= 0 && parseInt(c[1]) < Object.keys(players).length) {
								//Number
								var player = getPlayerByNumber(parseInt(c[1]));
								player.s.sendMessage(Type.HEY);
								player.s.sendMessage(Type.SYSTEM, 'ALERT!');
								this.s.sendMessage(Type.SYSTEM, 'You sent an alert to ' + player.name + '.');
							} else {
								this.s.sendMessage(Type.SYSTEM, 'Cannot find user number ' + sanitize(c[1]) + '.');
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You do not have the correct permissions to use this command.');
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/alert user '.");
					}
					break;
				case 'ping':
					if (this.dev) {
						var ping = {};
						for (i in players) {
							ping[players[i].name] = players[i].ping;
						}
						this.s.sendMessage(Type.LATENCIES, ping);
					} else {
						this.s.sendMessage(Type.LATENCIES, this.ping);
					}
					break;
				case 'a':
					if (mod == this.s.id) {
						if (c.length > 1) {
							var msg = c.slice(1);
							msg = msg.join(' ');
							msg = sanitize(msg);
							sendPublicMessage(Type.HIGHLIGHT, msg, 'modchat');
						} else {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/a message'.");
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, "Only the mod can use this command.");
					}
					break;
				case 'd':
				case 'death':
					if (mod == this.s.id) {
						if (c.length > 1) {
							var msg = c.slice(1);
							msg = msg.join(' ').trim();
							switch(msg.toLowerCase()) {
								case 'suicide':
								case 'sui':
									sendPublicMessage(Type.HIGHLIGHT, "They apparently committed suicide.", 'suicide');
									break;
								case 'heart':
								case 'broken heart':
									sendPublicMessage(Type.HIGHLIGHT, "They died of a broken heart.", 'heart');
									break;
								case 'vigi':
								case 'vigilante':
									sendPublicMessage(Type.HIGHLIGHT, "They were shot by a Vigilante.", 'townkill');
									break;
								case 'guilt':
									sendPublicMessage(Type.HIGHLIGHT, "They died from guilt.", 'townkill');
									break;
								case 'vet':
								case 'veteran':
									sendPublicMessage(Type.HIGHLIGHT, "They were shot by the Veteran they visited.", 'townkill');
									break;
								case 'jailor':
								case 'jail':
									sendPublicMessage(Type.HIGHLIGHT, "They were executed by the Jailor.", 'townkill');
									break;
								case 'vh':
								case 'vampire hunter':
									sendPublicMessage(Type.HIGHLIGHT, "They were staked by a Vampire Hunter.", 'townkill');
									break;
								case 'guard':
									sendPublicMessage(Type.HIGHLIGHT, "They died guarding someone.", 'townkill');
									break;
								case 'bg':
								case 'bodyguard':
									sendPublicMessage(Type.HIGHLIGHT, "They were killed by a Bodyguard.", 'townkill');
									break;
								case 'crus':
								case 'crusader':
									sendPublicMessage(Type.HIGHLIGHT, "They were killed by a Crusader.", 'townkill');
									break;
								case 'trap':
								case 'trapper':
									sendPublicMessage(Type.HIGHLIGHT, "They were killed by a Trapper.", 'townkill');
									break;
								case 'gf':
								case 'godfather':
								case 'maf':
								case 'mafioso':
								case 'mafia':
									sendPublicMessage(Type.HIGHLIGHT, "They were killed by a member of the Mafia.", 'mafiakill');
									break;
								case 'amb':
								case 'ambusher':
									sendPublicMessage(Type.HIGHLIGHT, "They were killed by an Ambusher.", 'mafiakill');
									break;
								case 'cl':
								case 'coven leader':
									sendPublicMessage(Type.HIGHLIGHT, "They were drained by the Coven Leader.", 'covenkill');
									break;
								case 'dusa':
								case 'medusa':
									sendPublicMessage(Type.HIGHLIGHT, "They were turned to stone by Medusa.", 'covenkill');
									break;
								case 'pm':
								case 'pmer':
								case 'potion master':
									sendPublicMessage(Type.HIGHLIGHT, "They were killed by the Potion Master.", 'covenkill');
									break;
								case 'hm':
								case 'hmer':
								case 'hex master':
									sendPublicMessage(Type.HIGHLIGHT, "They were hexed by a Hex Master.", 'covenkill');
									break;
								case 'necro':
								case 'necromancer':
									sendPublicMessage(Type.HIGHLIGHT, "They were killed by the Necromancer's Ghoul.", 'covenkill');
									break;
								case 'poisoner':
									sendPublicMessage(Type.HIGHLIGHT, "They were poisoned by a Poisoner.", 'covenkill');
									break;
								case 'sk':
								case 'serial killer':
									sendPublicMessage(Type.HIGHLIGHT, "They were stabbed by a Serial Killer.", 'skkill');
									break;
								case 'ww':
								case 'werewolf':
									sendPublicMessage(Type.HIGHLIGHT, "They were mauled by a Werewolf.", 'wwkill');
									break;
								case 'arso':
								case 'arsonist':
									sendPublicMessage(Type.HIGHLIGHT, "They were incinerated by an Arsonist.", 'arsokill');
									break;
								case 'jugg':
								case 'juggernaut':
									sendPublicMessage(Type.HIGHLIGHT, "They were assaulted by a Juggernaut.", 'juggkill');
									break;
								case 'jest':
								case 'jester':
									sendPublicMessage(Type.HIGHLIGHT, "They died from guilt over lynching the Jester.", 'jestkill');
									break;
								case 'vamp':
								case 'vampire':
									sendPublicMessage(Type.HIGHLIGHT, "They were bitten by a Vampire.", 'vampkill');
									break;
								case 'pirate':
									sendPublicMessage(Type.HIGHLIGHT, "They were plundered by the Pirate.", 'piratekill');
									break;
								case 'pest':
								case 'pestilence':
									sendPublicMessage(Type.HIGHLIGHT, "They were obliterated by Pestilence, Horseman of the Apocalypse.", 'pestkill');
									break;
								default:
									sendPublicMessage(Type.HIGHLIGHT, "They were killed by a "+sanitize(msg)+".", 'modchat');
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/d role.");
							this.s.sendMessage(Type.SYSTEM, "Use a custom role or use one of the presets we have below:");
							this.s.sendMessage(Type.SYSTEM, "<span class=\"linked\">Town: Vigi, Guilt, Vet, Jailor, VH, BG, Guard, Crus, Trap</span>");
							this.s.sendMessage(Type.SYSTEM, "<span class=\"mafia\">Mafia: GF, Maf, Amb</span>");
							this.s.sendMessage(Type.SYSTEM, "<span class=\"coven\">Coven: CL, Dusa, Necro, PM, HM, Poisoner</span>");
							this.s.sendMessage(Type.SYSTEM, "<span class=\"jailed\">Other: SK, WW, Arso, Jugg, Jest, Vamp, Pirate, Pest, Suicide, Heart</span>");
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, "Only the mod can use this command.");
					}
					break;
				case 'msg':
					if (mod == this.s.id) {
						if (c.length > 2) {
							if (playernames[c[1]]) {
								//Valid player name.
								var msg = c.slice();
								msg.splice(0, 2);
								msg = msg.join(' ');
								msg = sanitize(msg);
								players[playernames[c[1]]].s.sendMessage(Type.MOD, { from: 'Mod', msg: msg });
								this.s.sendMessage(Type.MOD, { to: c[1], msg: msg });
							} else if (!isNaN(c[1])) {
								//It's a number.
								//Get the numbered player.
								var target = getPlayerByNumber(c[1]);
								if (target != -1) {
									var name = target.name;
									var msg = c.slice();
									msg.splice(0, 2);
									msg = msg.join(' ');
									msg = sanitize(msg);
									target.s.sendMessage(Type.MOD, { from: 'Mod', msg: msg });
									this.s.sendMessage(Type.MOD, { to: name, msg: msg });
								} else {
									this.s.sendMessage(Type.SYSTEM, 'Could not find player number ' + c[1] + '!');
								}
							} else {
								this.s.sendMessage(Type.SYSTEM, "'" + sanitize(c[1]) + "' is not a valid player.");
							}
						} else {
							this.s.sendMessage(Type.SYSTEM, "The syntax of this command is '/msg name message'.");
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, "Only the mod can use this command. If you are trying to whisper, try '/w name message'");
					}
					break;
				case 'sys':
				case 'system':
					if (mod == this.s.id) {
						if (c.length > 2) {
							if (playernames[c[1]]) {
								//Valid player name.
								var msg = c.slice();
								msg.splice(0, 2);
								msg = msg.join(' ');
								msg = sanitize(msg);
								players[playernames[c[1]]].s.sendMessage(Type.SYSTEM, msg);
								this.s.sendMessage(Type.SYSSENT, c[1], msg);
							} else if (!isNaN(c[1])) {
								//It's a number.
								//Get the numbered player.
								var target = getPlayerByNumber(c[1]);
								if (target != -1) {
									var name = target.name;
									var msg = c.slice();
									msg.splice(0, 2);
									msg = msg.join(' ');
									msg = sanitize(msg);
									target.s.sendMessage(Type.SYSTEM, msg);
									this.s.sendMessage(Type.SYSSENT, c[1], msg);
								} else {
									this.s.sendMessage(Type.SYSTEM, 'Could not find player number ' + sanitize(c[1]) + '!');
								}
							} else {
								socket.sendMessage(Type.SYSTEM, "'" + sanitize(c[1]) + "' is not a valid player.");
							}
						} else {
							socket.sendMessage(Type.SYSTEM, "The syntax of this command is '/system name message'.");
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, "Only the mod can use this command. If you are trying to whisper, try '/w name message'");
					}
					break;
				case 'afk':
					if (phase == Phase.PREGAME) {
						if (this.afk === undefined) {
							if (!this.silenced) {
								sendPublicMessage(Type.SYSTEM, this.name + ' has decided to go afk.');
							}
							this.afk = true;
							//SetRole(this.name, 'afk')
							var p = getPlayerByName(this.name);
							p.setRole('afk');
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You are already AFK. Use /back.');
						}
					}
					break;
				case 'back':
					if (phase == Phase.PREGAME) {
						if (this.afk) {
							if (!this.silenced) {
								sendPublicMessage(Type.SYSTEM, 'Welcome back, ' + this.name + '!');
							}
							this.afk = undefined;
							//SetRole(this.name, '')
							var p = getPlayerByName(this.name);
							p.setRole('NoRole');
						} else {
							this.s.sendMessage(Type.SYSTEM, 'You are not AFK. Use /afk.');
						}
					}
					break;
				case 'rolelist':
				case 'rl':
					var sendArr = [];
					if (createdList && createdList.length != 0) {
						for (i in createdList) {
							sendArr[i] = sanitize(createdList[i]);
							sendArr[i] = roles.formatAlignment(createdList[i]);
						}
						this.s.sendMessage(Type.SHOWLIST, sendArr);
					} else {
						this.s.sendMessage(Type.SYSTEM, 'There is currently no rolelist saved.');
					}
					break;
				default:
					this.s.sendMessage(Type.SYSTEM, 'Command /' + com + ' not recognized.');
					break;
			}
		},
		whisper: function (msg, to) {
			var isspec = false;
			for (i in players) {
				if (players[i].spectate && players[i].name == name) {
					isspec = true;
				}
			}
			if (isspec) {
				this.s.sendMessage(Type.SYSTEM, 'You cannot whisper a Spectator.');
			} else if (to.s.id == mod) {
				this.s.sendMessage(Type.SYSTEM, 'Please do not whisper to the mod. Use the /mod commmand instead.');
			} else if (this.s.id == mod) {
				this.s.sendMessage(Type.SYSTEM, 'Please do not whisper to players as the mod. Use the /msg commmand instead.');
			} else if (this == to) {
				this.s.sendMessage(Type.SYSTEM, 'You cannot whisper to yourself.');
			} else if (!to.alive && phase != Phase.PREGAME) {
				this.s.sendMessage(Type.SYSTEM, 'You cannot whisper to the dead.');
			} else {
				to.s.sendMessage(Type.WHISPER, { from: this.name, msg: msg });
				this.s.sendMessage(Type.WHISPER, { to: to.name, msg: msg });
				if (phase != Phase.PREGAME) {
					players[mod].s.sendMessage(Type.WHISPER, { from: this.name, to: to.name, msg: msg });
					for (i in players) {
						if (players[i].spectate) {
							players[i].s.sendMessage(Type.WHISPER, { from: this.name, to: to.name, msg: msg });
						}
					}
				}
				for (i in players) {
					if (players[i].hearwhispers && phase != Phase.PREGAME) {
						players[i].s.sendMessage(Type.WHISPER, { from: this.name, to: to.name, msg: msg });
					}
				}
				//Public whispering message
				if (phase != Phase.PREGAME) {
					//Ingame whisper, not a pregame whisper.
					sendPublicMessage(Type.WHISPER, { from: this.name, to: to.name });
				}
			}
		},
		target: function (targets) {
			//Show who the player is targetting to the other mafia, if they are mafia.
			if (this.chats.mafia) {
				for (i in players) {
					if (players[i].chats.mafia || players[i].s.id == mod || players[i].spectate) {
						players[i].s.sendMessage(Type.TARGET, this.name, this.role, gm.grammarList(targets));
					}
				}
			} else if (this.chats.coven) {
				for (i in players) {
					if (players[i].chats.coven || players[i].s.id == mod || players[i].spectate) {
						players[i].s.sendMessage(Type.TARGET, this.name, this.role, gm.grammarList(targets));
					}
				}
			} else if (this.chats.vamp) {
				for (i in players) {
					if (players[i].chats.vamp || players[i].s.id == mod || players[i].spectate) {
						players[i].s.sendMessage(Type.TARGET, this.name, this.role, gm.grammarList(targets));
					}
				}
			} else {
				players[mod].s.sendMessage(Type.TARGET, this.name, this.role, gm.grammarList(targets));
				for (i in players) {
					if (players[i].spectate) {
						players[i].s.sendMessage(Type.TARGET, this.name, this.role, gm.grammarList(targets));
					}
				}
				this.s.sendMessage(Type.TARGET, 'You', undefined, gm.grammarList(targets));
			}
			//Log the night action for review at the end of the night.
			gm.log(this.name, targets);
		},
		silencedError: function () {
			var details = [this.silenced];
			if (this.silenced.indexOf('/') != -1) {
				details = this.silenced.split('/');
			}
			var msg = 'You have been silenced by ' + sanitize(details[0]) + '.';
			if (details[1]) {
				msg += ' Reason: ' + sanitize(details[1]);
			}
			this.s.sendMessage(Type.SYSTEM, msg);
		},
		message: function (msg) {
			msg = sanitize(msg);
			switch (phase) {
				case Phase.PREGAME:
					if (this.silenced) {
						this.silencedError();
					} else {
						sendPublicMessage(Type.MSG, this.name, msg);
					}
					break;
				case Phase.ROLES:
					if (this.silenced) {
						this.silencedError();
					} else if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'Use /a if you want to send a public message as mod');
					} else if (this.spectate) {
						this.specMessage(msg, { spectate: true });
					} else {
						this.s.sendMessage(Type.SYSTEM, 'Please do not talk while the mod is assigning roles. If you need to message the host, use /mod message');
					}
					break;
				case Phase.DAY:
				case Phase.VOTING:
				case Phase.VERDICTS:
				case Phase.FIRSTDAY:
					if (this.silenced) {
						this.silencedError();
					} else if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'Use /a if you want to send a public message as mod');
					} else if (this.spectate) {
						this.specMessage(msg, { spectate: true });
					} else if (this.alive) {
						if (this.blackmailed) {
							this.s.sendMessage(Type.SYSTEM, 'You are blackmailed.');
						} else {
							sendPublicMessage(Type.MSG, this.name, msg);
						}
					} //Deadchat
					else {
						this.specMessage(msg, { dead: true });
					}
					break;
				case Phase.TRIAL:
					if (this.silenced) {
						this.silencedError();
					} else if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'Use /a if you want to send a public message as mod');
					} else if (this.spectate) {
						this.specMessage(msg, { spectate: true });
					} else if (this.alive) {
						if (ontrial == this.s.id) {
							if (this.blackmailed) {
								sendPublicMessage(Type.MSG, this.name, 'I am blackmailed.');
							} else {
								sendPublicMessage(Type.MSG, this.name, msg);
							}
						} else {
							socket.sendMessage(Type.SYSTEM, 'Please do not speak while someone is on trial.');
						}
					} else {
						this.specMessage(msg, { dead: true });
					}
					break;
				case Phase.NIGHT:
					if (this.silenced) {
						this.silencedError();
					} else if (this.alive && !this.spectate) {
						if (mod == this.s.id) {
							this.s.sendMessage(Type.SYSTEM, 'Use /a if you want to send a public message as mod');
						} else if (this.chats.jailed) {
							this.specMessage(msg, { jailor: true, jailed: true }, null, 'jailed');
						} else if (this.chats.mafia || this.chats.coven || this.chats.vamp || this.chats.linked || this.chats.jailor || this.chats.medium) {
							var sendTo = {};
							if(this.chats.mafia) sendTo.mafia = true;
							if(this.chats.coven) sendTo.coven = true;
							if(this.chats.vamp) sendTo.vamp = true;
							if(Object.keys(sendTo).length) {
								this.specMessage(msg, sendTo);
							}

							if (this.chats.jailor) {
								this.specMessage(msg, { jailor: true, jailed: true }, 'Jailor', 'jailor');
							}
							if (this.chats.medium) {
								this.specMessage(msg, { dead: true }, 'Medium', 'medium');
								//Echo the message back to the medium.
								this.s.sendMessage(Type.MSG, 'Medium', { msg: msg, styling: 'medium' });
							}
						}
						if (this.chats.linked) {
							this.specMessage(msg, { linked: true });
						}
						if (this.beingSeanced) {
							this.beingSeanced.s.sendMessage(Type.MSG, this.name, msg);
							//Echo the message back to the medium.
							this.s.sendMessage(Type.MSG, this.name, msg);
							players[mod].s.sendMessage(Type.MSG, this.name, msg);
							for (i in players) {
								if (players[i].spectate) {
									players[i].s.sendMessage(Type.MSG, this.name, msg);
								}
							}
						}
					} else if (this.spectate) {
						this.specMessage(msg, { spectate: true });
					} //Deadchat
					else {
						if (this.seancing) {
							this.seancing.s.sendMessage(Type.MSG, 'Medium', { msg: msg, styling: 'dead' });
							//Echo the message back to the medium.
							this.s.sendMessage(Type.MSG, 'Medium', { msg: msg, styling: 'dead' });
							players[mod].s.sendMessage(Type.MSG, 'Medium(' + this.name + ')', { msg: msg, styling: 'dead' });
							for (i in players) {
								if (players[i].spectate) {
									players[i].s.sendMessage(Type.MSG, 'Medium(' + this.name + ')', { msg: msg, styling: 'dead' });
								}
							}
						} else {
							this.specMessage(msg, { dead: true, medium: true }, null, 'dead');
						}
					}
					break;
				case Phase.MODTIME:
					if (this.silenced) {
						this.silencedError();
					} else if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'Use /a if you want to send a public message as mod');
					} else if (this.spectate) {
						this.specMessage(msg, { spectate: true });
					} else {
						this.s.sendMessage(Type.SYSTEM, 'Please do not talk during mod time. If you need to message the host, use /mod message');
					}
					break;
				case Phase.LASTWORDS:
					if (this.silenced) {
						this.silencedError();
					} else if (mod == this.s.id) {
						this.s.sendMessage(Type.SYSTEM, 'Use /a if you want to send a public message as mod');
					} else if (this.spectate) {
						this.specMessage(msg, { spectate: true });
					} else if (!this.alive) {
						this.specMessage(msg, { dead: true });
					} else if (ontrial == this.s.id) {
						if (this.blackmailed) {
							this.s.sendMessage(Type.SYSTEM, 'You are blackmailed.');
						} else {
							sendPublicMessage(Type.MSG, this.name, msg);
						}
					} else {
						this.s.sendMessage(Type.SYSTEM, 'Please do not talk during ' + players[ontrial].name + "'s last words.");
					}
					break;
			}
		},
		specMessage: function (
			msg,
			types,
			specname, //Display a message only to players able to see certain chats.
			primary	// Color the message as being from this chat even for people who can't see that chat
		) {
			for (i in players) {
				if (i == mod || players[i].spectate) {
					//Mod can view all chats.
					players[i].s.sendMessage(Type.MSG, specname ? specname + '(' + this.name + ')' : this.name, { styling: primary || Object.keys(types)[0], msg: msg });
				} else {
					for (j in types) {
						if (players[i].chats[j] == types[j]) {
							//Use the special name if one is provided.
							players[i].s.sendMessage(Type.MSG, specname ? specname : this.name, { styling: primary || j, msg: msg });
							break;
						}
					}
				}
			}
		},
	};
}
function clone(obj) {
	if (null == obj || 'object' != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	}
	return copy;
}
function kick(name, reason, kicker) {
	var tokick = getPlayerByName(name);
	tokick.s.sendMessage(Type.SYSTEM, 'You have been kicked from the game!');
	if (reason) {
		sendPublicMessage(Type.HIGHLIGHT, tokick.name + ' has been kicked by ' + kicker + '! Reason: ' + reason);
	} else {
		sendPublicMessage(Type.HIGHLIGHT, tokick.name + ' has been kicked by ' + kicker + '!');
	}
	tokick.s.sendMessage(Type.KICK);
	tokick.s.close();
}
function ban(ip, reason, banner) {
	banlist.push({
		ip: ip,
		reason: reason,
	});
	sendPublicMessage(Type.HIGHLIGHT, banner + ' banned an IP address. Reason: ' + reason);
}
