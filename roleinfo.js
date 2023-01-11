//colors
var towncolor = '#7fff00';
var mafiacolor = '#dd0000';
var covencolor = '#bf5fff';
var vampcolor = '#7b8968';
var floraecolor = '#228f40';
var positivecolor = '#FFFF0A';
var negativecolor = '#0A0AFF';
var godcolor = '#FFC000';
var sincolor = '#92D050';
var randcolor = '#49a9d0';
var neutcolor = '#cccccc';
var anycolor = '#F5F5F5';
var mystcolor = '#D7B4F3';
var overcolor = '#15F4EE';
var hilitecolor = '#A78A52';
//Generic goals
var towngoal = 'Lynch every criminal and evildoer.';
var mafiagoal = 'Kill anyone that will not submit to the Mafia.';
var covengoal = 'Kill all who would oppose the Coven.';
var vampgoal = 'Kill anybody that would reject the Vampires.';
var floraegoal = 'Exterminate anyone that would harm your tribe.';
var electricgoal = 'Kill all who will not submit to technology.';

var roles = [
	// === VANILLA ROLES ===
	// TOWN INVESTIGATIVE VANILLA
	{
		rolename: 'sheriff',
		alignment: 'town investigative',
		abilities: ['Interrogate one person each night for suspicious activity.'],
		attributes: ['You will know if your target is suspicious.'],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'investigator',
		alignment: 'town investigative',
		abilities: ['Investigate one person each night for a clue to their role.'],
		attributes: ['None.'],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'lookout',
		alignment: 'town investigative',
		abilities: ['Watch one person at night to see who visits them.'],
		attributes: ['None.'],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'tracker',
		alignment: 'town investigative',
		abilities: ['Track one person at night to see who they visit.'],
		attributes: ['None.'],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'spy',
		alignment: 'town investigative',
		abilities: ["You may bug a player's house to see what happens to them that night."],
		attributes: ['You will know who the Mafia and Coven visit each night.'],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'psychic',
		alignment: 'town investigative',
		abilities: ['Receive a vision every night.'],
		attributes: [
			'On odd nights you will have a vision of three players, at least one will be Evil.',
			'On even nights you will have a vision of two players, at least one will be Good.',
			'All Town roles and Neutral Benign roles appear as Good, all other roles appear as Evil.',
		],
		targeting: [],
		goal: towngoal,
		color: towncolor,
	},
	
	// TOWN KILLING VANILLA
	{
		rolename: 'jailor',
		alignment: 'town killing',
		attack: 'Unstoppable',
		abilities: ['You may choose one person during the day to jail for the night.'],
		attributes: [
			'You may anonymously talk with your prisoner.',
			'You can choose to execute your prisoner.',
			"The jailed target can't perform their night ability.",
			'If you execute a Town member, you forfeit further executions.',
		],
		day_targeting: ['living other'],
		targeting: ['jailed notfirst'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'vampire hunter',
		alignment: 'town killing',
		attack: 'Basic',
		abilities: ['Check for Vampires each night.'],
		attributes: [
			'If you visit a Vampire you will attack them.',
			'If a Vampire visits you, you will attack them.',
			'You can hear Vampires at night.',
			'If all the Vampires die you will become a Vigilante with one bullet.',
		],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'veteran',
		alignment: 'town killing',
		attack: 'Powerful',
		abilities: ['Decide if you will go on alert.'],
		attributes: [
			'While on alert, you gain Basic Defense.',
			'While on alert, you will deliver a Powerful attack to anyone who visits you.',
			'You can only go on alert 3 times.',
			'You cannot be roleblocked.',
		],
		targeting: ['self'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'vigilante',
		alignment: 'town killing',
		attack: 'Basic',
		abilities: ['Choose to take justice into your own hands and shoot someone.'],
		attributes: ['If you shoot another Town member you will commit suicide over the guilt.', 'You can only shoot your gun 3 times.'],
		targeting: ['living other notfirst'],
		goal: towngoal,
		color: towncolor,
	},

	// TOWN PROTECTIVE VANILLA
	{
		rolename: 'bodyguard',
		alignment: 'town protective',
		attack: 'Powerful',
		abilities: ['Protect a player from direct attacks at night.'],
		attributes: [
			'If your target is directly attacked or is the victim of a harmful visit, you and the visitor will fight.',
			'If you successfully protect someone you can still be healed.',
			'You have one bulletproof vest.',
		],
		targeting: ['living'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'doctor',
		alignment: 'town protective',
		abilities: ['Heal one person each night, granting them Powerful Defense and cure Poison.'],
		attributes: ['You may only heal yourself once.', 'You will know if your target is attacked.', 'You may not Heal a revealed Mayor.'],
		targeting: ['living'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'crusader',
		alignment: 'town protective',
		attack: 'Basic',
		abilities: ['Protect one person other than yourself during the night, granting them Powerful Defense.'],
		attributes: [
			'You will know if your target is attacked.',
			'You attack one person who visits your target on the same night.',
		],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'trapper',
		alignment: 'town protective',
		attack: 'Powerful',
		abilities: ['You may set up a Trap at another player\'s house.'],
		attributes: [
			'Traps take one day to build.',
			'Traps can be torn down by selecting yourself at night.',
			'You may only have one Trap out at a time.',
			'Traps will trigger upon visits, but will only harm attackers.',
			'You will know the roles of all the players that visit your trapped target.',
		],
		targeting: ['living other notfirst'],
		goal: towngoal,
		color: towncolor,
	},
	
	// TOWN SUPPORT VANILLA
	{
		rolename: 'escort',
		alignment: 'town support',
		abilities: ['Distract someone each night.'],
		attributes: ["Distraction blocks your target from using their role's night ability.", 'You cannot be roleblocked.'],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'mayor',
		alignment: 'town support',
		abilities: ['You may reveal yourself as the Mayor of the Town.'],
		attributes: ['Once you have revealed yourself as Mayor your vote counts as 3 votes.', 'You may not be Healed once you have revealed yourself.', 'Once revealed, you can\'t whisper, or be whispered to.'],
		day_targeting: ['self'],
		targeting: [],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'medium',
		alignment: 'town support',
		abilities: ['When dead, seance a living person at night.'],
		attributes: ['You will speak to the dead anonymously each night you are alive.', 'You may only seance a living person once.'],
		targeting: [],
		day_dead_targeting: ['living'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'transporter',
		alignment: 'town support',
		abilities: ['Choose two people to transport at night.'],
		attributes: ['Transporting two people swaps all targets against them.', 'You may transport yourself.', 'Your targets will know they were transported.'],
		targeting: ['living', 'living'],
		goal: towngoal,
		color: towncolor,
	},
	{
		rolename: 'retributionist',
		alignment: 'town support',
		abilities: ['You may raise a dead Town member and use their ability on a player.'],
		attributes: ['Create zombies from dead true-hearted Town players.', 'Use their abilities on your second target.', 'Each zombie can be used once before it rots.'],
		targeting: ['dead town notfirst', 'living'],
		goal: towngoal,
		color: towncolor,
	},

	// MAFIA KILLING VANILLA
	{
		rolename: 'godfather',
		alignment: 'mafia killing',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may choose to attack a player each night.'],
		attributes: ['If there is a Mafioso they will attack the target instead of you.', 'You will appear to be innocent to the Sheriff.', 'You can talk with the other Mafia at night.'],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'mafioso',
		alignment: 'mafia killing',
		attack: 'Basic',
		abilities: ["Carry out the Godfather's orders."],
		attributes: ["You can attack if the Godfather doesn't give you orders.", 'If the Godfather dies you will become the next Godfather.', 'You can talk with the other Mafia at night.'],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'ambusher',
		alignment: 'mafia killing',
		attack: 'Basic',
		abilities: ['You may choose to lie in wait outside your targets house.'],
		attributes: [
			'You will attack one player who visits your target.',
			'All players visiting your target will learn your name.',
			'If there are no kill capable Mafia roles left you will become a Mafioso.',
			'You can talk with the other Mafia at night.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	
	// MAFIA SUPPORT VANILLA
	{
		rolename: 'blackmailer',
		alignment: 'mafia support',
		abilities: ['Choose one person each night to blackmail.'],
		attributes: [
			'Blackmailed targets cannot talk during the day.',
			'You can hear private messages.',
			'If there are no kill capable Mafia roles left you will become a Mafioso.',
			'You can talk with the other Mafia at night.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'consigliere',
		alignment: 'mafia support',
		abilities: ['Check one person for their exact role each night.'],
		attributes: ['If there are no kill capable Mafia roles left you will become a Mafioso.', 'You can talk with the other Mafia at night.'],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'consort',
		alignment: 'mafia support',
		abilities: ['Distract someone each night.'],
		attributes: [
			"Distraction blocks your target from using their role's night ability.",
			'If there are no kill capable Mafia roles left you will become a Mafioso.',
			'You can talk with the other Mafia at night.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	
	// MAFIA DECEPTION VANILLA
	{
		rolename: 'disguiser',
		alignment: 'mafia deception',
		abilities: ['Disguise a mafia member as a non-mafia member to alter their identity.'],
		attributes: [
			'The disguised Mafia member will appear to have the same role as the non-Mafia member to the Investigator and Sheriff, will appear to be the other person to a Lookout, and Mafia visits are disregarded by Spy.',
		],
		targeting: ['living mafia', 'living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'framer',
		alignment: 'mafia deception',
		abilities: ['Choose someone to frame at night.'],
		attributes: [
			'If your target is interrogated they will appear suspicious.',
			'If your target is investigated they will appear as a Framer.',
			'If there are no kill capable Mafia roles left you will become a Mafioso.',
			'You can talk with the other Mafia at night.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'forger',
		alignment: 'mafia deception',
		abilities: ['Choose a person and rewrite their role and last will at night.'],
		attributes: [
			'If a target dies, their role and last will is replaced with your forgery.',
			'You may only perform 2 forgeries.',
			'If there are no kill capable Mafia roles left you will become a Mafioso.',
			'You can talk with the other Mafia at night.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'janitor',
		alignment: 'mafia deception',
		abilities: ['Choose a person to clean at night.'],
		attributes: [
			"If your target dies their role and last will won't be revealed to the Town.",
			'Only you will see the cleaned targets role and last will.',
			'You may only perform 3 cleanings.',
			'If there are no kill capable Mafia roles left you will become a Mafioso.',
			'You can talk with the other Mafia at night.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'hypnotist',
		alignment: 'mafia deception',
		abilities: ['You may sneak into a players house at night and plant a memory.'],
		attributes: ['A planted memory will confuse the player.', 'If there are no kill capable Mafia roles left you will become a Mafioso.', 'You can talk with the other Mafia at night.'],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},

	// COVEN VANILLA
	{
		rolename: 'coven leader',
		alignment: 'coven evil',
		attack: 'Basic',
		abilities: ['You may choose to Control someone each night.'],
		attributes: [
			'Your victim will know they are being controlled.',
			'With the Necronomicon, your victim is dealt a Basic attack and you gain Basic defense.',
			'You will know the role of the player you control.',
		],
		targeting: ['living noncoven', 'living'],
		goal: covengoal,
		color: covencolor,
	},
	{
		rolename: 'hex master',
		alignment: 'coven evil',
		attack: 'Basic',
		abilities: ['You may choose to Hex a player each night.'],
		attributes: [
			'Players are not notified upon being hexed.',
			'Hexed targets will have their investigative results changed.',
			'When all living non-Coven players are hexed, all hexed players will be dealt an Unstoppable attack.',
			'With the Necronomicon, you gain Astral and Basic attacks.',
		],
		targeting: ['living noncoven'],
		goal: covengoal,
		color: covencolor,
	},
	{
		rolename: 'medusa',
		alignment: 'coven evil',
		attack: 'Powerful',
		abilities: ['You may choose to Stone Gaze all visitors at night.'],
		attributes: ['You may choose to stone gaze thrice.', "Your victims's last wills and roles will not be revealed.", 'With the Necronomicon, you may visit players and turn them to stone.'],
		targeting: ['self'],
		necronomicon_targeting: ['living'],
		goal: covengoal,
		color: covencolor,
	},
	{
		rolename: 'necromancer',
		alignment: 'coven evil',
		attack: 'Basic',
		abilities: ['You may reanimate a dead player and use their ability on a player.'],
		attributes: [
			'Create zombies from dead players who use their abilities on your second target.',
			'Each zombie can be used once before it rots.',
			'With the Necronomicon, select yourself to summon a ghoul to Basic attack your target.',
		],
		targeting: ['dead notfirst', 'living'],
		necronomicon_targeting: ['self', 'living'],
		goal: covengoal,
		color: covencolor,
	},
	{
		rolename: 'poisoner',
		alignment: 'coven evil',
		attack: 'Basic',
		abilities: ['You may choose to poison a player each night.'],
		attributes: ['Your poisons take one day to take effect.', 'Poison can be removed by Heals.', 'With the Necronomicon, your poison can no longer be Healed.'],
		targeting: ['living noncoven'],
		goal: covengoal,
		color: covencolor,
	},
	{
		rolename: 'potion master',
		alignment: 'coven evil',
		attack: 'Basic',
		abilities: ['You may choose to use a potion on a player each night.'],
		attributes: ['You may choose to use a Heal, reveal, or attack potion on a player.', 'Each potion has a three day cooldown.', 'With the Necronomicon, your potions no longer have a cooldown.'],
		targeting: ['living other'],
		goal: covengoal,
		color: covencolor,
	},

	// NEUTRAL BENIGN VANILLA
	{
		rolename: 'survivor',
		alignment: 'neutral benign',
		abilities: ['Put on a bulletproof vest at night, granting you Basic Defense.'],
		attributes: ['You can only use the bulletproof vest 4 times.'],
		targeting: ['self'],
		goal: 'Live to the end of the game.',
		color: '#dddd00',
	},
	{
		rolename: 'amnesiac',
		alignment: 'neutral benign',
		abilities: ['Remember who you were by selecting a graveyard role.'],
		attributes: ['When you choose a role it will be revealed to all the players in the game.'],
		goal: 'Remember who you were and complete that role\'s objective.',
		targeting: ['dead notfirst'],
		color: '#22ffff',
	},
	{
		rolename: 'guardian angel',
		alignment: 'neutral benign',
		abilities: ['Keep your target alive.'],
		attributes: [
			'Your target can be any player except an Executioner, Jester, or another Guardian Angel.',
			'If your target is killed you will become a Survivor without any bulletproof vests.',
			'Twice a game you may Heal and Purge your target. This may be done from the grave. Watching over a player ignores Jail.',
		],
		targeting: ['target'],
		goal: 'Keep your target alive until the end of the game.',
		color: '#FFFFFF',
	},

	// NEUTRAL EVIL VANILLA
	{
		rolename: 'executioner',
		alignment: 'neutral evil',
		attack: 'None',
		defense: 'Basic',
		abilities: ['Trick the Town into lynching your target.'],
		attributes: ['Your target can be any Townmember except a Jailor or Mayor.', 'If your target is killed at night you will become a Jester.'],
		targeting: [],
		goal: 'Get your target lynched at any cost.',
		color: '#CCCCCC',
	},
	{
		rolename: 'jester',
		alignment: 'neutral evil',
		abilities: ['Trick the Town into voting against you.'],
		attributes: ['If you are lynched you may kill one of your guilty or abstaining voters the following night.'],
		targeting: [],
		dead_targeting: ['living'],
		goal: 'Get yourself lynched by any means necessary.',
		color: '#f7b3da',
	},
	{
		rolename: 'witch',
		alignment: 'neutral evil',
		abilities: ['Control someone each night.'],
		attributes: [
			'You have a mystical barrier that grants you Basic defense until you are attacked.',
			'Your victim will know they are being controlled.',
			'You will know the role of the player you Control.',
		],
		targeting: ['living other', 'living'],
		goal: 'Survive to see the Town lose the game.',
		color: covencolor,
	},

	// NEUTRAL KILLING VANILLA
	{
		rolename: 'serial killer',
		alignment: 'neutral killing',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may choose to attack a player each night.'],
		attributes: [
			'If you are roleblocked you will attack the roleblocker in addition to your target (Escorts and Consorts only).',
			'Roleblockers that target you will have their last will covered in blood making it unreadable.',
			'You can choose to be cautious and not kill roleblockers.',
		],
		targeting: ['living other'],
		goal: 'Kill everyone who would oppose you.',
		color: '#336eff',
	},
	{
		rolename: 'arsonist',
		alignment: 'neutral killing',
		attack: 'Unstoppable',
		defense: 'Basic',
		abilities: ['You may Douse someone in gasoline or ignite Doused targets.'],
		attributes: [
			'Select yourself to ignite doused people dealing an Unstoppable attack.',
			'You will douse anybody that visits you.',
			'If you take no action, you will attempt to clean gasoline off yourself.',
			'Doused targets will have their Investigator results changed. Non-Arsonists will not know they were doused.',
		],
		targeting: ['living'],
		goal: 'Live to see everyone else burn.',
		color: '#ee7600',
	},
	{
		rolename: 'werewolf',
		alignment: 'neutral killing',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['Transform into a Werewolf during the full moon.'],
		attributes: ["You will Rampage at a player's house when you attack.", 'If you do not select a target you will stay home and Rampage at your home.'],
		targeting: ['living other fullmoon'],
		goal: 'Kill everyone who would oppose you.',
		color: '#9f703a',
	},
	{
		rolename: 'juggernaut',
		alignment: 'neutral killing',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['You may choose to attack a player on Full-Moon nights.'],
		attributes: [
			'With each kill your powers grow.',
			'On your first kill, you may attack every night.',
			'On your second kill, you Rampage when you attack.',
			'On your third kill, you ignore all effects that would protect a player.',
		],
		targeting: ['living other notfirst'],
		goal: 'Kill everyone who would oppose you.',
		color: '#a12b56',
	},

	// NEUTRAL CHAOS VANILLA
	{
		rolename: 'pirate',
		alignment: 'neutral chaos',
		attack: 'Powerful',
		abilities: ['Choose a player to plunder each night.'],
		attributes: ['When you plunder a player, you will duel the player for their valuables.', 'If the player defends against your attack, you get no loot.'],
		day_targeting: ['living other'],
		targeting: [],
		goal: 'Successfully plunder two players.',
		color: '#edc240',
	},
	{
		rolename: 'plaguebearer',
		alignment: 'neutral chaos',
		attack: 'None',
		defense: 'Basic',
		abilities: ['You may choose to infect a player with the Plague each night.'],
		attributes: [
			'Infected players spread the Plague on visiting or being visited.',
			'Infection cannot be protected against or removed.',
			'Players will not know they have been infected.',
			'When all living players are infected, you will become Pestilence.',
		],
		targeting: ['living other'],
		goal: 'Infect all living players and become Pestilence.',
		color: '#cfff63',
	},
	{
		rolename: 'pestilence',
		alignment: 'neutral chaos',
		attack: 'Powerful',
		defense: 'Invincible',
		abilities: ['You may choose to Rampage at a player\'s house each night.'],
		attributes: [
			'You will attack anyone that visits you or your target.',
			'You cannot be roleblocked or controlled.',
			'If you are jailed you will attack the Jailor.',
			'You cannot be killed at night.',
		],
		targeting: ['living other'],
		goal: 'Kill all who would oppose you.',
		color: '#424242; text-shadow: 0px 0px 5px #cfff63',
		
	},
	{
		rolename: 'vampire',
		alignment: 'neutral chaos',
		attack: 'Basic',
		abilities: ['Convert others to Vampires at night.'],
		attributes: [
			'Vampires vote at night to bite a target.',
			'The youngest Vampire will visit the target at night.',
			'If your target cannot be converted, they will instead be dealt a Basic attack.',
		],
		targeting: ['living nonvampire'],
		goal: 'Convert everyone who would oppose you.',
		color: '#7b8968',
	},

	// === CUSTOM ROLES ====
	// TOWN INVESTIGATIVE CUSTOM
	{
		rolename: 'gossip',
		alignment: 'town investigative',
		abilities: ['Investigate one role slot at night to see who the player in that role slot visits.'],
		attributes: ['Your night action does not count as a visit.', 'If the role slot is Any, you will be told which general alignment that role slot was rolled as (Town, Mafia, Coven, Neutral).'],
		targeting: [],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},
	{
		rolename: 'psychic overhaul',
		alignment: 'town investigative',
		abilities: ['Each night following a lynch, select either "guilty", "innocent", or "abstain" to learn how many suspicious players voted that way.'],
		attributes: [
			'Players are defined as suspicious if a Sheriff would see them as suspicious that night.',
			'If you are roleblocked or controlled, you will not receive any information.',
		],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},
	{
		rolename: 'spy nerf',
		alignment: 'town investigative',
		abilities: ['You may bug two player\'s houses each night, learning what happens to them.'],
		attributes: [
			'You will not learn what happens to which player.',
			'You will know if the Mafia and Coven visited your targets.',
			'You will know if the Mafia and Coven visited any players that visited your targets.',
		],
		targeting: ['living other', 'living other'],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},
	
	// TOWN KILLING CUSTOM
	{
		rolename: 'firebrand',
		alignment: 'town killing',
		abilities: ['You may douse one player in gasoline or ignite all doused targets (1 use).'],
		attributes: [
			'You may not ignite players doused by other Firebrands or Arsonists unless you also doused them.',
			'If igniting would otherwise kill two or more Town members, you will instead burn yourself and your will.',
			'If you target someone who you doused previously they will become undoused.',
		],
		targeting: ['living'],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},
	{
		rolename: 'seeker',
		alignment: 'town killing',
		abilities: ['You may mark a player during the day.',
			    'You may watch two players\' houses at night.'],
		attributes: [
			'Marks last for two nights.',
			'You will shoot one marked player if they visit your target.',
			'If you shoot another Town member you cannot mark or shoot the next day.',
		],
		day_targeting: ['living other'],
		targeting: ['living other', 'living other'],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},

	// TOWN PROTECTIVE CUSTOM:
	{
		rolename: 'bouncer',
		alignment: 'town protective',
		abilities: ['You may guard a player at night, causing direct visits to fail against the player.'],
		attributes: [
			'You will know how many players visited your target.',
			'If your target is directly attacked or is the victim of a harmful visit, they will live and you will be attacked instead.',
		],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},
	{
		rolename: 'charmer',
		alignment: 'town protective',
		abilities: ['Give out two charms each night.'],
		attributes: [
			'A charm provides Basic Defense against one attack.',
			'At the end of the night your charms are returned to you.',
			'If you protect a player, your charms will break, and you will have to spend a night making new charms.',
		],
		targeting: ['living other', 'living other'],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},
	{
		rolename: 'cleric',
		alignment: 'town protective',
		abilities: ['Protect two people at night to delay their death(s) by one night if they are attacked and would die.'],
		attributes: [
			'You protect against all attacks, including those with a value of Unstoppable.',
			'You may not target the same person more than twice in a row.',
			'If you delay someone\'s death, then Doctors cannot save that person from dying.',
		],
		targeting: ['living other', 'living other'],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},
	
	// TOWN SUPPORT CUSTOM:
	{
		rolename: 'judge',
		alignment: 'town support',
		abilities: ['You may Pardon someone at night.', 'You may Object to a vote outcome, and flip the result.'],
		attributes: [
			'You may not pardon Night 1.',
			'You may not pardon yourself.',
			'You only have 3 Pardons.',
			'You may object a trial once, including your own.',
			'Objecting reveals your name to all Evils. Town will not learn your identity.',
		],
		targeting: ['living other'],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},

	// MAFIA CUSTOM
	{
		rolename: 'ambusher buff',
		alignment: 'mafia killing',
		attack: 'Basic',
		abilities: ['You may choose to lie in wait outside your target\'s house.'],
		attributes: [
			'You will attack one player who visits your target.',
			'All players visiting your target will learn your name.',
			'You can choose to be cautious and not kill anyone if there is more than one visitor to your target.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'kidnapper',
		alignment: 'mafia killing',
		attack: 'Basic',
		abilities: ['You may kidnap a player during the day to hold hostage for the night.'],
		attributes: [
			'You may only exterminate a player once. You will become a Mafioso after you exterminate someone.',
			'You may not kidnap the same player twice in a row.',
			'You may not kidnap a revealed Mayor.',
		],
		day_targeting: ['living nonmafia'],
		targeting: ['self'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'technician',
		alignment: 'mafia support',
		abilities: ['You may use one of your three devices at night.'],
		attributes: [
			'Sabotage will affect certain roles\' abilities. You may not Sabotage the same player twice.',
			'Gas Grenades take one night to build; they obscure information to their targets and visitors.',
			'Tapping a player gives you all notifications they get that night.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
		custom: true,
	},
	{
		rolename: 'trickster',
		alignment: 'mafia support',
		abilities: ['You may hide a player at another player\'s house at night.'],
		attributes: [
			'Anyone who visits your first target will visit your second target instead.',
			'Attacks and protections cannot be redirected.',
			'One of your targets must be a member of the Mafia.',
		],
		targeting: ['living', 'living'],
		goal: mafiagoal,
		color: mafiacolor,
		custom: true,
	},
	{
		rolename: 'consigliere buff',
		alignment: 'mafia support',
		abilities: ['Check one person for their exact role each night.'],
		attributes: [
			'You will learn how many living players share the same subalignment as your target.',
			'If there are no kill capable Mafia roles left you will become a Mafioso.',
			'You can talk with the other Mafia at night.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
	},
	{
		rolename: 'hypnotist buff',
		alignment: 'mafia deception',
		abilities: ['You may sneak into a player\'s house at night and plant a memory.'],
		attributes: [
			'A planted memory will confuse the player.',
			'Certain messages will change to alternative message if your target is jailed or immune.',
			'If there are no kill capable Mafia roles left you will become a Mafioso.',
		],
		targeting: ['living nonmafia'],
		goal: mafiagoal,
		color: mafiacolor,
		custom: true,
	},
	{
		rolename: 'agent',
		alignment: 'mafia deception',
		abilities: ['You may lay a smoke bomb to a target at night, obscuring what happens to them.'],
		attributes: ['You may not smoke bomb the same player two nights in a row.', 'Your smoke bombs obscures the results of night abilities used on your target.', 'You may target the Mafia.'],
		targeting: ['living other'],
		goal: mafiagoal,
		color: mafiacolor,
		custom: true,
	},
	{
		rolename: 'musician',
		alignment: 'mafia support',
		abilities: ['You may perform at someone\'s house at night, drawing their visitors to you.',
			    'You may Serenade by selecting yourself, reducing the amount of trials the next day to one.'],
		attributes: ['You may only perform at each player\'s house once', 'You can only Serenade twice.'],
		targeting: ['living'],
		goal: mafiagoal,
		color: mafiacolor,
		custom: true,
	},
	{
		rolename: 'scout',
		alignment: 'mafia support',
		abilities: ['You may accompany someone at night.'],
		attributes: ['Your target cannot be roleblocked or controlled and will have their visit astral that night.',
					 'You will receive all night feedback that your target receives.',
			     		 'You may target the Mafia.',
					 'You cannot be roleblocked controlled.',
					 'If there are no capable Mafia Killing roles you will become a Mafioso.',
		],
		targeting: ['living other'],
		goal: mafiagoal,
		color: mafiacolor,
		custom: true,
	},
	{
		rolename: 'recon',
		alignment: 'mafia support',
		abilities: ['You may spy on a player at night.'],
		attributes: ['You will know who visits your target, along with who your target visits.',
			     'If there are no capable Mafia killing roles you will become a Mafioso.',
			     'You may talk with the other Mafia at night.',
		],
		targeting: ['living other'],
		goal: mafiagoal,
		color: mafiacolor,
		custom: true,
	},
	{
		rolename: 'disguiser rework',
		alignment: 'mafia deception',
		abilities: ['Choose a Mafia member to disguise at Night.'],
		attributes: [
			'Disguises last until the start of the next night.',
			'Disguised players show up as the role of your choice, both to investigative roles and on death (including lynches).',
			'You cannot disguise the same Player Twice in a row.',
		],
		targeting: ['living mafia'],
		goal: mafiagoal,
		color: mafiacolor,
		custom: true,
	},

	// COVEN CUSTOM
	{
		rolename: 'coven leader nerf',
		alignment: 'coven evil',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may Control someone each night, learning a clue to their role.'],
		attributes: [
			'You may not Control the same player twice in a row.',
			'With the Necronomicon, your victim is dealt a Basic Attack and you gain Basic Defense.',
			'You will inherit the Necronomicon first.',
		],
		targeting: ['living noncoven', 'living'],
		goal: covengoal,
		color: covencolor,
		custom: true,
	},
	{
		rolename: 'poisoner overhaul',
		alignment: 'coven evil',
		attack: 'Basic',
		abilities: ['You may blight a player at night, or poison a blighted player.'],
		attributes: [
			'Blights block your target from using their role\'s night ability.',
			'Poisoning a blighted player will deal a Basic Attack to them the following night.',
			'With the Necronomicon, you will deliver a Basic Attack the night you blight your target.',
		],
		targeting: ['living noncoven'],
		goal: covengoal,
		color: covencolor,
		custom: true,
	},
	{
		rolename: 'lapidarist',
		alignment: 'coven evil',
		attack: 'Basic',
		abilities: ['You may crystallize someone at night, or spend a night to craft a crystal.'],
		attributes: [
			'You start with 2 Crystals.',
			'Crystals reflect abilities back to where they came from.',
			'If your crystallized target visits you, you will deal a Basic attack to them. Their Last Will will be unreadable.',
			'With the Necronomicon, you have unlimited Crystals and will deliver a Basic attack to your target.',
		],
		targeting: ['living noncoven'],
		goal: covengoal,
		color: covencolor,
		custom: true,
	},
	{
		rolename: 'mystic',
		alignment: 'coven evil',
		attack: 'Basic',
		abilities: ['You may curse a player on even numbered nights.'],
		attributes: [
			'Curses last two nights or until someone is attacked by the curse.',
			'You will learn the roles that visit your cursed target and will attack one visitor.',
			'With the Necronomicon, you may curse every night and will attack any player that is freed from the curse.',
		],
		targeting: ['living noncoven notfirst'],
		goal: covengoal,
		color: covencolor,
		custom: true,
	},

	// NEUTRAL BENIGN CUSTOM
	{
		rolename: 'survivor overhaul',
		alignment: 'neutral benign',
		abilities: ['Visit one player each night, obtaining their wincon and redirecting all harmful visits from them onto yourself.'],
		attributes: [
			'You have a thick barrier that grants you Basic Defense until you are attacked.',
			'You may not visit someone the night after you change win conditions.',
			'You will be informed of your current win conditions.',
		],
		targeting: ['living other'],
		goal: 'Survive to see your most recent target win the game.',
		color: '#dddd00',
		custom: true,
	},
	{
		rolename: 'mercenary',
		alignment: 'neutral benign',
		abilities: ['Guard a player each night, granting them Powerful Defense against direct attacks.',
			    'Use your gun and stun a player twice per game, roleblocking them.'],
		attributes: [
			'If you save your target or no one visits them, you will become their partner and learn their faction.',
			'You may not protect the same player twice in a row.',
			'You will suicide if your target loses before the game ends.',
		],
		targeting: ['living other'],
		goal: 'See your partner win the game.',
		color: '#bf8000',
		custom: true,
	},
	{
		rolename: 'apprentice',
		alignment: 'neutral benign',
		abilities: ['You may choose to learn from a player at night.'],
		attributes: [
			'You will become the role you learn from.',
			'You cannot learn from someone Night 1.',
			'If you learn from a unique role, you will inherit their win condition and night chat until they die, upon which you will inherit their role.',
		],
		targeting: ['living other'],
		goal: 'Learn a role and complete that role\'s objective.',
		color: '#004953',
		custom: true,
	},
	{
		rolename: "harmony's angel",
		alignment: 'neutral benign',
		abilities: ['Watch over a player each night, granting them Powerful defense.'],
		attributes: [
			'When you protect a player they cannot be voted up the next day.',
			'You may protect when dead, however you have a one day cooldown.',
			'You may not protect yourself.',
		],
		targeting: ['living other'],
		dead_targeting: ['living'],
		goal: 'Save four people from attacks.',
		color: '#CFD4B4',
		custom: true,
	},
	{
		rolename: 'gambler',
		alignment: 'neutral benign',
		abilities: ['Bet on two people every night who are most likely to be killed and/or lynched.'],
		attributes: [
			'You may not bet on yourself.',
			'If you win a bet, you are able to bet again the next night and also choose between being able to distract a player, or obtaining a self-heal.',
			'If you lose a bet, you cannot do anything the next night.',
			'If you win 3 bets, you will die and win at the end of the game.',
		],
		targeting: ['living', 'living other'],
		goal: 'Bet correctly three times.',
		color: '#808080',
		custom: true,
	},
	{
		rolename: 'guardian angel rework',
		alignment: 'neutral benign',
		abilities: ['You may choose a player to make your charge during the day or at night.',
			    'Once a charge is chosen, you may protect them at night, Healing and Purging them and granting them Lynch Immunity.'],
		attributes: [
			'If the target is voted on trial, they will be pardoned regardless of the verdict.',
			'You may only protect twice. You may protect from the dead.',
			'If your target dies at night, you will die with them.',
		],
		day_targeting: ['living other'],
		targeting: ['living other'],
		dead_targeting: ['living other'],
		goal: 'Select a charge and see them survive to the end of the game.',
		color: '#FFFFFF',
		custom: true,
	},

	// NEUTRAL EVIL CUSTOM
	{
		rolename: 'scarecrow',
		alignment: 'neutral evil',
		abilities: ['You may stalk someone at night, scaring away anyone that visits them.'],
		attributes: ['You have a straw coat that grants you Basic defense until you are attacked.',
			     'You will know who your target visits.',
			     'You cannot be roleblocked.'],
		targeting: ['living other'],
		goal: 'Survive to see the Town lose the game.',
		color: '#BF4040',
		custom: true,
	},
	{
		rolename: 'dignitary',
		alignment: 'neutral evil',
		abilities: ['You may use a favor on two players at night.'],
		attributes: ['The favor you have choose will affect your targets if possible.',
			     'Revolt: Protective roles will fail to use their ability on others.',
			     'Masquerade: Investigative roles will fail to acquire any information on their targets.',
			     'Silent Night: Killing roles are unable to attack.',
			     'Barricade: Support roles are unable to use their abilities the next night.',
			     'You may not use the same favor twice in a row.'],
		targeting: ['living other', 'living other'],
		goal: 'Survive to see the Town lose the game.',
		color: '#e51c87',
		custom: true,
	},
	{
		rolename: 'executioner overhaul',
		alignment: 'neutral evil',
		abilities: ['You may mark a player at night. Marks last 2 days.'],
		attributes: ['You have a chainmail garment that grants you Basic Defense until you are attacked.',
			     'You will Interrogate your target when you visit them.',
			     'If a marked target is lynched the next day, you will gain the ability to roleblock or Pardon someone every night.',
			     'Pardoning a player will have their verdect be innocent if they are put on trial. You cannot Pardon yourself, or the same player twice in a row.'],
		targeting: ['living other'],
		goal: 'Survive to see the Town lose the game, or lynch a marked player in a game where Town loses.',
		color: '#CCCCCC',
		custom: true,
	},
	{
		rolename: 'fairy',
		alignment: 'neutral evil',
		abilities: ['Chose one player to trick during the day.'],
		attributes: ['You will learn your target\'s role at the beginning of the night.', 'You must send a notification to your target. If you do not send one, they will be notified of being roleblocked.', 'You may send any message, including role specific messages.'],
		day_targeting: ['living other'],
		goal: 'Survive to see the Town lose the game.',
		color: '#FF69B4',
		custom: true,
	},
	{
		rolename: 'witch rework',
		alignment: 'neutral evil',
		abilities: ['You may Control someone each night, learning a clue to their role.',
			    'During the day, you may choose a faction other than the Town to win with while dead.'],
		attributes: ['You have a mystical barrier that grants you Basic defense until you are attacked.',
			     'You may not Control the same player twice in a row.'],
		targeting: ['living other', 'living'],
		goal: 'Survive to see the Town lose the game.',
		color: 'covencolor',
		custom: true,
	},

	// NEUTRAL KILLING CUSTOM
	{
		rolename: 'butcher',
		alignment: 'neutral killing',
		abilities: ['Kill player(s) each night.', 'Start with two kills, and gain two more every 3rd night.'],
		attributes: [
			'You cannot be killed at night.',
			'Killing multiple players, you are role block immune.',
			'Killing a single player, you will clean them, but not be informed their information.',
			'You cannot kill the night following a clean kill.',
		],
		targeting: ['living other', 'living other'],
		goal: 'Kill everyone who would oppose you.',
		color: '#804040',
		custom: true,
	},
	{
		rolename: 'maniac',
		alignment: 'neutral killing',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['You may snap during the day and begin killing the townsfolk the following night.'],
		attributes: [
			'Once you have snapped, you may attack someone, killing them and anyone they visit.',
			'You Rampage when you attack.',
			'You will die three days after snapping if any opposing faction remains.',
		],
		day_targeting: ['self'],
		targeting: ['living other'],
		goal: 'Get revenge on the Town for how they treated you.',
		color: '#800073',
		custom: true,
	},
	{
		rolename: 'naiad',
		alignment: 'neutral killing',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may deluge a player at night, turning them into a ghost if they die.',
			    'You may instead visit a ghost, cleaning their role and will.'],
		attributes: [
			'Ghosts appear as alive despite being dead. Their will won\'t be revealed until they are visited by a player, are voted on trial, or are destroyed.',
			'You may only have two ghosts out at a time.',
			'If you attempt to make a third ghost, the oldest one is destroyed.',
		],
		targeting: ['living other'],
		goal: 'Kill anyone that would oppose you.',
		color: '#008080',
		custom: true,
	},
	{
		rolename: 'ekko',
		alignment: 'neutral killing',
		attack: 'Basic',
		defense: 'Invincible',
		abilities: ['Each Full Moon, select a player to possess their body, killing your previous host.'],
		attributes: [
			'You will possess a target, giving them your investigative results.',
			'If the Possessed player or the Ekko get hung, both will die.',
			'When Possessing a new target, the previous target will be attacked and the new target possessed.',
			'If possession fails, then the Ekko and previous host will die, and the new host will not be possessed.',
		],
		targeting: ['living other fullmoon'],
		goal: 'Kill everyone who would oppose you.',
		color: '#666666',
		custom: true,
	},
	{
		rolename: 'juggernaut rework',
		alignment: 'neutral killing',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['You may attack someone at night besides the first night.'],
		attributes: [
			'With each kill, your powers grow.',
			'On your first kill, you gain Roleblock and Control Immunity.',
			'On your second kill, you rampage when you attack.',
			'On your third kill, you lose your Detection Immunity and will ignore all effects that would protect a player.',
		],
		targeting: ['living other notfirst'],
		goal: 'Kill everyone who would oppose you.',
		color: '#A12B56',
		custom: true,
	},
	{
		rolename: 'parasite',
		alignment: 'neutral killing',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may choose a host to live off of at night or bite players with your charges.'],
		attributes: [
			'You gain two bite charges at the end of each night that you have a host.',
			'If your host dies, you will lose any bite charges and must select a new host.',
			'After biting someone you must select a new host.',
		],
		targeting: ['living other', 'living other'],
		goal: 'Kill anyone that would oppose you.',
		color: '#607020',
		custom: true,
	},
	{
		rolename: 'devil',
		alignment: 'neutral killing',
		attack: 'Unstoppable',
		defense: 'Basic',
		abilities: ['Make an offer to a player during the day, or exterminate all players who have sold you their soul at night.'],
		attributes: [
			'You can\'t exterminate the night you made an offer to someone the previous day.',
			'You will share a night chat with your previous day\'s target.',
			'Offered players can choose to sell their soul.',
			'You will deal a Powerful attack anyone who refuses to sell their soul.',
			'If you are alive and the number of collected souls including your own ever outnumbers the number of living players, the game will end in your victory.',
			'Anyone who is lynched or killed by a player other than you will have their soul liberated, even if you also attacked them in the same night.',
		],
		day_targeting: ['living other'],
		targeting: ['self'],
		goal: 'Kill anyone that would oppose you.',
		color: '#800000',
		custom: true,
	},
	{
		rolename: 'patient',
		alignment: 'neutral killing',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['You may attack a player on Odd Nights, preventing their role and Last Will from being revealed.'],
		attributes: [
			'You will Devour one player that visits you.',
			'If you do not select a target, you will attack someone at random.',
			'You will Devour anyone that visits you even if you are roleblocked.',
			'Devoured victims will have their role and Last Will destroyed. Their alignment will be revealed.',
		],
		targeting: ['living other odd'],
		goal: 'Devour all who occupy the town.',
		color: '#808000',
		custom: true,
	},
	{
		rolename: 'fenrir',
		alignment: 'neutral killing',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['You may stalk two targets at night.',
			    'Choose whether to activate Overdrive or Bloodlust.'],
		attributes: [
			'When in Overdrive, you will attack both your targets if they win together.',
			'When in Bloodlust, you will attack both your targets if they do not win together.',
			'You must wait a night after successfully attacking players twice in a row.',
		],
		targeting: ['living other', 'living other'],
		goal: 'Devour all who occupy the town.',
		color: '#884010',
		custom: true,
	},

	// NEUTRAL CHAOS CUSTOM
	{
		rolename: 'conqueror',
		alignment: 'neutral chaos',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may attack a player and heal another player at night.'],
		attributes: ['You may not heal yourself.', 'You only win if every other faction is reduced to a single member. At least two other factions must survive.'],
		targeting: ['living other', 'living other'],
		goal: 'Successfully Conquer the Town.',
		color: '#274ba3',
		custom: true,
	},
	{
		rolename: 'huntsman',
		alignment: 'neutral chaos',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ["Choose your prey during the day, then camp outside someone's house at night."],
		attributes: [
			'You will kill your prey if they visit your target.',
			'If you are attacked, you will instead attack you attacker.',
			'If someone attacks your target, you will protect them, counter the attacker, and lose your defense.',
			'If you protect someone twice, you will die.',
		],
		day_targeting: ['living other'],
		targeting: ['living other'],
		goal: 'Successfully kill one of your prey.',
		color: '#521421',
		custom: true,
	},
	{
		rolename: 'pirate overhaul',
		alignment: 'neutral chaos',
		attack: 'Powerful',
		abilities: ['You may duel someone at night, roleblocking them and plundering all of their visitors.'],
		attributes: [
			'If you duel a plundered player, you will attack them.',
			'If you duel a player three times, you will attack them.',
			'You will learn the roles of the players that visit your target.',
		],
		targeting: ['living other'],
		goal: 'Successfully loot from 3 plundered players.',
		color: '#EDC240',
		custom: true,
	},
	{
		rolename: 'reaper',
		alignment: 'neutral chaos',
		attack: 'None',
		defense: 'Basic',
		abilities: ['Taint one player\'s soul each night, granting them Powerful Defense until you die.'],
		attributes: [
			'If no one dies for two consecutive nights, everyone will be notified of your existence at the start of the day.',
			'If you are not lynched the day your existence is revealed, you will automatically win the game.',
			'When you die, anyone who would have otherwise died if not for your protections will be dealt an astral unstoppable attack the following night.',
		],
		targeting: ['living other'],
		goal: 'Kill all who oppose your reign.',
		color: '#401060',
		custom: true,
	},
	{
		rolename: 'heliolater',
		alignment: 'neutral chaos',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may watch over someone at night, Burning them and all of their visitors.'],
		attributes: [
			'You will Burn anyone that visits you.',
			'Burns have 3 levels. On the third burn, the burned player will be dealt a Basic Attack. You will know who is burned and what level of burn they have.',
			'If you have Gravity anybody that visits you or your target will receive 2 levels of Burn.',
		],
		targeting: ['living other'],
		goal: 'Eliminate all those that contradict your beliefs.',
		color: '#c48900',
		custom: true,
	},
	{
		rolename: 'selenolater',
		alignment: 'neutral chaos',
		attack: 'Powerful',
		defense: 'Basic (Shield)',
		abilities: ['You may redirect a player\'s visitors to another player at night.'],
		attributes: [
			'If you reflect a player into themselves you will crush them, dealing a Powerful attack.',
			'You may not crush twice in a row.',
			'If you have Gravity your crush no longer has a cooldown and you will regenerate your auto-vest if it was previously broken.',
		],
		targeting: ['living other', 'living other'],
		goal: 'Eliminate all those that contradict your beliefs.',
		color: '#95a6bd',
		custom: true,
	},
	{
		rolename: 'wizard',
		alignment: 'neutral chaos',
		abilities: ['You may cast a spell on someone at night to turn them into a bear, rat, or bird.'],
		attributes: [
			'You have a mystical barrier that grants Basic Defense until you are attacked.',
			'The bear forces the target to deal a basic rampage to whoever they visit. If the target does not visit anyone, they will rampage at home instead (single use).',
			'The rat forces the target to roleblock whoever they visit.',
			'The bird will let you know the role of whoever the target visits. If the target does not visit anyone, you will learn their role instead.',
			'The rat and bird spells have a one night cooldown.',
		],
		targeting: ['living other'],
		goal: 'Survive to see the Town lose the game.',
		color: '#4B99C5',
		custom: true,
	},
	{
		rolename: 'paradoxist',
		alignment: 'Neutral Chaos',
		abilities: ['Visit a player to send them backwards in time, roleblocking but also healing them. Visting a second time kills them.'],
		attributes: [
			"Your initial time is 8 o'clock.",
			'Visiting a Town member will send your clock forward 5 hours.',
			'Visiting a member of the Mafia will send your clock forward 3 hours.',
			'Visiting any Neutral role will send your clock backwards 2 hours.',
		],
		targeting: ['living other'],
		goal: "Land your clock on 12 o'clock to win",
		color: 'magenta',
		custom: true,
	},
	{
		rolename: 'niran',
		alignment: 'neutral chaos',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['You may channel someone\'s divine energy at night.'],
		attributes: ['.',
		],
		targeting: ['living other'],
		goal: 'Survive to see the Town and the Gods lose the game.',
		color: '#8080BF',
		custom: true,
	},
	
	// NEUTRAL SAINT CUSTOM
	{
		rolename: 'stain',
		alignment: 'neutral saint',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may stalk a person on Full Moon nights, marking them and whoever they visit.'],
		attributes: ['You are able to mark a player the next two nights after you stalk someone.',
			'Every third night starting on Night 4, you will attack all marked players, along with dealing a Basic attack to your target.',
			'If you are roleblocked, all marks are removed and you will deal a Powerful attack to your roleblocker. Their Last Will will be unreadable.',
			'If you take no action, you will spend the night removing any mark on yourself.',
		],
		targeting: ['living other'],
		goal: 'Successfully kill 5 people and become War.',
		color: '#800000',
		custom: true,
	},
	{
		rolename: 'hood',
		alignment: 'neutral saint',
		abilities: ['You may drain a player during the day, roleblocking them the following night.',
			    'Give out supplies to someone at night, giving them an extra vote the next day.'],
		attributes: ['Drained players can transfer their drainage by visiting another player.',
			'Anyone who visits you will become Drained.',
			'At the end of each night, you gain 1 stamp for every living Drained player.',
		],
		day_targeting: ['living other'],
		targeting: ['living other'],
		goal: 'Get 8 stamps and become Famine.',
		color: '#538135',
		custom: true,
	},
	{
		rolename: 'weakness',
		alignment: 'neutral saint',
		attack: 'None',
		defense: 'Basic',
		abilities: ['You may damn a player on Full Moon nights.'],
		attributes: ['Damned players will have their abilities weakened.',
			'Damned players won\'t know they were damned.',
			'When half of the players alive are damned, you will become Conquest.',
		],
		targeting: ['living other fullmoon'],
		goal: 'Sucessfully damn half of the players alive and become Conquest.',
		color: '#CC3399',
		custom: true,
	},
	{
		rolename: 'warrior',
		alignment: 'neutral saint',
		attack: 'Basic',
		abilities: ['You may attack a player at night.'],
		attributes: ['If your target is directly attacked, you will attack their attackers instead.',
			'With each kill you will power up.',
			'When you kill 4 players, you will become Wrath.',
		],
		targeting: ['living other'],
		goal: 'Sucessfully kill 4 players and become Wrath.',
		color: '#C86B04',
		custom: true,
	},
	{
		rolename: 'pander',
		alignment: 'neutral saint',
		attack: 'None',
		defense: 'Basic',
		abilities: ['You may check two players at night, making them lovers if they share the same win conditions.'],
		attributes: ['Lovers will learn that they have a lover, but not who it is.',
			'With each lover that is created you power up.',
			'When there are five lovers alive, you will become Lust.',
		],
		targeting: ['living other', 'living other'],
		goal: 'Sucessfully have 5 people become lovers and become Lust.',
		color: '#FF9999',
		custom: true,
	},
	{
		rolename: 'webslinger',
		alignment: 'neutral saint',
		attack: 'Basic',
		defense: 'Basic',
		abilities: ['You may cast a web on someone at night, preventing them from talking or voting.'],
		attributes: ['Webs last two nights or if a player with a web is visited or voted up.',
			'You will deliver a Basic Attack if you visit a webbed player.',
			'At the end of each night, you gain 1 token for each player that is webbed.',
		],
		targeting: ['living other'],
		goal: 'Sucessfully earn 7 tokens and become Sloth.',
		color: '#E7E6E6',
		custom: true,
	},
	{
		rolename: 'king midas',
		alignment: 'neutral saint',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['You may turn someone to gold at night, hiding their role and Last Will upon death.'],
		attributes: ['If you do not choose someone to turn to gold, one will be selected at random.',
			'If your gold touch fails by any means, you will turn half of yourself to gold.',
			'You will deal an Unstoppable attack to yourself if your gold touch fails twice.',
		],
		targeting: ['living other'],
		goal: 'Sucessfully turn 3 players to gold and become Greed.',
		color: '#BF8F00',
		custom: true,
	},
	{
		rolename: 'cannibal',
		alignment: 'neutral saint',
		attack: 'Powerful',
		abilities: ['You may question a player during the day, making them choose an ingredient the following night.'],
		attributes: ['You may pick two ingredients: Meat, Spices, or Vegetables. If your target picks one of the two you picked, you will attack them.',
			'You gain a power based on the role of your last victim was.',
		],
		day_targeting: ['living other'],
		targeting: ['living other'],
		goal: 'Sucessfully turn 3 players to gold and become Greed.',
		color: '#CCCC00',
		custom: true,
	},
	{
		rolename: 'celebrity',
		alignment: 'neutral saint',
		attack: 'None',
		defense: 'Basic',
		abilities: ['You may give an autograph to someone at night, making them idolize you.'],
		attributes: ['Your power grows based on how many people are idolized.',
			'If everyone alive is idolized, the game will end and you will win.',
		],
		targeting: ['living other'],
		goal: 'Idolize 7 people and become Pride.',
		color: '#C45911',
		custom: true,
	},
	{
		rolename: 'thought',
		alignment: 'neutral saint',
		abilities: ['You may place a thought in someone\'s mind at night, confusing them.'],
		attributes: ['You gain a new power for each player that has a thought.',
			     'If 5 people have a thought of yours, you will become Envy.',
		],
		targeting: ['living other'],
		goal: 'Sucessfully give thoughts to 5 people and become Envy.',
		color: '#8EAADB',
		custom: true,
	},
	
	// GOD HORSEMAN CUSTOM
	{
		rolename: 'war',
		alignment: 'god horseman',
		abilities: ['.'],
		attributes: ['.',
		],
		targeting: ['living other'],
		goal: 'Kill all who would oppose you.',
		color: '#FF0000',
		custom: true,
	},
	{
		rolename: 'famine',
		alignment: 'god horseman',
		abilities: ['.'],
		attributes: ['.',
		],
		targeting: ['living other'],
		goal: 'Kill all who would oppose you.',
		color: '#E7E6E6',
		custom: true,
	},
	{
		rolename: 'conquest',
		alignment: 'god horseman',
		abilities: ['.'],
		attributes: ['.',
		],
		targeting: ['living other'],
		goal: 'Kill all who would oppose you.',
		color: '#3F193A',
		custom: true,
	},
	
	// GOD DEADLY SIN
	{
		rolename: 'wrath',
		alignment: 'god deadly sin',
		attack: 'Powerful',
		defense: 'Basic',
		abilities: ['You may attack a player at night.'],
		attributes: ['You will kill anyone that visits your target.',
		],
		targeting: ['living other'],
		goal: 'Kill all who would oppose you.',
		color: '#C00000',
		custom: true,
	},
	{
		rolename: 'lust',
		alignment: 'god deadly sin',
		attack: 'Powerful',
		defense: 'Invincible',
		abilities: ['You may check two players at night, making them lovers if they share the same win conditions.'],
		attributes: ['Lovers will learn that they have a lover, but not who it is.',
			     'When all players alive are lovers, you may kill someone at night, killing them and their lover.',
		],
		targeting: ['living other'],
		goal: 'Kill all who would oppose you.',
		color: '#FF66FF',
		custom: true,
	},
	{
		rolename: 'sloth',
		alignment: 'god deadly sin',
		attack: 'Unstoppable',
		defense: 'Basic',
		abilities: ['You may cast a web on someone at night, preventing them from talking or voting.'],
		attributes: ['Webs last two nights or if a player with a web is visited or voted up.',
			'You will deliver an Unstoppable attack if you visit a webbed player.',
			'Anyone that visits you will have their ability fail and will become webbed.',
		],
		targeting: ['living other'],
		goal: 'Kill all who would oppose you.',
		color: '#F0F0F0; text-shadow: 0px 0px 5px #000000',
		custom: true,
	},
	{
		rolename: 'greed',
		alignment: 'god deadly sin',
		attack: 'Unstoppable',
		defense: 'Powerful',
		abilities: ['You may turn a player into gold at night, hiding their role and Last Will upon death.'],
		attributes: ['If you do not choose someone to turn to gold, one will be selected at random.',
			     'You will turn anyone that visits you into gold.',
			     'You will deal an Unstoppable attack to yourself if your gold touch fails twice.',
		],
		targeting: ['living other'],
		goal: 'Kill all who would oppose you.',
		color: '#FFFF00; text-shadow: 0px 0px 5px #964B00',
		custom: true,
	},

	// VAMPIRE CUSTOM
	{
		rolename: 'adze',
		alignment: 'vampire killing',
		attack: 'Basic',
		abilities: ['You may choose a target to drain blood from at night.', 'You can mask your true identity upon killing.'],
		attributes: ['Killing your target replaces your Investigator and Consigliere results with that of your drained target.', 'You can talk to the other Vampires at night.'],
		targeting: ['living nonvampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'bebarlang',
		alignment: 'vampire killing',
		attack: 'Basic',
		abilities: ['You may choose a target to drain blood from at night.'],
		attributes: ['You cannot go 2 nights without feasting, otherwise you die.', 'Your visits are Astral.', 'You can talk to the other Vampires at night.'],
		targeting: ['living nonvampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'lampir',
		alignment: 'vampire killing',
		attack: 'Basic',
		abilities: ['You may choose a target to drain blood from at night.'],
		attributes: ['If you are roleblocked you will attack your roleblocker instead of your original target. Their Last Will will be unreadable.',
					 'You can talk to the other Vampires at night.'],
		targeting: ['living nonvampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'catacano',
		alignment: 'vampire conversion',
		attack: 'Basic',
		abilities: ['You may infect a player at night.'],
		attributes: [
			'You may only infect someone on an Odd night.',
			'Infecting someone grants them Invincible defense the following nights until they are attacked. If an infected target would die from an attack they will become a Progeny.',
			'You will know your newest Progeny’s notifications.',
			'If there are no kill capable Vampire roles left you will become a Lampir.',
		],
		targeting: ['living nonvampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'progeny',
		alignment: 'vampire conversion',
		attack: 'Basic',
		abilities: ["Carry out the Catacano's orders."],
		attributes: [
			"The youngest Progeny will carry out the Catacano's order.",
			'The oldest Progeny becomes the new Catacano one night after the Catacano dies.',
			'If there are no kill capable Vampire roles left you will become a Lampir.',
		],
		targeting: [],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'savior',
		alignment: 'vampire conversion',
		abilities: ['You may protect a player at night, granting your target Powerful defense.'],
		attributes: [
			'If your target is attacked, reflect one attacker\'s attack. The other attackers will not know of this.',
			'If you save your target from an attack they ares converted into a Devoted.',
			'You cannot protect Night 1.',
			'If you successfully convert someone, you must wait a day before protecting again.',
		],
		targeting: ['living nonvampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'devoted',
		alignment: 'vampire support',
		abilities: ['You may use the abilities you had before your were converted.'],
		attributes: [
			'You will gain all passive abilities your role had before conversion when using your ability.',
			'You may only use an ability once.',
			'You will become the Savior if the Savior dies.',
		],
		targeting: ['living'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'pijavica',
		alignment: 'vampire manipulation',
		abilities: ['You may veil the sky at night, hiding what each player votes during trials the next day.'],
		attributes: [
			'You can hear private messages.',
			'Only you will learn what each player votes during trials.',
			'You may not veil twice in a row.'
		],
		targeting: ['self'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'nelapsi',
		alignment: 'vampire manipulation',
		abilities: ['Select two players at night and soulbind them.'],
		attributes: [
			'Both players will visit the same target as the first player chosen.',
			'You may only soul bind 2 new target after both die, or you set them free (takes 1 night).',
			'If one bound player dies the other one dies at night.',
		],
		targeting: ['living nonvampire', 'living nonvampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'broxa',
		alignment: 'vampire support',
		abilities: ['Lull a target into a false sense of security at night.'],
		attributes: [
			'By selecting a target you create a delayed roleblock.',
			'If you die, your lull fails.',
			'Anyone who visits you is lulled into a false sense of security.',
			'If there are no kill capable Vampire roles left you will become a Lampir.',
		],
		targeting: ['living nonvampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'gierach',
		alignment: 'vampire support',
		abilities: ['You may track a player at night to see who they visit.'],
		attributes: [
			'You will know if that player you track has killed before.',
			'You can talk to the other Vampires at night.',
			'If there are no kill capable Vampire roles left you will become a Lampir.',
		],
		targeting: ['living nonvampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	{
		rolename: 'talamaur',
		alignment: 'vampire support',
		abilities: ['You may consume a soul from the Graveyard to use as a magical shield for itself or kin.'],
		attributes: [
			'Selecting a Corpse at night destroys the Corpse, and uses it to shield a Vampire.',
			'Corpses grant Vampires Basic defense against one attack.',
			'You can talk to the other Vampires at night.',
			'If there are no kill capable Vampire roles left you will become a Lampir.',
		],
		targeting: ['dead', 'living vampire'],
		goal: vampgoal,
		color: vampcolor,
		custom: true,
	},
	
	// FLORAE INVESTIGATIVE
	{
		rolename: 'daffodil',
		alignment: 'florae investigative',
		abilities: ['You may search a player for a clue of their role.'],
		attributes: ['If your target is Doused, Framed, Disguised, or Hexed you will instead be told you are unsure what your target is.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'hydrangea',
		alignment: 'florae investigative',
		abilities: ['You may dance during the day to summon a rainstorm for the night.'],
		attributes: ['Mafia, Coven, and Neutrals will be notified that a storm is starting at the beginning of the night.',
			    'Players that visit during a rainstorm will be drenched in water.',
			    'You will be told all of the players who are not drenched the following day.',
			    'You may only summon 2 rainstorms.'],
		day_targeting: ['self notfirst'],
		targeting: [],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'iris',
		alignment: 'florae investigative',
		abilities: ['You may observe someone at night.'],
		attributes: ['On odd nights you will know who visits your target.',
			    'On even nights you will know who your target visits.',
			    'When dead, you may select a player once to give them your previous result.'],
		targeting: ['living other'],
		dead_targeting: ['living'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'sage',
		alignment: 'florae investigative',
		abilities: ['You may inspect a player at night.'],
		attributes: ['Each night you are alive, you will be told how many Florae are still alive.',
			    'The player you inspect will not be included in your count.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'thyme',
		alignment: 'florae investigative',
		abilities: ['You may spy on someone\'s house at night.'],
		attributes: ['You will know all the roles of the players that visit your target.',
			    'Your visit is Astral and ignores Jail.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	
	// FLORAE KILLING
	{
		rolename: 'azalea',
		alignment: 'florae killing',
		attack: 'Powerful',
		abilities: ['You may shoot a target at night, dealing a Powerful attack.'],
		attributes: ['If someone visits your target, you will shoot them instead.',
			    'If more than one player visits your target, you will shoot no one.',
			    'You may only shoot two times.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'dahlia',
		alignment: 'florae killing',
		attack: 'Basic',
		abilities: ['You may inspect a player during the day.',
			   'Choose another to players at night to watch.'],
		attributes: ['You will attack your day target if they visit either of your night targets.',
			    'You may watch yourself.',
			    'When dead, you may choose a player at night to deliver a Basic attack to them. This can only be done once.'],
		day_targeting: ['living other'],
		targeting: ['living', 'living'],
		dead_targeting: ['living'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'nettle',
		alignment: 'florae killing',
		attack: 'Powerful',
		abilities: ['You may urticate a player at night, stinging anyone that visits them.'],
		attributes: ['Stings take one day to take effect.',
			    'Stings can be removed by protections that grant Powerful defense.',
			    'You may not urticate the same player twice.',
			    'You may only urticate two times.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'wisteria',
		alignment: 'florae killing',
		attack: 'Powerful',
		abilities: ['You may choose one person during the day to lock in your Garden for the night, giving them Basic defense.'],
		attributes: ['You may anonymously talk with your captive at night.',
			    'Players can still visit your captive.',
			    'You may not lock the same person twice in a row.',
			    'You may only execute two times.'],
		day_targeting: ['living other'],
		targeting: ['entangled notfirst'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	
	// FLORAE PROTECTIVE
	{
		rolename: 'calendula',
		alignment: 'florae protective',
		abilities: ['You may aid a player at night, granting them Powerful Defense.'],
		attributes: ['You will know the roles of the players that attack your target.',
			    'If your target is attacked, they will not know that they were attacked.',
			    'You will know if your target is attacked.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'lavender',
		alignment: 'florae protective',
		attack: 'Basic',
		abilities: ['You may protect a player\'s house at night, providing Power Defense against one attack.'],
		attributes: ['You will know if your target was attacked.',
			    'If your target is attacked you attack anyone that visits your target.',
			    'You will know how many people you attack.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'lily',
		alignment: 'florae protective',
		abilities: ['You may plant a lily at a player\'s house on odd nights.'],
		attributes: ['Lilies heal your target and all of their visitors.',
			    'You cannot be protected by lilies.',
			    'When dead, you may plant a lily once.'],
		targeting: ['living other odd'],
		dead_targeting: ['living other odd'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'mint',
		alignment: 'florae protective',
		abilities: ['You may sow a mint plant at a player\'s house at night.'],
		attributes: ['Mint plants take effect the day after they were planted.',
			    'Mints provide Powerful defense against all direct attacks.',
			    'When one of your minted targets is attacked, all mint plants will die and you cannot plant for another night.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'rosemary',
		alignment: 'florae protective',
		abilities: ['You may infuse a player at night, granting them Basic defense.'],
		attributes: ['When you infuse a player they will have Roleblock and Control immunity that night.',
			    'If your target is attacked you cannot infuse a player the next night.',
			    'You cannot be roleblocked or controlled.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	
	// FLORAE SUPPORT
	{
		rolename: 'dicentra',
		alignment: 'florae support',
		abilities: ['You may perform for a player at night.'],
		attributes: ['Performing at a player\'s house prevents anyone from visiting your target. This excludes attacking roles.',
			    'If a Serial Killer attacks your target, you will die instead.',
			    'You cannot be roleblocked.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'gardenia',
		alignment: 'florae support',
		abilities: ['You may hand out gardenias to a player at night.'],
		attributes: ['Players with gardenias will also give out gardenias when they visit or are visited by a player.',
			    'When all living players have a gardenia, you will have the ability to reveal during the day.',
			    'Once you reveal, your vote counts as three.',
			    'Once you reveal you can hear whispers.'],
		targeting: ['living other'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'nightshade',
		alignment: 'florae support',
		attack: 'Basic',
		abilities: ['You may use a heal or attack tonic at night.'],
		attributes: ['Attacking a player uses up your attack tonic.',
			    'Successfully healing a player from an attack uses up your heal tonic.',
			    'You may heal yourself once.',
			    'Visiting one player recharges your tonics once you have used them up.'],
		targeting: ['living'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	{
		rolename: 'phlox',
		alignment: 'florae support',
		abilities: ['You may purify a player at night, automatically pardoning any of their trials the next day.'],
		attributes: ['When a player is purified they cannot be lynched the next day.',
			    'You may purify yourself once.',
			    'You may only purify three times.'],
		targeting: ['living'],
		dead_targeting: ['living'],
		goal: floraegoal,
		color: floraecolor,
		custom: true,
	},
	
	// POSITIVE HEAD
	{
		rolename: 'beacon',
		alignment: 'positive head',
		attack: 'None',
		defense: 'Basic',
		abilities: ['You may set up a beacon at someone\'s house at night, positively charging them and learning the roles of all of their visitors.'],
		attributes: ['Negative players will know who you target.',
			     'You may target other Positive players.',
			     'You may not target yourself.',
			     'When you are promoted to Killing, you will become the Battery.'],
		targeting: ['living other'],
		goal: electricgoal,
		color: positivecolor,
		custom: true,
	},
	{
		rolename: 'sensor',
		alignment: 'positive head',
		attack: 'None',
		defense: 'Basic',
		abilities: ['Every night, you may choose to charge a player Positively who isn\'t currently Negatively charged.'],
		attributes: ['You will know who is Negatively charged.',
			     'Every night you will receive the feedback of Negative players.',
			     'You know the roles of the Negative players.',
			     'When you are promoted to Killing, you will become the Static.'],
		targeting: ['living nonnegative'],
		goal: electricgoal,
		color: negativecolor,
		custom: true,
	},
	
	// POSITIVE KILLING
	{
		rolename: 'battery',
		alignment: 'positive killing',
		abilities: ['You may charge an uncharged player with Positive energy at night.',
			    'You may instead steal Positive charge off of a player at night, upgrading your attack and removing their charge.'],
		attributes: ['When you steal a player\'s Positive energy, you will attack them.',
			     'You will be able to upgrade to rampage after upgrading to Powerful attack.',
			     'You cannot gain Unstoppable attacks.'],
		targeting: ['living nonpositive'],
		goal: electricgoal,
		color: positivecolor,
		custom: true,
	},
	{
		rolename: 'static',
		alignment: 'positive killing',
		attack: 'Basic',
		abilities: ['Every night you may kill a player by shocking them.'],
		attributes: ['You will passively charge players with Positive energy if they visit you.'],
		targeting: ['living nonpositive'],
		goal: electricgoal,
		color: positivecolor,
		custom: true,
	},
	
	// POSITIVE SUPPORT
	{
		rolename: 'conduit',
		alignment: 'positive support',
		abilities: ['Every night you may redirect all actions off of one player and onto another.'],
		attributes: ['Your first target is Positively charged.',
			     'All players will be unaware they were re-directed.',
			     'You are roleblock, overload and control immune.',
			     'When you are promoted to Killing, you will become the Battery.'],
		targeting: ['living nonpositive', 'living nonpositive'],
		goal: electricgoal,
		color: positivecolor,
		custom: true,
	},
	{
		rolename: 'speaker',
		alignment: 'positive support',
		abilities: ['At night, you may visit a player and Deafen them. Deafened players won\'t know they were deafened, and cannot hear whispers or the Speaker.'],
		attributes: ['Deafened players will not receive any night-time feedback.',
			     'If a deafened player whispers, everyone will be able to read their whisper.',
			     'You will Positively charge players when you visit them.',
			     'When you are promoted to Killing you will become the Static.'],
		targeting: ['living nonpositive'],
		goal: electricgoal,
		color: positivecolor,
		custom: true,
	},
	
	// NEGATIVE HEAD
	{
		rolename: 'camera',
		alignment: 'negative head',
		attack: 'None',
		defense: 'Basic',
		abilities: ['You may Negatively charge someone at night.'],
		attributes: ['You will know who visits your target, and who your target visits.',
			     'If a player you see visiting is Negatively charged, you will know their role as well.',
			     'When you are promoted to Killing, you will become the Defibrillator.'],
		targeting: ['living other'],
		goal: electricgoal,
		color: negativecolor,
		custom: true,
	},
	{
		rolename: 'insulator',
		alignment: 'negative head',
		attack: 'None',
		defense: 'Basic',
		abilities: ['You may Negatively charge someone and turn away all of their visitors at night.'],
		attributes: ['Turned away players will not be informed they were turned away. They will not use up limited use abilities, however.',
			     'Positive players will be notified when you visit them, and will know you identity.',
			     'You will prevent your target from being executed by the Jailor. They will be notified.',
			     'When you are promoted to Killing, you will become the Generator.'],
		targeting: ['living other'],
		goal: electricgoal,
		color: negativecolor,
		custom: true,
	},
	
	// NEGATIVE KILLING
	{
		rolename: 'defibrillator',
		alignment: 'negative killing',
		attack: 'Basic',
		abilities: ['Every night you may Negatively charge two players or visit a Negatively charged player.'],
		attributes: ['If you visit a Negatively charged player, you will attack them.'],
		targeting: ['living nonnegative', 'living nonnegative'],
		goal: electricgoal,
		color: negativecolor,
		custom: true,
	},
	{
		rolename: 'generator',
		alignment: 'negative killing',
		attack: 'Basic',
		abilities: ['You may use a charge at night to attack a player.'],
		attributes: ['You start with one charge at the beginning of the game.',
			     'If you stay home, you will charge up 2 power.',
			     'You will passively charge anyone with Negative who visits you.',
			     'Anyone you kill will have their Last Will unreadable upon death.'],
		targeting: ['living nonnegative'],
		goal: electricgoal,
		color: negativecolor,
		custom: true,
	},
	
	// NEGATIVE SUPPORT
	{
		rolename: 'display',
		alignment: 'negative support',
		abilities: ['You may tinker with someone\'s role for the night, Negatively charging them.'],
		attributes: ['If your target is lynched the next day, they will appear as the role you selected.',
			     'Mafia/Coven/Electric have their visits seen by the Spy.',
			     'Tinkered players won\'t show up to the Lookout, Tracker, or Psychic.',
			     'You will fool the Sheriff, Investigator, Trapper, Consigliere, and Potion Master.',
			     'When you are promoted to Killing, you will become the Generator.'],
		targeting: ['living'],
		goal: electricgoal,
		color: negativecolor,
		custom: true,
	},
	{
		rolename: 'receiver',
		alignment: 'negative support',
		abilities: ['You may place or remove a receiver at a player\'s house at night.'],
		attributes: ['Receivers let you see who your targets visit and any notifications they would get.',
			     'You will not know who the info given belongs to if both your Receivers have been placed.',
			     'You can only have 2 receivers out at a time.',
			     'When you are promoted to Killing, you will become the the Defibrillator.'],
		targeting: ['living nonpositive'],
		goal: electricgoal,
		color: negativecolor,
		custom: true,
	},
	
	// Casual roles
	{
		rolename: 'citizen',
		alignment: 'town casual',
		abilities: ['Your only ability is your vote.'],
		attributes: ['Without the burden of power to weigh you down, you exhibit superior logic and deductive abilities.'],
		targeting: [],
		goal: towngoal,
		color: towncolor,
		custom: true,
	},
	{
		rolename: 'cleaned',
		alignment: 'random dead',
		abilities: ['None.'],
		attributes: ['You were cleaned by a Janitor.', 'Your Role and Last Will could not be determined.'],
		goal: 'Complete your original goal while dead.',
		color: neutcolor,
		custom: true,
	},
	{
		rolename: 'stoned',
		alignment: 'random dead',
		abilities: ['None.'],
		attributes: ['You were stoned by Medusa.', 'Your Role and Last Will could not be determined.'],
		goal: 'Complete your original goal while dead.',
		color: neutcolor,
		custom: true,
	},
	{
		rolename: 'wave',
		alignment: 'mystical overseer',
		abilities: ['You are the heart of the everlasting nostalgia of Xinopha.'],
		attributes: ['You are everything you can be; all you have to do is believe.'],
		goal: 'Figure out who you are while you are still you.',
		color: '#008888',
		custom: true,
	},
	{
		rolename: 'sally',
		alignment: 'mystical overseer',
		abilities: ['You are the Beegirl of the world! Buzz-buzz.'],
		attributes: ['You are everything you can be; all you have to do is believe.'],
		goal: 'Charm everyone with your dazzling sparkle.',
		color: '#A460AC',
		custom: true,
	},
	{
		rolename: 'host',
		alignment: 'mystical overseer',
		abilities: ['Your powers have no limit.'],
		attributes: ['None.'],
		goal: "Don't screw up this test!",
		color: '#ADD8E6',
		custom: true,
	},
	{
		rolename: 'afk',
		alignment: 'neutral casual',
		abilities: ['Die before the game has started.'],
		attributes: ['You have lost automatically.'],
		goal: 'None.',
		color: '#B05F3C',
		custom: true,
	},
	{
		rolename: 'spectator',
		alignment: 'neutral casual',
		abilities: ['You know everything.'],
		attributes: ['You can do nothing.'],
		goal: 'See how the game progresses.',
		color: '#82c6fa',
		custom: true,
	},
	{
		rolename: 'late',
		alignment: 'neutral unlucky',
		abilities: ['You were too late.'],
		attributes: ['Please wait patiently for the current game to end.'],
		goal: 'Wait for a new game to start.',
		color: '#FE00EF',
		custom: true,
	},
];
var unique = [
	'jailor',
	'mayor',
	'retributionist',
	'veteran',
	'godfather',
	'mafioso',
	'ambusher',
	'juggernaut',
	'werewolf',
	'coven leader',
	'medusa',
	'potion master',
	'hex master',
	'necromancer',
	'poisoner',
	'pirate',
	'plaguebearer',
	'pestilence',
];

function getAttributes(num) {
	var str = '<br><div>';
	var arr = roles[num].attributes;
	for (var i = 0; i < arr.length; i++) {
		str += "<span id='attribute'>-" + arr[i] + '</span><br>';
	}
	return str + '</div>';
}
function getAbilities(num) {
	var str = '<br><div>';
	var arr = roles[num].abilities;
	for (var i = 0; i < arr.length; i++) {
		str += "<span id='attribute'>-" + arr[i] + '</span><br>';
	}
	return str + '</div>';
}
function getAttack(num) {
    return roles[num].attack || 'None';
}
function getDefense(num) {
    return roles[num].defense || 'None';
}
function format(str) {
	var color;
	for (i = 0; i < roles.length; i++) {
		if (roles[i].rolename == str) {
			color = roles[i].color;
		}
	}
	if (color == undefined) {
		color = 'black';
	}
	var strings = str.split(' ');
	str = '';
	for (x = 0; x < strings.length; x++) {
		strings[x] = strings[x].substring(0, 1).toUpperCase() + strings[x].substring(1, strings[x].length) + ' ';
		str += strings[x];
	}
	return "<h2 style='color:" + color + "'>" + str + '</h2>';
}
function shuffle(list) {
	for (i = 0; i < list.length; i++) {
		swap(list, i, randNum(list.length));
	}
}
function swap(list, x, y) {
	var temp = list[x];
	list[x] = list[y];
	list[y] = temp;
}
function lowerAll(arr) {
	var lowered = [];
	for (i = 0; i < arr.length; i++) {
		lowered[i] = arr[i].toLowerCase();
	}
	return lowered;
}
function capitalize(str) {
	var strings = str.split(' ');
	str = '';
	for (x = 0; x < strings.length; x++) {
		strings[x] = strings[x].substring(0, 1).toUpperCase() + strings[x].substring(1, strings[x].length) + ' ';
		str += strings[x];
	}

	return str.trim();
}
function randNum(num) {
	return Math.floor(Math.random() * num);
}
function getRoleNum(name) {
	for (var i = 0; i < roles.length; i++) {
		if (roles[i].rolename == name) {
			return i;
		}
	}
	return -1;
}
module.exports = {
	sortRoles: function (r, customRolesRollable, exceptions) {
		r = lowerAll(r);
		for (i = 0; i < r.length; i++) {
			var matches = roles.filter(function (elem) {
				if (elem.alignment == r[i] || (r[i] == 'any' && elem.alignment.split(' ')[1] != 'casual')) {
					//prevent casual rolling as any
					if (elem.alignment == r[i] || (r[i] == 'any' && elem.alignment.split(' ')[1] != 'unlucky')) {
						if (elem.alignment == r[i] || (r[i] == 'any' && elem.alignment.split(' ')[1] != 'trueEvil')) {
							//Ensure custom rolls only roll as any if they are enabled.
							if (!customRolesRollable) {
								if (elem.custom) {
									//Nope! Not rolling
								} else {
									return true;
								}
							} else {
								return true;
							}
						}
					}
				} else if (r[i].split(' ')[0] == 'random') {
					var splitr = r[i].split(' ');
					var splitelem = elem.alignment.split(' ');
					if (splitr[1] != undefined && splitelem[0] != undefined) {
						if (splitr[1] == splitelem[0]) {
							if (splitelem[1] != 'power' && splitelem[1] != 'casual' && splitelem[1] != 'unlucky' && splitelem[1] != 'trueEvil') {
								//Prevent Town Power and Town Casual from rolling as random town.
								if (customRolesRollable) {
									return true;
								} else {
									if (elem.custom) {
										//Nope!
									} else {
										return true;
									}
								}
							}
						}
					}
				}
				return false;
			});
			if (matches.length > 0) {
				var rand;
				var rn;
				do {
					rand = randNum(matches.length);
					rn = matches[rand].rolename;
				} while (unique.indexOf(rn) != -1 && r.indexOf(rn) != -1);
				r[i] = rn;
			}
		}
		for (
			i = 0;
			i < r.length;
			i++ //Format the roles correctly.
		) {
			r[i] = capitalize(r[i]);
		}
		return r;
	},
	hasRolecard: function (name) {
		return getRoleNum(name.toLowerCase()) != -1;
	},
	getRoleCard: function (name, results) {
		var output;
		name = name.toLowerCase();
		var num = getRoleNum(name);
		if (name != '') {
			if (num == -1) {
				return "Role '" + name + "' not found!";
			}
			var [alMajor, ...alMinor] = roles[num].alignment.split(' ');
			if(alMinor.length) {
				alMinor = " (<span style='color:" + randcolor + "'>"+alMinor.map(capitalize).join(' ')+"</span>)";
			} else {
				alMinor = "";
			}
			var al = "<span class='aligntext' style='color:" + hilitecolor + "'><b>Alignment</b>: </span><span style='color:" + roles[num].color + "'>" + capitalize(alMajor) + alMinor + "</span>";
			var atk = "<span class='attack' style='color:" + randcolor + "'><b>Attack</b>: </span>" + getAttack(num);
			var def = "<span class='defense' style='color:" + randcolor + "'><b>Defense</b>: </span>" + getDefense(num);
			var abi = "<div class='abilities' style='color:" + hilitecolor + ";'><b>Abilities: </b></div>" + getAbilities(num);
			var att = "<div class='abilities' style='color:" + hilitecolor + ";'><b>Attributes: </b></div>" + getAttributes(num);
			var goal = "<span class='goal'><div style='color:" + hilitecolor + "'><b>Goal</b>: </div>" + roles[num].goal + '</span>';
			output = "<div class='rolecard'>" + format(name) + al + '<br>' + atk + '<br>' + def + '<br>' + abi + att + '<br>' + goal + '</div>';
			//Add invest and consig results if they are available
			//if (results.investResult) {
				//var container = '<div class="investresultcontainer">';
				//container = container + "<div class='investresult'>" + results.investResult + '</div>' + '</div>';
				//output += container;
			//}
			//if (results.sheriffResult) {
				//var container = '<div class="investresultcontainer">';
				//container = container + "<div class='sheriffresult'>" + results.sheriffResult + '</div>' + '</div>';
				//output += container;
			//}
			return output;
		}
		return 'You need to specify a role!<br>';
	},
	getRoleData: function (name) {
		var num = getRoleNum(name.toLowerCase());
		if (num == -1) {
			// Default custom role
			return {
				rolename: name,
				alignment: '',
				targeting: ['living other'],
			};
		}
		return roles[num];
	},
	formatRolename: function (str) {
		if (module.exports.hasRolecard(str)) {
			var num = getRoleNum(str.toLowerCase());
			var color;
			return "<span style='color:" + roles[num].color + "'>" + capitalize(roles[num].rolename) + '</span>';
		} else {
			return str;
		}
	},
	formatAlignment: function (str) {
		if (module.exports.hasRolecard(str)) {
			return module.exports.formatRolename(str);
		} else {
			str = str.replace(/[Tt]own/, "<span style='color:" + towncolor + "'>Town</span>");
			str = str.replace(/[Ii]nvestigative/, "<span style='color:" + randcolor + "'>Investigative</span>");
			str = str.replace(/[Ss]upport/, "<span style='color:" + randcolor + "'>Support</span>");
			str = str.replace(/[Pp]rotective/, "<span style='color:" + randcolor + "'>Protective</span>");
			str = str.replace(/[Cc]asual/, "<span style='color:" + neutcolor + "'>Casual</span>");
			str = str.replace(/[Rr]andom/, "<span style='color:" + randcolor + "'>Random</span>");
			str = str.replace(/[Kk]illing/, "<span style='color:" + randcolor + "'>Killing</span>");
			str = str.replace(/[Mm]afia/, "<span style='color:" + mafiacolor + "'>Mafia</span>");
			str = str.replace(/[Dd]eception/, "<span style='color:" + randcolor + "'>Deception</span>");
			str = str.replace(/[Cc]oven/, "<span style='color:" + covencolor + "'>Coven</span>");
			str = str.replace(/[Ee]vil/, "<span style='color:" + randcolor + "'>Evil</span>");
			str = str.replace(/[Bb]enign/, "<span style='color:" + randcolor + "'>Benign</span>");
			str = str.replace(/[Ss]aint/, "<span style='color:" + randcolor + "'>Saint</span>");
			str = str.replace(/[Cc]haos/, "<span style='color:" + randcolor + "'>Chaos</span>");
			str = str.replace(/[Vv]ampire/, "<span style='color:" + vampcolor + "'>Vampire</span>");
			str = str.replace(/[Ff]lorae/, "<span style='color:" + floraecolor + "'>Florae</span>");
			str = str.replace(/[Ff]lora/, "<span style='color:" + floraecolor + "'>Flora</span>");
			str = str.replace(/[Mm]anipulation/, "<span style='color:" + randcolor + "'>Manipulation</span>");
			str = str.replace(/[Cc]onversion/, "<span style='color:" + randcolor + "'>Conversion</span>");
			str = str.replace(/[Dd]ead/, "<span style='color:" + randcolor + "'>Dead</span>");
			str = str.replace(/[Mm]ystical/, "<span style='color:" + mystcolor + "'>Mystical</span>");
			str = str.replace(/[Oo]verseer/, "<span style='color:" + overcolor + "'>Overseer</span>");
			str = str.replace(/[Hh]ead/, "<span style='color:" + randcolor + "'>Head</span>");
			str = str.replace(/[Nn]eutral/, "<span style='color:" + neutcolor + "'>Neutral</span>");
			str = str.replace(/[Pp]ositive/, "<span style='color:" + positivecolor + "'>Positive</span>");
			str = str.replace(/[Nn]egative/, "<span style='color:" + negativecolor + "'>Negative</span>");
			str = str.replace(/[Gg]od/, "<span style='color:" + godcolor + "'>God</span>");
			str = str.replace(/[Dd]eadly Sin/, "<span style='color:" + sincolor + "'>Deadly Sin</span>");
		}
		return str;
	},
	setCustomRoles: function (bool) {
		customRolesRollable = bool;
	},
	getRolenames: function () {
		var roleNames = '';
		for (i in roles) {
			roleNames = roleNames + roles[i].rolename + ', ';
		}
		return roleNames;
	},
};
