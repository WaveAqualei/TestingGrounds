var loggedActions = {};
var suggestedMessages = [];
var suggestedActions = [];
var dousedlist = [];
var daynumber = 1;
var attributes = { 
	 BG:'Protect your target, killing their attacker and yourself.',
	 HEAL:'Heal your target.',
	 NOHEAL:'Cannot be healed after revealing.',
	 RB:'Roleblock your target.',
	 INVESTIGATE:'View the target\'s investigator results. Affected by Framer, Arsonist, Disguiser, and Hex Master.',
	 JAIL:'Jail the target.',
	 EXECUTE:'Execute the jailed target.',
	 WATCH:'See all visitors to the target.',
	 MAFVISIT:'See who the Mafia visited.',
	 REVIVE:'Revive the target.',
	 INTERROGATE:'View the target\'s sheriff results. Affected by Framer, Disguiser, and Hex Master.',
	 DETECTIONIMMUNE:'Appears as Not Suspious to the Sheriff.',
	 TRANSPORT:'Swap all targets on your two targets.',
	 ALERT:'Kill anyone that targets you.',
	 MAFKILL:'Kill the target as member of the Mafia.',
	 VIGKILL:'Kill the target as Vigilante.',
	 SKKILL:'Kill the target as Serial Killer.',
	 IMMUNE:'Cannot die to KILL.',
	 BLACKMAIL:'Blackmail the target.',
	 CONSIG:'View the target\'s role.',
	 DISGUISE:'Disguise as the target, if they die.',
	 SWAPWILL:'Swap wills with the target, if they die.',
	 CLEAN:'Clean the target, if they die.',
	 REMEMBER:'Take the role of the target, if they are dead. Announce to the town.',
	 DOUSE:'Douse the target.',
	 IGNITE:'Ignite all doused targets.',
	 MULTI:'Target two players.',
	 FORCEDMULTI:'Has to target two players.',
	 SELF:'Can target themself.',
	 NOVISIT:'Can only target themself.',
	 VEST:'Make yourself night immune.',
	 NINJA:'Not spotted by WATCHES when visiting.',
	 RBIMMUNE:'Cannot be roleblocked.',
	 RBATTACK:'Attack the roleblocker.',
	 RBHOME:'Stays home when roleblocked.',
	 MAUL:'Attack target and all visitors.',
	 MUSTVISIT:'Must visit each night. If not visiting visits themselves instead.',
	 MUSTVISITEVEN:'Must visit each even night. If not visiting visits themselves instead.',
	 CHARGE:'Charge someone with electricity.',
	 CONTROLIMMUNE:'Cannot be controlled.',
	 FRAME:'Make the target appear as member of the Mafia.',
	 FULLMOONSHERIFFRESULT:'During a full moon the target shows as a Werewolf to the Sheriff.',
	 FORGE:'Change targets last will.',
	 HAUNT:'Kills one of their guilty voters.',
	 // TARGET:'Player that needs to be lynched for victory.',
	 CONTROL:'Make your first target visit your second target.',
	 PASSIVE:'Your night action takes effect without you needing to send in an action.',
	 /*Targetting attributes*/
	 DEADTARGET:'Able to target players that are dead.',
	 NOLIVINGTARGET:'Unable to target living players.',
	 RAINDANCE: 'Let it rain next night',
};
var autoRoles = 
	{
	'escort': {
		attributes: {
			RB:attributes.RB,
			RBIMMUNE:attributes.RBIMMUNE},
		grouping: 'H',
		consiggrouping:'Escort',
		alignment:'town',
		priority: 2
	}, 
	'transporter': {
		attributes: {
			MULTI:attributes.MULTI,
			FORCEDMULTI:attributes.FORCEDMULTI,
			TRANSPORT:attributes.TRANSPORT,
			RBIMMUNE:attributes.RBIMMUNE,
			CONTROLIMMUNE:attributes.CONTROLIMMUNE,
			PRIO1:attributes.PRIO1, 
			SELF:attributes.SELF},
		grouping: 'H',
		consiggrouping:'Transporter',
		alignment:'town',
		priority: 4
	},
	'vigilante': {
		attributes: {
			VIGKILL:attributes.VIGKILL},
		grouping: 'A',
		consiggrouping:'Vigilante',
		alignment:'town'
	},
	'veteran': {
		attributes: {
			RBIMMUNE:attributes.RBIMMUNE,
			CONTROLIMMUNE:attributes.CONTROLIMMUNE,
			SELF:attributes.SELF,
			ALERT:attributes.ALERT,
			NINJA:attributes.NINJA,
			NOVISIT:attributes.NOVISIT
			},
		grouping: 'A',
		consiggrouping:'Veteran',
		alignment:'town'
	},
	'sheriff': {
		attributes: {
			INTERROGATE:attributes.INTERROGATE},
		grouping: 'E',
		consiggrouping:'Sheriff',
		alignment:'town'
	},
	'investigator': {
		attributes:  {
			INVESTIGATE:attributes.INVESTIGATE},
		grouping: 'J',
		consiggrouping:'Investigator',
		alignment:'town'
	},
	'lookout': {
		attributes:  {
			WATCH:attributes.WATCH
		},
		grouping: 'G',
		consiggrouping:'Lookout',
		alignment:'town'
	},
	'mayor': {
		attributes:  {
			NOHEAL:attributes.NOHEAL},
		grouping: 'J',
		consiggrouping:'Mayor',
		alignment:'town'
	},
	'medium': {
		attributes:  {},
		grouping: 'B',
		consiggrouping:'Medium',
		alignment:'town'
	},
	'retributionist': {
		attributes:  {
			RBIMMUNE:attributes.RBIMMUNE,
			CONTROLIMMUNE:attributes.CONTROLIMMUNE,
			REVIVE:attributes.REVIVE,
			DEADTARGET:attributes.DEADTARGET,
			NOLIVINGTARGET:attributes.NOLIVINGTARGET},
		grouping: 'B',
		consiggrouping:'Retributionist',
		alignment:'town'
	},
	'doctor': {
		attributes:  {
			HEAL:attributes.HEAL,
			SELF:attributes.SELF},
		grouping: 'I',
		consiggrouping:'Doctor',
		alignment:'town',
		priority: 1
	},
	'bodyguard': {
		attributes:  {
			VEST:attributes.VEST,
			BG:attributes.BG,
			SELF:attributes.SELF},
		grouping: 'K',
		consiggrouping:'Bodyguard',
		alignment:'town',
		priority: 1
	},
	'jailor': {
		attributes:  {
			JAIL:attributes.JAIL,
			EXECUTE:attributes.EXECUTE},
		grouping: 'D',
		consiggrouping:'Jailor',
		alignment:'town'
	},
	'godfather': {
		attributes:  {
			MAFKILL:attributes.MAFKILL,
			IMMUNE:attributes.IMMUNE},
		grouping: 'K',
		consiggrouping:'Godfather',
		alignment:'gf'
	},
	'mafioso': {
		attributes:  {
			MAFKILL:attributes.MAFKILL,
			DEADTARGET:attributes.DEADTARGET},
		grouping: 'A',
		consiggrouping:'Mafioso',
		alignment:'mafia'
	},
	'ambusher': {
		attributes:  {},
		grouping: 'A',
		consiggrouping:'Ambusher',
		alignment:'mafia'
	},
	'consigliere': {
		attributes:  {
			CONSIG:attributes.CONSIG},
		grouping: 'J',
		consiggrouping:'Consigliere',
		alignment:'mafia'
	},
	'consort': {
		attributes:  {
			RB:attributes.RB,
			RBIMMUNE:attributes.RBIMMUNE},
		grouping: 'H',
		consiggrouping:'Consort',
		alignment:'mafia',
		priority:2
	},
	'hypnotist': {
		attributes:  {},
		grouping: 'H',
		consiggrouping:'Hypnotist',
		alignment:'mafia'
	},
	'disguiser': {
		attributes:  {
			DISGUISE:attributes.DISGUISE,
			SWAPWILL:attributes.SWAPWILL
			},
		grouping: 'I',
		consiggrouping:'Disguiser',
		alignment:'mafia'
	},
	'framer': {
		attributes:  {
			FRAME:attributes.FRAME},
		grouping: 'F',
		consiggrouping:'Framer',
		alignment:'mafia'
	},
	'janitor': {
		attributes:  {
			CLEAN:attributes.CLEAN},
		grouping: 'B',
		consiggrouping:'Janitor',
		alignment:'mafia'
	},
	'forger': {
		attributes:  {
			FORGE:attributes.FORGE},
		grouping: 'G',
		consiggrouping:'Forger',
		alignment:'mafia'
	},
	'serial killer': {
		attributes:  {
			SKKILL:attributes.SKKILL,
			RBATTACK:attributes.RBATTACK,
			IMMUNE:attributes.IMMUNE},
		grouping: 'I',
		consiggrouping:'Serial Killer',
		alignment:'sk'
	},
	'arsonist': {
		attributes:  {
			DOUSE:attributes.DOUSE,
			IGNITE:attributes.IGNITE,
			SELF: attributes.SELF,
			MUSTVISIT: attributes.MUSTVISIT,
			IMMUNE:attributes.IMMUNE},
		grouping: 'K',
		consiggrouping:'Arsonist',
		alignment:'arsonist'
	},
	'werewolf': {
		attributes:  {
			MAUL:attributes.MAUL,
			SELF:attributes.SELF,
			IMMUNE:attributes.IMMUNE,
			FULLMOONSHERIFFRESULT:attributes.FULLMOONSHERIFFRESULT,
			MUSTVISITEVEN:attributes.MUSTVISITEVEN,
			RBHOME:attributes.RBHOME},
		grouping: 'E',
		consiggrouping:'Werewolf',
		alignment:'ww'
	},
	'jester': {
		attributes:  {
			HAUNT:attributes.HAUNT
		},
		grouping: 'F',
		consiggrouping:'Jester',
		alignment:'neutral'
	},	
	'executioner': {
		attributes:  {
			IMMUNE:attributes.IMMUNE
			// TARGET:attributes.TARGET
		},
		grouping: 'E',
		consiggrouping:'Executioner',
		alignment:'neutral'
	},
	'witch': {
		attributes:  {
			CONTROL:attributes.CONTROL,
			RBIMMUNE:attributes.RBIMMUNE,
			MULTI:attributes.MULTI,
			FORCEDMULTI:attributes.MULTI
		},
		grouping: 'G',
		consiggrouping:'Witch',
		alignment:'neutral',
		priority:3
	},
	'survivor': {
		attributes:  {
			VEST:attributes.VEST,
			SELF:attributes.SELF,
			NINJA:attributes.NINJA,
			NOVISIT:attributes.NOVISIT
		},
		grouping: 'C',
		consiggrouping:'Survivor',
		alignment:'neutral'
	},
	'amnesiac': {
		attributes:  {
			REMEMBER:attributes.REMEMBER,
			DEADTARGET:attributes.DEADTARGET,
			NOLIVINGTARGET:attributes.NOLIVINGTARGET
		},
		grouping: 'C',
		consiggrouping:'Amnesiac',
		alignment:'neutral'
	},
	//Custom Roles
	'tracker': {
		attributes:  {},
		grouping: 'J',
		consiggrouping:'Tracker',
		alignment:'town'
	},
	'musician': {
	    attributes: {
	      		SELF:attributes.SELF
	    },
		grouping: 'E',
		consiggrouping:'Musician',
		alignment:'mafia'
	},
};

var investGrouping = {
	'A':'Your target could be a',
	'B':'Your target could be a',
	'C':'Your target could be a',
	'D':'Your target could be a',
	'E':'Your target could be a',
	'F':'Your target could be a',
	'G':'Your target could be a',
	'H':'Your target could be an',
	'I':'Your target could be a',
	'J':'Your target could be an',
	'K':'Your target could be a',
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
				return 'You can only attack on Full Moon!';
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
				if(role && role.interpretTargeting) {
					player.action = role.interpretTargeting.call(player, {
						targets,
						fromphase,
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
					actionHandlers.push({ filter, callback });
				},
				//Event handlers, for special situations that an action doesn't cover
				eventHandlers: {},
				on: function(type, callback) {
					eventHandlers[type] = (eventHandlers[type] || []);
					eventHandlers[type].push(callback);
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
					if(target.action.roleblock_immunity) {
						target.notify(target, "Someone tried to roleblock you, but you are immune!");
					} else {
						target.notify(target, "You were roleblocked!");
						target.action = { type: 'roleblocked', targets: [] };
					}
				},
				control: function(target, new_action) {
					if(target.action.control_immunity) {
						target.notify(target, "Someone tried to control you, but you are immune!");
					} else {
						target.notify(target, "You were controlled!");
						new_action.targets = Object.assign(target.action.targets, new_action.targets);
						target.action = new_action;
						//TODO: Move immunities out of the action, so that a witch control doesn't erase roleblock immunity
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
					if(filter.role && p.role != filter.role) return false;
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
function isLegalTarget(name,roleAttributes,targets)								
{
	//If they are not self targetting, or are allowed to self target anyway. 
	//Exception variable for witches and transporters.
	return (targets[name][1] != name || roleAttributes.SELF || targets[name][3]);
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
