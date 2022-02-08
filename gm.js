var loggedActions = {};
var suggestedMessages = [];
var suggestedActions = [];
var dousedlist = [];
var daynumber = 1;

Object.defineProperty(Array.prototype, 'random_pick', {
	value: function(count) {
		if(typeof count === 'undefined') {
			return this[Math.floor(Math.random()*this.length)];
		} else {
			var source = this.slice();
			var result = [];
			for(var i = 0; i < count; i++) {
				const random = Math.floor(Math.random()*source.length);
				result = result.concat(source.splice(random, 1));
			}
			return result;
		}
	}
});
Object.defineProperty(Array.prototype, 'shuffle', {
	value: function() {
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this[i], this[j]] = [this[j], this[i]];
		}
		return this;
	}
});

var autoRoles = {
	'sheriff': {
		targeting: ['living other'],
		grouping: 'E',
	},
	'investigator': {
		targeting: ['living other'],
		grouping: 'J',
	},
	'lookout': {
		targeting: ['living other'],
		grouping: 'G',
	},
	'tracker': {
		targeting: ['living other'],
		grouping: 'J',
	},
	'spy': {
		targeting: ['living other'],
		grouping: 'D',
	},
	'psychic': {
		targeting: [],
		interpret_targeting: function(targets) {
			return {
				type: 'default',
				targets: [],
			};
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'night',
				role: 'psychic',
				type: 'default',
				priority: 4,
			}, function(targets) {
				var is_good = (p)=>(p.alignment.split(' ')[0] == town || p.alignment == 'neutral benign');
				var living_others = gm.players.filter(p=>p.alive && p !== this);
				if(gm.day % 2) {
					//Odd night: evil vision
					var evil = living_others.filter(p=>!is_good(p)).random_pick();
					var picks = [evil, ...living_others.filter(p=>p !== evil).random_pick(2)].shuffle();
					if(picks.length < 3) {
						gm.notify(this, 'The town is too small to accurately find an evildoer!');
					} else {
						var pick_names = picks.map(p=>p.name);
						gm.notify(this, 'At least one of '+picks[0]+', '+picks[1]+', or '+picks[2]+' is evil!');
					}
				} else {
					//Even night: good vision
					var good = living_others.filter(p=>is_good(p)).random_pick();
					var picks = [good, ...living_others.filter(p=>p !== good).random_pick(1)].shuffle();
					if(picks.length < 3) {
						gm.notify(this, 'The town is too evil to find anyone good!');
					} else {
						var pick_names = picks.map(p=>p.name);
						gm.notify(this, 'At least one of '+picks[0]+' or '+picks[1]+' is good!');
					}
				}
			});
		},
		grouping: 'C',
	},
	'escort': {
		targeting: ['living other'],
		interpret_targeting: function(targets) {
			if(targets.length === 1) {
				this.schedule_action('default', targets);
			}
			this.roleblock_immunity = true;
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'night',
				role: 'escort',
				type: 'default',
				priority: 3,
			}, function(targets) {
				gm.roleblock(targets[0]);
			});
		},
		grouping: 'H',
	},
	'mayor': {
		targeting: [],
		day_targeting: ['self'],
		features: {
			mayor: true,
		},
		setup: function(gm) {
			gm.on('target', {
				phase: 'day',
				role: 'mayor',
			}, function(e) {
				e.player.command('reveal');
			});
		},
		grouping: 'J',
	},
	'medium': {
		targeting: [],
		day_dead_targeting: ['living'],
		interpret_targeting: function(targets) {
			if(targets.length === 1) {
				this.schedule_action('seance', targets);
			}
		},
		features: {
			canSeance: true,
			charges: 1,
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'day',
				role: 'medium',
				type: 'seance',
			}, function(targets) {
				var [a] = targets;
				this.seancing = a;
			});
		},
		grouping: 'B',
	},
	'transporter': {
		targeting: ['living', 'living'],
		interpret_targeting: function({ targets }) {
			this.control_immunity = true;
			this.roleblock_immunity = true;
			if(targets.length === 2) {
				return { type: 'default', targets };
			} else {
				return { type: 'none', targets: [] };
			}
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'night',
				role: 'transporter',
				type: 'default',
				priority: 1,
			}, function(targets) {
				var [a, b] = targets;
				gm.notify(a, "You were transported to another location!");
				gm.notify(b, "You were transported to another location!");
				gm.pending_actions.map(function(action) {
					action.targets = action.targets.map(function(target) {
						if(target === a) return b;
						if(target === b) return a;
						return target;
					});
				});
			});
		},
		grouping: 'H',
	},
	'retributionist': {
		targeting: ['dead town', 'living'],
		interpret_targeting: function(targets) {
			this.control_immunity = true;
			this.roleblock_immunity = true;
			if(targets.length == 2) {
				var [target, ...control_to] = targets;
				return { type: 'default', targets: [target], control_to };
			} else {
				return { type: 'none', targets: [] };
			}
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'night',
				role: 'retributionist',
				type: 'default',
				priority: 0,
			}, function(targets) {
				if(!this.action.control_to) return;
				gm.control(targets[0], {
					type: 'default',
					targets: this.action.control_to,
					notification_steal: this,
				});
			});
		},
		grouping: 'B',
	},
	'doctor': {
		targeting: ()=>(this.charges ? ['living'] : ['living other']),
		interpret_targeting: function(targets) {
			if(targets[1] === this) {
				return { type: 'selfheal', targets: [] };
			} else if(targets.length == 1) {
				return { type: 'default', targets };
			} else {
				return { type: 'none', targets: [] };
			}
		},
		features: {
			charges: 1,
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'night',
				role: 'doctor',
				type: 'selfheal',
				priority: 4,
			}, function() {
				if(this.charges > 0) {
					this.charges--;
					this.on('attacked', function(attack) {
						if(!attack.blocked) {
							attack.defense = 2;
							attack.saved_message = 'You were attacked, but someone nursed you back to health!';
							gm.notify(this, 'Your target was attacked last night!');
						}
					});
				}
			});
			gm.addActionHandler({
				phase: 'night',
				role: 'doctor',
				type: 'default',
				priority: 4,
			}, function([target]) {
				target.on('attacked', function(attack) {
					if(attack.power <= 2) {
						attack.defense = 2;
						attack.saved_message = 'You were attacked, but someone nursed you back to health!';
						gm.notify(this, 'Your target was attacked last night!');
					}
				});
			});
		},
		grouping: 'I',
	},
	'bodyguard': {
		targeting: ()=>(this.charges ? ['living'] : ['living other']),
		interpret_targeting: function(targets, self) {
			if(targets[1] === self) {
				this.schedule_action('selfheal', []);
			} else if(targets.length == 1) {
				this.schedule_action('default', targets);
			}
		},
		features: {
			charges: 1,
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'night',
				role: 'bodyguard',
				type: 'selfheal',
				priority: 4,
			}, function(targets) {
				if(this.charges > 0) {
					this.charges--;
					this.protective_vest();
				}
			});
			gm.addActionHandler({
				phase: 'night',
				role: 'bodyguard',
				type: 'default',
				priority: 4,
			}, function([target]) {
				var already_protected = false;
				target.on('attacked', function(attack) {
					if(attack.visit == 'direct' && !attack.blocked && !already_protected) {
						attack.blocked = true;
						attack.blocked_message = 'You were attacked, but someone protected you!';
						gm.attack({
							target: attack.source,
							source: this,
							visit: 'indirect',
							power: 2,
						});
						gm.attack({
							target: this,
							source: this,
							visit: 'indirect',
							power: 2,
							killed_by: 'guarding',
						});
						already_protected = true;
					}
				});
			});
		},
		grouping: 'K',
	},
	'crusader': {
		targeting: ['living other'],
		interpret_targeting: function(targets) {
			if(targets.length == 1) {
				return { type: 'default', targets };
			} else {
				return { type: 'none', targets: [] };
			}
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'night',
				role: 'crusader',
				type: 'default',
				priority: 4,
			}, function([target]) {
				target.on('attacked', function(attack) {
					if(attack.power <= 2) {
						attack.defense = 2;
						attack.saved_message = 'You were attacked, but someone protected you!';
						gm.notify(this, 'Your target was attacked last night!');
					}
				});
			});
			gm.addActionHandler({
				phase: 'night',
				role: 'crusader',
				type: 'default',
				priority: 5,
			}, function([target]) {
				var visitors = gm.spotVisitors(target);
				var victim = visitors.filter(p=>!p.chats.vamp).random_pick();
				if(victim) {
					gm.attack({
						target: victim,
						source: this,
						visit: 'indirect',
						power: 1,
					});
					gm.notify(this, 'You attacked someone!');
				}
			});
		},
		grouping: 'K',
	},
	'trapper': {
		targeting: ()=>(this.charges ? ['living other'] : this.trapPlaced ? ['living self'] : []),
		interpret_targeting: function(targets) {
			if(!this.charges && !this.trapPlaced) {
				return { type: 'default', targets: [] };
			} else if(this.trapPlaced && targets[0] === this) {
				return { type: 'remove_trap', targets: [] };
			} else if(this.charges && targets.length) {
				return { type: 'default', targets };
			} else {
				return { type: 'none', targets: [] };
			}
		},
		features: {
			charges: 0,
			trapPlaced: undefined,
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'night',
				role: 'trapper',
				type: 'default',
				priority: 3.8,
			}, function([target]) {
				if(!this.charges && !this.trapPlaced) {
					this.charges = 1;
				} else if(this.charges && target) {
					this.trapPlaced = target;
					this.charges = 0;
				}
			});
			gm.addActionHandler({
				phase: 'night',
				role: 'trapper',
				type: 'remove_trap',
				priority: 3.8,
			}, function([target]) {
				this.charges = 1;
				this.trapPlaced = undefined;
			});
			gm.addActionHandler({
				phase: 'night',
				role: 'trapper',
				priority: 3.9,
			}, function([target]) {
				if(!this.trapPlaced) return;

				var trapper = this;
				var already_protected = false;
				this.trapPlaced.on('attacked', function(attack) {
					if(attack.visit != 'indirect' && !attack.blocked && !already_protected) {
						gm.notify(trapper, 'Your trap attacked someone!');
						gm.notify(attack.source, 'You triggered a trap!');
						attack.blocked = true;
						attack.blocked_message = 'You were attacked, but a trap saved you!';
						already_protected = true;
						if(attack.visit == 'direct') {
							gm.attack({
								target: attack.source,
								source: trapper,
								visit: 'indirect',
								power: 2,
							});
						}
						trapper.trapPlaced = undefined;
					}
				});

				var visitors = gm.spotVisitors(target);
				if(visitors.length) {
					var roles = visitors.map(p=>'a '+p.role);
					var rolesmsg = (roles.length > 1 ? roles.slice(0, -1).join(', ')+', and ' : '')+roles.slice(-1).join('');
					gm.notify(this, 'Your trap was triggered by '+rolesmsg+'.');
					this.trapPlaced = undefined;
				}
			});
		},
		grouping: 'B',
	},
	'jailor': {
		day_targeting: ['living other'],
		targeting: ['jailed notfirst'],
		interpret_targeting: function(targets) {
			if(targets.length) {
				return { type: 'default', targets };
			} else {
				return { type: 'none', targets };
			}
		},
		setup: function(gm) {
			gm.addActionHandler({
				phase: 'day',
				role: 'jailor',
				type: 'default',
				priority: 0,
			}, function({ target }) {
				target.chats.jailed = true;
			});
			gm.addActionHandler({
				phase: 'night',
				role: 'jailor',
				priority: 5,
			}, function({ target }) {
				if(target.chats.jailed) {
					
				}
			});
			gm.addActionHandler({
				phase: 'night',
				role: 'jailor',
				priority: 6,
			}, function({ target }) {
				gm.players.map(p=>p.chats.jailed = false);
			});
		},
		grouping: 'D',
	},
	'vampire hunter': {
		targeting: ['living other'],
		grouping: 'C',
	},
	'veteran': {
		targeting: ['self'],
		grouping: 'A',
	},
	'vigilante': {
		targeting: ['living other notfirst'],
		grouping: 'A',
	},
	'godfather': {
		targeting: ['living nonmafia'],
		grouping: 'K',
	},
	'mafioso': {
		targeting: ['living nonmafia'],
		grouping: 'A',
	},
	'ambusher': {
		targeting: ['living nonmafia'],
		grouping: 'A',
	},
	'blackmailer': {
		targeting: ['living nonmafia'],
	},
	'consigliere': {
		targeting: ['living nonmafia'],
		grouping: 'J',
	},
	'consort': {
		targeting: ['living nonmafia'],
		grouping: 'H',
	},
	'disguiser': {
		targeting: ['living mafia', 'living nonmafia'],
		grouping: 'I',
	},
	'framer': {
		targeting: ['living nonmafia'],
		grouping: 'F',
	},
	'janitor': {
		targeting: ['living nonmafia'],
		grouping: 'B',
	},
	'forger': {
		targeting: ['living nonmafia'],
		grouping: 'G',
	},
	'hypnotist': {
		targeting: ['living nonmafia'],
		grouping: 'H',
	},
	'coven leader': {
		targeting: ['living noncoven', 'living'],
		grouping: 'G',
	},
	'hex master': {
		targeting: ['living noncoven'],
		grouping: 'F',
	},
	'medusa': {
		targeting: ['self'],
		necronomicon_targeting: ['living'],
		grouping: 'C',
	},
	'necromancer': {
		targeting: ['dead', 'living'],
		necronomicon_targeting: ['self', 'living'],
		grouping: 'B',
	},
	'poisoner': {
		targeting: ['living noncoven'],
		grouping: 'E',
	},
	'potion master': {
		targeting: ['living'],
		grouping: 'I',
	},
	'survivor': {
		targeting: ['self'],
		grouping: 'C',
	},
	'amnesiac': {
		targeting: ['dead'],
		grouping: 'C',
	},
	'guardian angel': {
		targeting: ['target'],
		grouping: 'D',
	},
	'executioner': {
		targeting: [],
		grouping: 'E',
	},
	'jester': {
		targeting: [],
		dead_targeting: ['living'],
		grouping: 'F',
	},
	'witch': {
		targeting: ['living other', 'living'],
		grouping: 'G',
	},
	'serial killer': {
		targeting: ['living other'],
		grouping: 'I',
	},
	'arsonist': {
		targeting: ['living'],
		grouping: 'K',
	},
	'werewolf': {
		targeting: ['living other notfirst'],
		grouping: 'E',
	},
	'juggernaut': {
		targeting: ['living other notfirst'],
		grouping: 'G',
	},
	'pirate': {
		day_targeting: ['living other'],
		targeting: [],
		grouping: 'A',
	},
	'plaguebearer': {
		targeting: ['living other'],
		grouping: 'J',
	},
	'pestilence': {
		targeting: ['living other'],
		grouping: 'J',
	},
	'vampire': {
		targeting: ['living nonvampire'],
		grouping: 'F',
	},
	'coroner': {
		targeting: ['dead'],
	},
	'occultist': {
		targeting: ['living other'],
	},
	'gossip': {
		targeting: [],
	},
	'historian': {
		targeting: ['living other'],
	},
	'judge': {
		targeting: [],
	},
	'gatekeeper': {
		targeting: ['self'],
	},
	'seeker': {
		targeting: [],
	},
	'rain dancer': {
		targeting: ['self'],
	},
	'incarcerator': {
		targeting: ['living other'],
	},
	'bouncer': {
		targeting: ['living other'],
	},
	'blacksmith': {
		targeting: ['living other', 'living other'],
	},
	'duelist': {
		targeting: ['living other'],
	},
	'fisherman': {
		targeting: ['living other'],
	},
	'framer rework': {
		targeting: ['living nonmafia', 'living'],
	},
	'caporegime': {
		targeting: ['living nonmafia'],
	},
	'chauffeur': {
		targeting: ['living other'],
	},
	'technician': {
		targeting: ['living nonmafia'],
	},
	'consigliere buff': {
		targeting: ['living nonmafia'],
	},
	'agent': {
		targeting: ['living nonmafia'],
	},
	'associate': {
		targeting: ['living mafia'],
	},
	'framer rework': {
		targeting: ['living nonmafia', 'living'],
		grouping: 'F',
	},
	'hitman': {
		targeting: ['living nonmafia'],
	},
	'musician': {
		targeting: ['living'],
		grouping: 'E',
	},
	'malpractitioner': {
		targeting: ['living nonmafia'],
	},
	'scout': {
		targeting: ['living mafia'],
	},
	'recon': {
		targeting: ['living other'],
	},
	'lapidarist': {
		targeting: ['living noncoven'],
	},
	'spellslinger': {
		targeting: ['living noncoven'],
	},
	'ritualist': {
		targeting: ['living noncoven', 'living noncoven'],
	},
	'mystic': {
		targeting: ['living noncoven notfirst'],
	},
	'servant': {
		targeting: [],
	},
	'harmony\'s angel': {
		targeting: ['living other'],
		dead_targeting: ['living'],
	},
	'rolestopper': {
		targeting: ['living other'],
	},
	'copycat': {
		targeting: ['living other'],
	},
	'fairy': {
		targeting: ['living other', 'living'],
	},
	'butcher': {
		targeting: ['living other', 'living other'],
	},
	'electrician': {
		targeting: ['living other'],
	},
	'naiad': {
		targeting: ['living other'],
	},
	'slaughterer': {
		day_targeting: ['self'],
		targeting: ['living other'],
	},
	'patient': {
		targeting: ['living other'],
	},
	'mortician': {
		targeting: ['living other', 'living other'],
	},
	'death': {
		targeting: ['living other'],
	},
	'conqueror': {
		targeting: ['living other', 'living other'],
	},
	'huntsman': {
		day_targeting: ['living other'],
		targeting: ['living other'],
	},
	'paradoxist': {
		targeting: ['living other'],
	},
	'adze': {
		targeting: ['living nonvampire'],
	},
	'bebarlang': {
		targeting: ['living nonvampire'],
	},
	'lampir': {
		targeting: ['living nonvampire'],
	},
	'catacano': {
		targeting: ['living nonvampire'],
	},
	'progeny': {
		targeting: [],
	},
	'pijavica': {
		targeting: ['living nonvampire'],
	},
	'nelapsi': {
		targeting: ['living nonvampire', 'living nonvampire'],
	},
	'broxa': {
		targeting: ['living nonvampire'],
	},
	'gierach': {
		targeting: ['living nonvampire'],
	},
	'talamaur': {
		targeting: ['dead', 'living vampire'],
	},
	'citizen': {
		targeting: [],
	},
};

var investGrouping = {
	'A':'Your target could be a Vigilante, Veteran, Mafioso, Pirate, or Ambusher.',
	'B':'Your target could be a Medium, Janitor, Retributionist, Necromancer, or Trapper.',
	'C':'Your target could be a Survivor, Vampire Hunter, Amnesiac, Medusa, or Psychic.',
	'D':'Your target could be a Spy, Blackmailer, Jailor, or Guardian Angel.',
	'E':'Your target could be a Sheriff, Executioner, Werewolf, or Poisoner.',
	'F':'Your target could be a Framer, Vampire, Jester, or Hex Master.',
	'G':'Your target could be a Lookout, Forger, Juggernaut, or Coven Leader.',
	'H':'Your target could be an Escort, Transporter, Consort, or Hypnotist.',
	'I':'Your target could be a Doctor, Disguiser, Serial Killer, or Potion Master.',
	'J':'Your target could be an Investigator, Consigliere, Mayor, Tracker, or Plaguebearer.',
	'K':'Your target could be a Bodyguard, Godfather, Arsonist, or Crusader.',
};
//A - Vigilante, Veteran, Mafioso, Pirate, or Ambusher.
//B - Medium, Janitor, Retributionist, Necromancer, or Trapper.
//C - Survivor, Vampire Hunter, Amnesiac, Medusa, or Psychic.
//D - Spy, Blackmailer, Jailor, or Guardian Angel.
//E - Sheriff, Executioner, Werewolf, or Poisoner.
//F - Framer, Vampire, Jester, or Hex Master.
//G - Lookout, Forger, Juggernaut, or Coven Leader.
//H - Escort, Transporter, Consort, or Hypnotist.
//I - Doctor, Disguiser, Serial Killer, or Potion Master.
//J - Investigator, Consigliere, Mayor, Tracker, or Plaguebearer.
//K - Bodyguard, Godfather, Arsonist, or Crusader.

var consigResults = {
	'Bodyguard':'Your target is a trained protector. They must be a Bodyguard.',
	'Crusader':'Your target is a divine protector. They must be a Crusader.',
	'Doctor':'Your target is a professional surgeon. They must be a Doctor.',
	'Escort':'Your target is a beautiful person working for the town. They must be an Escort.',
	'Investigator':'Your target gathers information about people. They must be an Investigator.',
	'Jailor':'Your target detains people at night. They must be a Jailor.',
	'Lookout':'Your target watches who visits people at night. They must be a Lookout.',
	'Mayor':'Your target is the leader of the town. They must be the Mayor.',
	'Medium':'Your target speaks with the dead. They must be a Medium.',
	'Psychic':'Your target has the sight. They must be a Psychic.',
	'Retributionist':'Your target wields mystical powers. They must be a Retributionist.',
	'Sheriff':'Your target is a protector of the town. They must be a Sheriff.',
	'Spy':'Your target secretly watches who someone visits. They must be a Spy.',
	'Tracker':'Your target is a skilled in the art of tracking. They must be a Tracker.',
	'Transporter':'Your target specializes in transportation. They must be a Transporter.',
	'Trapper':'Your target is waiting for a big catch. They must be a Trapper.',
	'Vampire Hunter':'Your target tracks Vampires. They must be a Vampire Hunter!',
	'Veteran':'Your target is a paranoid war hero. They must be a Veteran.',
	'Vigilante':'Your target will bend the law to enact justice. They must be a Vigilante.',
	'Ambusher':'Your target lies in wait. They must be an Ambusher.',
	'Blackmailer':'Your target uses information to silence people. They must be a Blackmailer.',
	'Consigliere':'Your target gathers information for the Mafia. They must be a Consigliere.',
	'Consort':'Your target is a beautiful person working for the Mafia. They must be a Consort.',
	'Disguiser':'Your target makes other people appear to be someone they\'re not. They must be a Disguiser.',
	'Forger':'Your target is good at forging documents. They must be a Forger.',
	'Framer':'Your target has a desire to deceive. They must be a Framer!',
	'Godfather':'Your target is the leader of the Mafia. They must be the Godfather.',
	'Hypnotist':'Your target is skilled at disrupting others. They must be a Hypnotist.',
	'Janitor':'Your target cleans up dead bodies. They must be a Janitor.',
	'Mafioso':'Your target does the Godfather\'s dirty work. They must be a Mafioso.',
	'Coven Leader':'Your target leads the mystical. They must be the Coven Leader.',
	'Hex Master':'Your target is versed in the ways of hexes. They must be the Hex Master.',
	'Medusa':'Your target has a gaze of stone. They must be Medusa.',
	'Necromancer':'Your target uses the deceased to do their dirty work. They must be the Necromancer.',
	'Poisoner':'Your target uses herbs and plants to kill their victims. They must be the Poisoner.',
	'Potion Master':'Your target works with alchemy. They must be a Potion Master.',
	'Amnesiac':'Your target does not remember their role. They must be an Amnesiac.',
	'Arsonist':'Your target likes to watch things burn. They must be an Arsonist.',
	'Executioner':'Your target wants someone to be lynched at any cost. They must be an Executioner.',
	'Guardian Angel':'Your target is watching over someone. They must be a Guardian Angel.',
	'Jester':'Your target wants to be lynched. They must be a Jester.',
	'Juggernaut':'Your target gets more powerful with each kill. They must be a Juggernaut.',
	'Pestilence':'Your target reeks of disease. They must be Pestilence, Horseman of the Apocalypse.',
	'Pirate':'Your target wants to plunder the town. They must be a Pirate.',
	'Plaguebearer':'Your target is a carrier of disease. They must be the Plaguebearer.',
	'Serial Killer':'Your target wants to kill everyone. They must be a Serial Killer.',
	'Survivor':'Your target simply wants to live. They must be a Survivor.',
	'Vampire':'Your target drinks blood. They must be a Vampire!',
	'Werewolf':'Your target howls at the moon. They must be a Werewolf.',
	'Witch':'Your target casts spells on people. They must be a Witch.',
};

var sheriffResults = {
	'town':'You could not find evidence of wrongdoing. Your target seems innocent.',
	'mafia':'Your target is suspicious!',
	'coven':'Your target is suspicious!',
	'gf':'You could not find evidence of wrongdoing. Your target seems innocent.',
	'ww': 'Your target is suspicious!',
	'sk':'Your target is suspicious!',
	'arsonist':'You could not find evidence of wrongdoing. Your target seems innocent.',
	'neutral':'You could not find evidence of wrongdoing. Your target seems innocent.',
};

module.exports = {
	log:function(name,targets){
		loggedActions[name] = targets;
	},
	clear:function(){
		loggedActions = {};
		suggestedMessages = [];
		suggestedActions = [];
	},
	getRoleGroup:function(role){
		return getRoleGroup(role);
	},
	getInvestFlavor:function(group)
	{
		return investGrouping[group];
	},
	getAlignment:function(role){
		if (autoRoles[role])
		{
			return autoRoles[role].alignment;
		}
		else
		{
			return undefined;
		} 
	},
	getSheriffResult:function(alignment)
	{
		return sheriffResults[alignment];
	},
	getInvestGroupings:function(group){
		return getInvestGroupings(group);
	},
	getPlayerTargetingRule: function(player, params) {
		if(!player.alive) {
			params.dead = true;
		}
		var key = Object.keys(params).concat(['targeting']).join('_');
		var role_data = autoRoles[player.role.toLowerCase()] || {};
		var role_targeting = role_data[key] || (key == 'targeting' ? ['living other'] : []);
		if(typeof role_targeting === 'function') {
			role_targeting = role_targeting.call(player);
		}
		return role_targeting;
	},
	validTarget:function(arr, role, players, playernames, playernums, self, phase){
		var auto = autoRoles[role];
		if (auto)
		{
			if (auto.attributes.EXECUTE && phase == 8)
			{
				return 'Please use /x to execute your prisoner!';
			}
			if (auto.attributes.VIGKILL && daynumber == 1)
			{
				return 'You cannot shoot Night 1!';
			}
			if (auto.attributes.MAUL && daynumber % 2 == 1)
			{
				return 'You can only attack on a Full Moon!';
			}
			//Check number of targets
			if (arr.length > 1)
			{
				if (auto.attributes.MULTI)
				{
					
				}
				else
				{
					return 'You can only visit one person at night.';
				}
			}
			else
			{
				if (auto.attributes.FORCEDMULTI) //Has to visit two people.
				{
					return 'You need to visit 2 people with this role. Use /target person1 person2.';
				}
			}
			var selfVisiting = false;
			for (i in arr)
			{
				if (!isNaN(arr[i]) && playernums[arr[i]])
				{
					arr[i] = players[playernums[arr[i]]].name;
				}
				if (arr[i] == self.name)
				{
					selfVisiting = true;
				}
			}
			if (selfVisiting)
			{
				if (auto.attributes.SELF)
				{
					
				}
				else
				{
					return 'You tried to self target, but your role cannot self target.';
				}
			}
			else
			{
				if (auto.attributes.NOVISIT)
				{
					return 'You tried to target another player, but your role can only self target.';
				}
			}
		} 
		else
		{
			return 'notfound';
		}
		return 'ok';
	},
	setDay:function(num){
		daynumber = num;
	},
	getDay:function(){
		return daynumber;
	},
	getActions:function(name){
		return loggedActions[name];
	},
	grammarList:function(list, sep){
		if (sep === undefined)
		{
			sep = 'and';
		}
		//Format a list in a grammatically correct way.
		var str = '';
		if (list.length > 1)
		{
			str = list.slice(0,list.length-1).join(', ') + ' '+sep+' ' + list[list.length -1];
		}
		else if (list.length == 1)
		{
			str = list[0];
		}
		return str;
	},
	evaluate:function(players, playernames, playernums, mod, roles, lvl, fromphase){
		var displayTargets = {};
		var playerTargets = {};
		//Populate targets array.
		for (var i = 0; i < playernums.length; i++)
		{
			var player = players[playernums[i]];
			if (mod != player.s.id && !player.spectate)
			{
				var targets = (loggedActions[player.name] || []).slice();
				if (player.alive || loggedActions[player.name])
				{
					displayTargets[player.name] = [player.role, targets, true, []];
					if(!player.alive)
					{
						displayTargets[player.name][0] += ' (Dead)';
					}
				}
			}
		}
		//Only do this bit if suggestions are enabled ie. auto is 2
		if (lvl >= 2)
		{
			var gmPlayers = playernums.map(i=>Object.create(players[i])).filter(p=>mod != p.s.id && !p.spectate);
			var gmPlayerNames = Object.fromEntries(gmPlayers.map(p=>[p.name, p]));
			gmPlayers.map(function(player) {
				player.eventHandlers = {};
				player.on = function(type, callback) {
					eventHandlers[type] = (eventHandlers[type] || []);
					eventHandlers[type].push(callback);
				};

				var targets = (loggedActions[player.name] || []).map(name=>gmPlayerNames[name]);
				var role = autoRoles[player.role];
				if(role && role.interpret_targeting) {
					player.action = role.interpret_targeting.call(player, {
						targets,
						phase: fromphase,
						daynumber,
					});
				} else if(targets.length) {
					player.action = { type: 'default', targets };
				} else {
					player.action = { type: 'none', targets };
				}
			});
			var phase_gm = {
				players: gmPlayers,
				//Action handlers set by each role in the game
				actionHandlers: [],
				addActionHandler: function(filter, callback) {
					if(isNaN(filter['priority'])) filter['priority'] = 0;
					this.actionHandlers.push({ filter, callback });
				},
				//Event handlers, for special situations that an action doesn't cover
				eventHandlers: {},
				on: function(type, callback) {
					this.eventHandlers[type] = (eventHandlers[type] || []);
					this.eventHandlers[type].push(callback);
				},
				//Action list created while running the action handlers
				suggestedActions: [],
				notify: function(to, msg) {
					this.suggestedActions.push(['sys', to.name, msg]);
				},
				roleblock: function(target) {
					if(this.eventHandlers['roleblock']) {
						var e = {
							target,
							source: this.acting_player,
						};
						this.eventHandlers['roleblocked'].map(function(callback) {
							callback.call(this, e);
						});
						if(e.blocked) return;
					}
					if(target.roleblock_immunity) {
						target.notify(target, "Someone tried to roleblock you, but you are immune!");
					} else {
						target.notify(target, "You were roleblocked!");
						target.action = { type: 'roleblocked', targets: [] };
					}
				},
				control: function(target, new_action) {
					if(target.control_immunity) {
						target.notify(target, "Someone tried to control you, but you are immune!");
					} else {
						target.notify(target, "You were controlled!");
						new_action.targets = Object.assign({}, target.action.targets, new_action.targets);
						Object.assign(target.action, new_action);
					}
				},
				attacks: [],
				attack: function(e) {
					if(e.target.eventHandlers['attacked']) {
						e.target.eventHandlers['attacked'].map(function(callback) {
							callback.call(this, e);
						});
					}
					if(e.blocked) {
						target.notify(e.target, e.blocked_message);
					} else if(e.power <= e.defense) {
						target.notify(e.target, e.saved_message);
						target.notify(e.source, e.defense_message);
					} else {
						target.killedBy = (target.killedBy || []).concat([e.killed_by || e.source.role]);
					}
				},
			};
			var ingameRoles = Object.fromEntries(gmPlayers.map(p=>[p.role, autoRoles[p.role]]));
			for(var rolename in ingameRoles) {
				var role = ingameRoles[rolename];
				if(role && role.setup) {
					role.setup(phase_gm);
				}
			}
			phase_gm.actionHandlers = phase_gm.actionHandlers.sort((a, b)=>a.filter.priority - b.filter.priority);
			phase_gm.actionHandlers.map(function({ filter, callback }) {
				if(filter.phase && filter.phase !== framPhase) return;
				var foundPlayers = phase_gm.players.filter(function(p) {
					if(filter.role && (p.action.role || p.role) != filter.role) return false;
					if(filter.type && p.action.type != filter.type) return false;
					return true;
				});
				foundPlayers.map(function(p) {
					phase_gm.acting_player = p;
					callback.call(p, p.action.targets);
					delete phase_gm.acting_player;
				});
			});
			phase_gm.players.map(function(p) {
				if(p.killedBy) {
					phase_gm.suggestedActions.push(['kill', p.name]);
					p.killedBy.map(function(source_name) {
						phase_gm.suggestedActions.push(['death', source_name]);
					});
				}
			});
			return {
				targets: displayTargets,
				actions: phase_gm.suggestedActions,
				phase: fromphase
			}
		}
		else
		{
			return {
				targets: displayTargets
			}
		}
	}
}
function getRole(person)
{
	if (person)
	{
		return (person[0].toLowerCase());
	}
}
function getRoleGroup(role)
{
	if (autoRoles[role])
	{
		return autoRoles[role].grouping;
	}
	else
	{
		return '';
	}
}
function getInvestGroupings(grouping)
{
	var arr = [];
	for (i in autoRoles)
	{
		if (autoRoles[i].grouping == grouping)
		{
			arr.push(capitalize(i));
		}
	}
	return arr;
}
function getConsigGroupings(consiggrouping)
{
	var arr = [];
	for (i in autoRoles)
	{
		if (autoRoles[i].consiggrouping == consiggrouping)
		{
			arr.push(capitalize(i));
		}
	}
	return arr;
}
//String stuff
function capitalize(str)
{
	var arr = str.split(' ');
	for (i in arr)
	{
		arr[i] = arr[i][0].toUpperCase() + arr[i].substring(1,arr[i].length)
	} 
	return arr.join(' ');
}
function AorAn(word)
{
	var first = word[0].toLowerCase();
	if ('aeiou'.indexOf(first) != -1)
	{
		return 'an';
	}
	else
	{
		return 'a';
	}
}
