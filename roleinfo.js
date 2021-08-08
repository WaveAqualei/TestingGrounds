//colors
var towncolor="#00BF00";
var mafiacolor="red";
var covencolor="#8000FF";
var randcolor="#42C0FB";
var neutcolor='lightgrey';
var anycolor='#F5F5F5';
var hilitecolor="orange";
//Generic goals
var towngoal = "Lynch every criminal and evildoer.";
var mafiagoal = "Kill anyone that will not submit to the Mafia.";
var covengoal = "Kill all who would oppose the Coven.";

var roles=[
			// === VANILLA ROLES ===
			// TOWN INVESTIGATIVE VANILLA
			{      
				rolename:"sheriff",
				alignment:"town investigative",
				abilities:['Interrogate one person each night for suspicious activity.'],
				attributes:['You will know if your target is suspicious.'],
				goal:towngoal,
				color:towncolor
			},
			{      
				rolename:"investigator",
				alignment:"town investigative",
				abilities:['Investigate one person each night for a clue to their role.'],
				attributes:['None'],
				goal:towngoal,
				color:towncolor
			},
			{    
				rolename:"lookout",
				alignment:"town investigative",
				abilities:['Watch one person at night to see who visits them.'],
				attributes:['None'],
				goal:towngoal,
				color:towncolor
			},
	                {    
				rolename:"tracker",
				alignment:"town investigative",
				abilities:['Track one person at night to see who they visit.'],
				attributes:['None'],
				goal:towngoal,
				color:towncolor,
			},
	                {      
				rolename:"spy",
				alignment:"town investigative",
				abilities:['You may bug a player\'s house to see what happens to them that night.'],
				attributes:['You will know who the Mafia and Coven visit each night.'],
				goal:towngoal,
				color:towncolor
			},
	                {      
				rolename:"psychic",
				alignment:"town investigative",
				abilities:['Receive a vision every night.'],
				attributes:['On odd nights you will have a vision of three players, at least one will be Evil.',
					'On even nights you will have a vision of two players, at least one will be Good.'
					'All Town roles and Neutral Benign roles appear as Good, all other roles appear as Evil.'],
				goal:towngoal,
				color:towncolor
			},
	
			// TOWN SUPPORT VANILLA
			{      
				rolename:"escort",
				alignment:"town support",
				abilities:['Distract someone each night.'],
				attributes:['Distraction blocks your target from using their role\'s night ability.',
					'You are immune to role blocks.'],
				goal:towngoal,
				color:towncolor
			},
	                {      
				rolename:"mayor",
				alignment:"town support",
				abilities:['You may reveal yourself as the Mayor of the Town.'],
				attributes:['Once you have revealed yourself as Mayor your vote counts as 3 votes.',
					'You may not be healed once you have revealed yourself.'],
				goal:towngoal,
				color:towncolor
			},
			{      
				rolename:"medium",
				alignment:"town support",
				abilities:['When dead speak to a living person at night.'],
				attributes:     ['You will speak to the dead anonymously each night you are alive.',
					'You may only speak to a living person once.'],
				goal:towngoal,
				color:towncolor
			},
			{      
				rolename:"transporter",
				alignment:"town support",
				abilities:['Choose two people to transport at night.'],
				attributes:['Transporting two people swaps all targets against them.',
					'You may transport yourself.',
					'Your targets will know they were transported.'],
				goal:towngoal,
				color:towncolor
			},
			{      
				rolename:"retributionist",
				alignment:"town support",
				abilities:['You may raise a dead Town member and use their ability on a player.'],
				attributes:['Create zombies from dead true-hearted Town players.',
					   'Use their abilities on your second target.',
					   'Each zombie can be used once before it rots.'],
				goal:towngoal,
				color:towncolor
			},
	
			// TOWN PROTECTIVE VANILLA
			{      
				rolename:"doctor",
				alignment:"town protective",
				abilities:['Heal one person each night, granting them Powerful Defense.'],
				attributes:['You may only heal yourself once.',
					'You will know if your target is attacked.'],
				goal:towngoal,
				color:towncolor
			},
			{      
				rolename:"bodyguard",
				alignment:"town protective",
				abilities:['Protect one person from death at night.'],
				attributes:['If your target is directly attacked or is the victim of a harmful visit, you and the visitor will fight.',
					'If you successfully protect someone you can still be healed.',
					'You have one bulletproof vest.'],
				goal:towngoal,
				color:towncolor
			},
	                {      
				rolename:"crusader",
				alignment:"town protective",
				abilities:['Protect one person other than yourself during the night.'],
				attributes:['Grant your target Powerful defense.',
					'You will know if your target is attacked.',
					'You attack one person who visits your target on the same night.',
					'You do not attack vampires, but you do block their attacks.],
				goal:towngoal,
				color:towncolor
			},
	                {      
				rolename:"trapper",
				alignment:"town protective",
				abilities:['You may set up a Trap at another player\'s house.'],
				attributes:['Traps take one day to build.',
					'Traps can be torn down by selecting yourself at night.',
					'You may only have one Trap out at a time.',
					'Traps will trigger upon visits, but will only harm attackers.'
					'You will know the roles of all the players that visit your trapped target.'],
				goal:towngoal,
				color:towncolor
			},
	
	
			// TOWN KILLING VANILLA
			{      
				rolename:"jailor",
				alignment:"town killing",
				abilities:['You may choose one person during the day to jail for the night.'],
				attributes:['You may anonymously talk with your prisoner.',
					'You can choose to execute your prisoner.',
					'The jailed target can\'t perform their night ability.',
					'If you execute a Town member, you forfeit further executions.'],
				goal:towngoal,
				color:towncolor
			},
	                {      
				rolename:"vigilante",
				alignment:"town killing",
				abilities:['Choose to take justice into your own hands and shoot someone.'],
				attributes:['If you shoot another Town member you will commit suicide over the guilt.',
					'You can only shoot your gun 3 times.'],
				goal:towngoal,
				color:towncolor
			},
			{      
				rolename:"veteran",
				alignment:"town killing",
				abilities:['Decide if you will go on alert.'],
				attributes:['While on alert, you gain Basic Defense.',
					'While on alert, you will deliver a Powerful attack to anyone who visits you.',
					'You can only go on alert 3 times.',
					'You cannot be roleblocked.'],
				goal:towngoal,
				color:towncolor
			},
	
			// MAFIA VANILLA
			{      
				rolename:"godfather",
				alignment:"mafia killing",
				abilities:['You may choose to attack a player each night.'],
				attributes:['If there is a Mafioso they will attack the target instead of you.',
					'You will appear to be innocent to the Sheriff.',
					'You can talk with the other Mafia at night.'],
				goal:mafiagoal,
				color:mafiacolor
			},
			{    
				rolename:"mafioso",
				alignment:"mafia killing",
				abilities:['Carry out the Godfather\'s orders.'],
				attributes:['You can attack if the Godfather does not give you orders.',
					'If the Godfather dies you will become the next Godfather.',
					'You can talk with the other Mafia at night.'],
				goal:mafiagoal,
				color:mafiacolor,
			},
	                {      
				rolename:"ambusher",
				alignment:"mafia killing",
				abilities:['You may choose to lie in wait outside your targets house.'],
				attributes:['You will attack one player who visits your target.',
					'All players visiting your target will learn your name.',
					'If there are no kill capable Mafia roles left you will become a Mafioso.',
					'You can talk with the other Mafia at night.'],
				goal:mafiagoal,
				color:mafiacolor
			},
	                {      
				rolename:"blackmailer",
				alignment:"mafia support",
				abilities:['Choose one person each night to blackmail.'],
				attributes:['Blackmailed targets cannot talk during the day.',
					'You can hear private messages.',
					'If there are no kill capable Mafia roles left you will become a Mafioso.',
					'You can talk with the other Mafia at night.'],
				goal:mafiagoal,
				color:mafiacolor
			},
			{      
				rolename:"consigliere",
				alignment:"mafia support",
				abilities:['Check one person for their exact role each night.'],
				attributes:['If there are no kill capable Mafia roles left you will become a Mafioso.',
					'You can talk with the other Mafia at night.'],
				goal:mafiagoal,
				color:mafiacolor
			},
			{      
				rolename:"consort",
				alignment:"mafia support",
				abilities:['Distract someone each night.'],
				attributes:['Distraction blocks your target from using their role\'s night ability.',
					'If there are no kill capable Mafia roles left you will become a Mafioso.',
					'You can talk with the other Mafia at night.'],
				goal:mafiagoal,
				color:mafiacolor
			},
			{      
				rolename:"disguiser",
				alignment:"mafia deception",
				abilities:['Choose a target to disguise yourself as.'],
				attributes:['If your target dies you will appear to be them.',
					'The disguised Mafia member will appear to have the same role as the non-Mafia member to the Investigator and Sheriff.',
					'Your disguised Mafia member will appear to be the other person to a Lookout.',
					'When disguised as a Town member, Mafia visits are disregarded by Spy.'],
				goal:mafiagoal,
				color:mafiacolor
			},
			{      
				rolename:"framer",
				alignment:"mafia deception",
				abilities:['Choose someone to frame at night.'],
				attributes:['If your target is investigated they will appear to be a member of the Mafia.',
					'If there are no kill capable Mafia roles left you will become a Mafioso.'],
				goal:mafiagoal,
				color:mafiacolor
			},
			{      
				rolename:"janitor",
				alignment:"mafia deception",
				abilities:['Choose a person to clean at night.'],
				attributes:['If your target dies their role and last will won\'t be revealed to the Town.',
					'Only you will see the cleaned targets role and last will.',
					'You may only perform 3 cleanings.'],
				goal:mafiagoal,
				color:mafiacolor
			},
			{      
				rolename:"forger",
				alignment:"mafia deception",
				abilities:['Choose a person and rewrite their role and last will at night.'],
				attributes:['If a target dies, their role and last will is replaced with your forgery.',
					'You may only perform 2 forgeries.'],
				goal:mafiagoal,
				color:mafiacolor
			},
	                {      
				rolename:"hypnotist",
				alignment:"mafia deception",
				abilities:['You may sneak into a players house at night and plant a memory.'],
				attributes:['A planted memory will confuse the player.',
					'If there are no kill capable Mafia roles left you will become a Mafioso.',
					'You can talk with the other Mafia at night.'],
				goal:mafiagoal,
				color:mafiacolor
			},
	
	                // COVEN VANILLA
	                {      
				rolename:"coven leader",
				alignment:"coven evil",
				abilities:['You may choose to Control someone each night.'],
				attributes:['Your victim will know they are being controlled.',
					'With the Necronomicon, your victim is dealt a Basic attack and you gain Basic defense.',
					'You will know the role of the player you control.'],
				goal:covengoal,
				color:covencolor
			},
	                {      
				rolename:"hex master",
				alignment:"coven evil",
				abilities:['You may choose to Hex a player each night.'],
				attributes:['Players are not notified upon being hexed.',
					'Hexed targets will have their investigative results changed.',
					'When all living non-Coven players are hexed, all hexed players will be dealt an Unstoppable attack.',
					'With the Necronomicon, you gain Astral and Basic attacks.'],
				goal:covengoal,
				color:covencolor
			},
	                {      
				rolename:"medusa",
				alignment:"coven evil",
				abilities:['You may choose to Stone Gaze all visitors at night.'],
				attributes:['You may choose to stone gaze thrice.',
					'Your victims\'s last wills and roles will not be revealed.',
					'With the Necronomicon, you may visit players and turn them to stone.'],
				goal:covengoal,
				color:covencolor
			},
	                {      
				rolename:"necromancer",
				alignment:"coven evil",
				abilities:['You may reanimate a dead player and use their ability on a player.'],
				attributes:['Create zombies from dead players who use their abilities on your second target.',
					'Each zombie can be used once before it rots.',
					'With the Necronomicon, select yourself to summon a ghoul to Basic attack your target.'],
				goal:covengoal,
				color:covencolor
			},
	                {      
				rolename:"poisoner",
				alignment:"coven evil",
				abilities:['You may choose to poison a player each night.'],
				attributes:['Your poisons take one day to take effect.',
					'Poison can be removed by Heals.',
					'With the Necronomicon, your poison can no longer be Healed.'],
				goal:covengoal,
				color:covencolor
			},
	                {      
				rolename:"potion master",
				alignment:"coven evil",
				abilities:['You may choose to use a potion on a player each night.'],
				attributes:['You may choose to use a Heal, reveal, or attack potion on a player.',
					'Each potion has a three day cooldown.',
					'With the Necronomicon, your potions no longer have a cooldown.'],
				goal:covengoal,
				color:covencolor
			},
	
	
			// NEUTRAL BENIGN VANILLA
			{      
				rolename:"survivor",
				alignment:"neutral benign",
				abilities:['Put on a bulletproof vest at night, granting you Basic Defense.'],
				attributes:['You can only use the bulletproof vest 4 times.'],
				goal:"Live to the end of the game.",
				color:"#C8C800"
			},
			{      
				rolename:"amnesiac",
				alignment:"neutral benign",
				abilities:['Remember who you were by selecting a graveyard role.'],
				attributes:['When you choose a role it will be revealed to all the players in the game.'],
				goal:"Remember who you were and complete that roles objectives.",
				color:"#44A6C6"
			},
	                {      
				rolename:"guardian angel",
				alignment:"neutral benign",
				abilities:['Keep your target alive.'],
				attributes:['Your target can be any player except an Executioner, Jester, or another Guardian Angel.',
					'If your target is killed you will become a Survivor without any bulletproof vests.',
					'Twice a game you may Heal and Purge your target. This may be done from the grave. Watching over a player ignores Jail.'],
				goal:"Keep your target alive until the end of the game.",
				color:"#FFFFFF"
			},
	
			// NEUTRAL EVIL VANILLA
			{      
				rolename:"jester",
				alignment:"neutral evil",
				abilities:['Trick the Town into voting against you.'],
				attributes:['If you are lynched you may kill one of your guilty or abstaining voters the following night.'],
				goal:"Get yourself lynched by any means necessary.",
				color:"#F49FD0"
			},
			{      
				rolename:"executioner",
				alignment:"neutral evil",
				abilities:['Trick the Town into lynching your target.'],
				attributes:['Your target can be any Townmember except a Jailor or Mayor.',
					'If your target is killed at night you will become a jester.'],
				goal:"Get your target lynched at any cost.",
				color:"#ACACAC"
			},
			{      
				rolename:"witch",
				alignment:"neutral evil",
				abilities:['Control someone each night.'],
				attributes:['You have a mystical barrier that grants you Basic defense until you are attacked.',
					'Your victim will know they are being controlled.',
					'You will know the role of the player you Control.'],
				goal:"Survive to see the Town lose the game.",
				color:"#8000FF"
			},
	
			// NEUTRAL KILLING VANILLA
			{      
				rolename:"serial killer",
				alignment:"neutral killing",
				abilities:['Kill someone each night.'],
				attributes:['If you are role blocked you will attack the role blocker in addition to your target.',
					'Role blockers that target you will have their last will covered in blood making it unreadable.',
					'You can choose to be cautious and not kill role blockers.'],
				goal:"Kill everyone who would oppose you.",
				color:"#000080"
			},
			{      
				rolename:"arsonist",
				alignment:"neutral killing",
				abilities:['Douse someone in gasoline or ignite all doused targets.'],
				attributes:['Select yourself to ignite doused people dealing an Unstoppable attack.',
					'You will douse anybody that visits you.',
					'If you take no action, you will attempt to clean gasoline off yourself.',
					'Doused targets will have their investigative results changed. Players will not know they were doused.'],
				goal:"Live to see everyone else burn.",
				color:"#EE7600"
			},
			{      
				rolename:"werewolf",
				alignment:"neutral killing",
				abilities:['Transform into a Werewolf during the full moon.'],
				attributes:['You will Rampage at a player\'s house when you attack.',
					'If you do not select a target you will stay home and Rampage at your home.'],
				goal:"Kill everyone who would oppose you.",
				color:"#361E01"
			},
	                {      
				rolename:"juggernaut",
				alignment:"neutral killing",
				abilities:['You may choose to attack a player on Full-Moon nights.'],
				attributes:['With each kill your powers grow.',
					'On your first kill, you may attack every night.',
					'On your second kill, you Rampage when you attack.',
					'On your third kill, you ignore all effects that would protect a player.'],
				goal:"Kill everyone who would oppose you.",
				color:"#631A35"
			},
	
	                // NEUTRAL CHAOS VANILLA
			{      
				rolename:"pirate",
				alignment:"neutral chaos",
				abilities:['Choose a player to plunder each night.'],
				attributes:['When you plunder a player, you will duel the player for their valuables.',
					'If the player defends against your attack, you get no loot.'],
				goal:"Successfully plunder two players.",
				color:"#DBAD59"
			},
	                {      
				rolename:"plaguebearer",
				alignment:"neutral chaos",
				abilities:['You may choose to infect a player with the Plague each night.'],
				attributes:['Infected players spread the Plague on visiting or being visited.',
					'Infection cannot be protected against or removed.',
					'Players will not know they have been infected.',
					'When all living players are infected, you will become Pestilence.'],
				goal:"Infect all living players and become Pestilence.",
				color:"#CFFF63"
			},
	                {      
				rolename:"pestilence",
				alignment:"neutral chaos",
				abilities:['You may choose to Rampage at a player\'s house eacn night.'],
				attributes:['You will attack anyone that visits you or your target.',
					'You cannot be roleblocked or controlled.',
					'If you are jailed you will attack the Jailor.',
					'You cannot be killed at night.'],
				goal:"Kill all who would oppose you.",
				color:"#010302"
			},

			// === CUSTOM ROLES ====
			// TOWN INVESTIGATIVE CUSTOM
			{      
				rolename:"scientist",
				alignment:"town investigative",
				abilities:['Take a fingerprint sample of one person each night.'],
				attributes:['Compare their sample to the test subject from the previous night, comparing alignment supertype (Town, Mafia, Neutral).',
					'You will recieve a result of \'Same\' or \'Different\'',
					'You may not sample yourself.',
					'You may not sample a revealed mayor.'],
				goal:towngoal,
				color:towncolor,
				custom:true
			},
			{      
				rolename:"interviewer",
				alignment:"town investigative",
				abilities:['Interview 2 people each night and discover who is the most trustworthy.'],
				attributes:['You cannot interview a revealed Mayor.'],
				goal:towngoal,
				color:towncolor,
				custom:true
			},

			// TOWN SUPPORT CUSTOM:
			{
				rolename:"rain dancer",
				alignment:"town support",
				abilities:['Decide if you want to make it rain next night.'],
				attributes:['It only rains during the night.',
					'Only scum will be noticed, about a rain.',
					'Everyone that goes outside during a rain will be drenched the next morning.',
					'At the beginning of the day a list of drenched people will be show to you.',
					'You can execute only 2 rain dances.',
					'It cannot rain 2 days in a row.'],
				goal:towngoal,
				color:towncolor,
				custom:true
			},
			{
				rolename:"milkman",
				alignment:"town support",
				abilities:['Deliver milk to a player each night, keeping them awake.'],
				attributes:['Your target will instead perform their night ability on their attacker, or role blocker.'],
				goal:towngoal,
				color:towncolor,
				custom:true
			},
			{
				rolename:"incarcerator",
				alignment:"town support",
				abilities:['Patrol out someone’s house each night.'],
				attributes:['You will send all visiting players to prison.',
					   'Detained targets will be role blocked the night following their imprisonment.',
					   'Detainment will bypass role block immunities.'],
				goal:towngoal,
				color:towncolor,
				custom:true
			},
			
			// TOWN PROTECTIVE CUSTOM:
			{    
				rolename:"ghost",
				alignment:"town protective",
				abilities:['Roleblock a person and scare away all visiting killers.'],
				attributes:['You know if you scared away a visitor, but your target does not.',
					'You must change target each night',
					'You will be killed if you rb a Serial Killer or turned Werewolf.',
					'Killingroles are not counted as visitors for Lookout/Werewolf.',
					'Visiting the jail protects both.',
					'The Werewolf will kill you on second encounter.'],
				goal:towngoal,
				color:towncolor,
				custom:true
			},
	
			// TOWN KILLING CUSTOM
			{      
				rolename:"fisherman",
				alignment:"Town Killing",
				abilities:['Cast your line into someone’s house each night.'],
				attributes:['If someone visits your target, they will be “hooked”.',
					'You will know you hooked someone, and they will know they were hooked.',
					'You may decide to ‘release’, or ‘kill’ your hooked player the night following a successful hook.'
				],
				goal:towngoal,
				color:towncolor,
				custom:true
			},
			{      
				rolename:"firebrand",
				alignment:"Town Killing",
				abilities:['Each night douse a player in gasoline.',
					'Once per game ignite all doused targets.'],
				attributes:['Your kills ignore night immunity and appear identical to the Arsonists.',
					'The Arsonist cannot ignite your targets, nor can you ignite theirs'
				],
				goal:towngoal,
				color:towncolor,
				custom:true
			},
			// MAFIA CUSTOM
			{      
				rolename:"nightmarer",
				alignment:"mafia support",
				abilities:['Make someone have a nightmare about someone each night.'],
				attributes:['Your target cant visit the person they have a nightmare about.',
					'Targets are told who the nightmare is about.',
					'Your target will be unable to visit the person until you give them a different nightmare.',								
					'All nightmares end if the nightmarer dies or is promoted.'
				],
				goal:mafiagoal,
				color:mafiacolor,
				custom:true
			},
			{      
				rolename:"watcher",
				alignment:"mafia support",
				abilities:['Watch someone at night to see who visits them.'],
				attributes:['You can talk to the Mafia at night.'],
				goal:mafiagoal,
				color:mafiacolor,
				custom:true
			},
			{      
				rolename:"musician",
				alignment:"mafia support",
				abilities:['Remove all night feedback from someone and their visitors.'],
				attributes:['You may choose to remove the discussion phase from the town the next day.',
				'You can only serenade the town twice in a game.'],
				goal:mafiagoal,
				color:mafiacolor,
				custom:true
			},
			{      
				rolename:"malpractitioner",
				alignment:"mafia support",
				abilities:['Torture someone at night, blocking all abilities.'],
				attributes:['You can block day and night abilities.',
				'When blocked, actions wont be performed and become stored.',
				'When you stop blocking, the most recent action is released with all the rest getting roleblocked.',
				'You must switch target if you torture someone for 2 consecutive nights.'],
				goal:mafiagoal,
				color:mafiacolor,
				custom:true
			},
	
			// NEUTRAL BENIGN CUSTOM
			{
				rolename:"lost spirit",
				alignment:"neutral benign",
				abilities:['Look for death each night.'],
				attributes:['Killing roles (except Arsonist) can lift your curse, but Town(Killing) roles have to use their ability.',
					'Immune to ignition.', 
					'Witches roleblock you.',
					'Your last will is cleaned upon success.',
					'You cannot be protected or healed.',
					'You will grant your killer unpierceable nightimmunity until the following night.'],
				goal:"Find a way to lift your curse!",
				color:"#8080FF",
				custom:true
			},
			{
				rolename:"undertaker",
				alignment:"neutral benign",
				abilities:['Select someone each night to try to bury them.'],
				attributes:['If the person you selected dies the same night or the next day via lynching, they will be "buried".',
					//'Buried players have their wills removed',
					'You will have access to a buried players will and role',
					'You will join the deathchat, after your goal is fulfilled',
					'You cannot be killed at night'],
				goal:"Bury 1-3 people",
				color:"#739292",
				custom:true
			},
	
			// NEUTRAL EVIL CUSTOM 
			{      
				rolename:"stalker",
				alignment:"neutral evil",
				abilities:['Stalk someone each night.'],
				attributes:['The person you stalked can not be visited by others.',
					'Transporter and killing-roles are uneffected.',
					'You may stalk yourself once, this cannot be redirected or controlled.',
					'You have one autovest protecting from the first non-town attack.'],
				goal:"Survive to see the Town lose the game.",
				color:"#000080",
				custom:true
			},
			{      
				rolename:"warlock",
				alignment:"neutral evil",
				abilities:['Curse two targets each night, tying the secondary target to the same fate as the first.'],
				attributes:['Anyone targeting the primary target will also target the secondary target.',
					'While cursed, your secondary target will gain a Powerful defence against non-town attacks.',
					'You own one auto-vest.'],
				goal:"Survive to see the Town lose the game.",
				color:"#800040"
			},
			{      
				rolename:"gossiper",
				alignment:"neutral evil",
				abilities:['Select two targets. Your second target will find out role, visitors, and target of your first one.'],
				attributes:['You cannot target yourself.',
					'Your ability fails if you give information to a townperson, and you will NOT be notified of this.',
					'You own one auto-vest.'],
				goal:"Survive to see the Town lose the game.",
				color:"#808000"
			},


			// NEUTRAL KILLING CUSTOM	
			{      
				rolename:"shadowalker",
				alignment:"neutral killing",
				abilities:['Choose to walk in someone\'s shadow each night'],
				attributes:["When walking in someone's shadow, You will kill whoever they visited.",
					"Lookouts will only see your target visiting someone and not you.",
					"If your target stays home or is a non visiting role, they will be attacked directly.",
					"Lookout will only see you if you do a direct attack on your target.",
					"If you target a Bodyguard, they will not be able to guard your attacks."],
				goal:"Kill anyone that would oppose you.",
				color:'#BF40BF',
				custom:true
			},
			{      
				rolename:"slaughterer",
				alignment:"neutral killing",
				abilities:['Slaughter someone each night',
					  'Wear a new mask in the day'],
				attributes:["You roleblock instead of attack players that have visited you before.",
					"You do not die to the Bodyguard.",
					"You can kill Jailed targets",
					"Alerting Veterans survive the attack, but cannot kill the Slaughterer",
					"You can gain a new \"identity\" at day (adds a charge every 3 days), nulliying the visits made to you."],
				goal:"Kill anyone that would oppose you.",
				color:'#5F0060',
				custom:true
			},
			{      
				rolename:"butcher",
				alignment:"neutral killing",
				abilities:['Kill player(s) each night.',
					  'Start with two kills, and gain two more every 3rd night.'],
				attributes:['You cannot be killed at night.',
					'Killing multiple players, you are role block immune.',
					'Killing a single player, you will clean them, but not be informed their information.',
					'You cannot kill the night following a clean kill.'],
				goal:"Kill everyone who would oppose you.",
				color:"#804040",
				custom:true
			},
			{
				rolename:"electrician",
				alignment:"neutral killing",
				abilities:['Charge someone each night.'],
				attributes:["You cannot be killed at night.",
					"Target wont be notified about charging.",
					"If a person that is charged visits another charged person, both will die.",
					"If you charge a person for a second time, that person will die.",
					"If every other player is charged, the town will be notified.",
					"If every other player is charged, you may kill all charged players."],
				goal:"Live to see everyone electrocuted.",
				color:"#00FF80",
				custom:true
			},
	
			// NEUTRAL CHAOS CUSTOM
			{     
               			rolename:"paradoxist",
               			alignment:"Neutral Chaos",
          			abilities:['Visit a player to send them backwards in time, roleblocking but also healing them. Visting a second time kills them.'],
               			attributes:['Your initial time is 8 o\'clock.','Visiting a Town member will send your clock forward 5 hours.','Visiting a member of the Mafia will send your clock forward 3 hours.','Visiting any Neutral role will send your clock backwards 2 hours.'],
               			goal:"Land your clock on 12 o'clock to win",
               			color:"magenta",
				custom:true
			},
	
			//Casual roles
			{
				rolename:"citizen",
				alignment:"town casual",
				abilities:['Your only ability is your vote.'],
				attributes:['Without the burden of power to weigh you down, you exhibit superior logic and deductive abilities.'],
				goal:towngoal,
				color:towncolor,
				custom:true
			},
	                {
				rolename:"cleaned",
				alignment:"random dead",
				abilities:['None.'],
				attributes:['You were cleaned by a Janitor.',
					'Your Role and Last Will could not be determined.'],
				goal:"Complete your original goal while dead.",
				color:anycolor,
				custom:true
			},
	                {
				rolename:"stoned",
				alignment:"random dead",
				abilities:['None.'],
				attributes:['You were stoned by Medusa.',
					'Your Role and Last Will could not be determined.'],
				goal:"Complete your original goal while dead.",
				color:anycolor,
				custom:true
			},
			{
				rolename:"ralozey",
				alignment:"neutral casual",
				abilities:['Code and Host the TG.'],
				attributes:['You are the fastest ever to live!'],
				goal:"Make TG a happy place.",
				color:"#000FFF",
				custom:true
			},
			{
				rolename:"afk",
				alignment:"neutral trueEvil",
				abilities:['Die before the game has started.'],
				attributes:['You have lost automatically.'],
				goal:"None",
				color:"#B05F3C",
				custom:true
			},
			{
				rolename:"spectator",
				alignment:"neutral casual",
				abilities:['You know everything.'],
				attributes:['You can do nothing.'],
				goal:"See how the game progresses",
				color:"#AFAFAF",
				custom:true
			},
			{
				rolename:"late",
				alignment:"neutral unlucky",
				abilities:['You were too late.'],
				attributes:['Please wait patiently for the current game to end.'],
				goal:"Wait for a new game to start.",
				color:"#FE00EF",
				custom:true
			},
	
];
var unique = ["jailor", "mayor", "retributionist", "veteran", "godfather", "mafioso", "ambusher", "juggernaut", "werewolf", "coven leader", "medusa", "potion master", "hex master", "necromancer", "poisoner", "pirate", "plaguebearer", "pestilence", "ghost", "warlock", "rain dancer", "musician"];
 
function getAttributes(num)
{
        var str="<br><div>";
        var arr=roles[num].attributes;
        for (var i=0;i<arr.length;i++)
        {
                str+="<span id='attribute'>-"+arr[i]+"</span><br>";    
        }
        return str+"</div>";
}
function getAbilities(num)
{
        var str="<br><div>";
        var arr=roles[num].abilities;
        for (var i=0;i<arr.length;i++)
        {
                str+="<span id='attribute'>-"+arr[i]+"</span><br>";    
        }
        return str+"</div>";
}
function format(str)
{
        var color;
        for (i = 0; i < roles.length; i++)
        {
                if (roles[i].rolename==str)
                {
                        color=roles[i].color;
                }
        }
        if (color==undefined)
        {
                color = "black";
        }
        var strings=str.split(" ");
        str="";
        for (x=0;x<strings.length;x++)
        {
                strings[x]=strings[x].substring(0,1).toUpperCase()+strings[x].substring(1,strings[x].length)+" ";              
                str+=strings[x];
        }      
        return "<h2 style='color:"+color+"'>"+str+"</h2>";
}
function shuffle(list)
{
        for (i=0;i<list.length;i++)
        {
                swap(list, i, randNum(list.length));   
        }      
}
function swap(list, x, y)
{
        var temp=list[x];
        list[x]=list[y];
        list[y]=temp;  
}
function lowerAll(arr)
{
        var lowered=[];
        for (i=0;i<arr.length;i++)
        {
                lowered[i]=arr[i].toLowerCase();
        }
        return lowered;
}
function capitalize(str)
{
        var strings=str.split(" ");
        str="";
        for (x=0;x<strings.length;x++)
        {
                strings[x]=strings[x].substring(0,1).toUpperCase()+strings[x].substring(1,strings[x].length)+" ";              
                str+=strings[x];
        }
       
        return str.trim();
}
function randNum(num)
{
        return (Math.floor( Math.random()*num ));
}
function getRoleNum(name)
{
        for (var i = 0; i < roles.length; i++)
        {
			if (roles[i].rolename==name)
			{
					return i;
			}
        }
        return -1;
}
module.exports = {
          sortRoles: function(r, customRolesRollable, exceptions)
          {
			r=lowerAll(r);
			for (i=0;i<r.length;i++)
			{                                                      
				var matches=roles.filter(function(elem)
				{
					if (elem.alignment == r[i] || (r[i] == "any" && elem.alignment.split(" ")[1] != 'casual')) //prevent casual rolling as any
					{							
						if (elem.alignment == r[i] || r[i] == "any" && elem.alignment.split(" ")[1] != 'unlucky')
						{
							if (elem.alignment == r[i] || r[i] == "any" && elem.alignment.split(" ")[1] != 'trueEvil')
							{
								//Ensure custom rolls only roll as any if they are enabled.
								if (!customRolesRollable)
								{
									if (elem.custom)
									{
										//Nope! Not rolling
									}
									else
									{
										return true;
									}
								}
								else
								{
									return true;
								}
							}
						}
					}
					else if (r[i].split(" ")[0]=="random")
					{                                                                      
						var splitr=r[i].split(" ");
						var splitelem=elem.alignment.split(" ");
						if (splitr[1] != undefined && splitelem[0] != undefined)
						{
							if (splitr[1]==splitelem[0])
							{
								if (splitelem[1] != 'power' && splitelem[1] != 'casual' && splitelem[1] != 'unlucky' && splitelem[1] != 'trueEvil') //Prevent Town Power and Town Casual from rolling as random town.
								{
									if (customRolesRollable)
									{
										return true;
									}
									else
									{
										if (elem.custom)
										{
											//Nope!
										}
										else
										{
											return true;
										}
									}
								}
							}
						}
					}
					return false;  
				});    
				if (matches.length>0)
				{
					var rand;
					var rn;                                
					do
					{
							rand=randNum(matches.length);
							rn=matches[rand].rolename;     
					}
					while ( unique.indexOf(rn) != -1 && r.indexOf(rn) !=-1 );
					r[i]=rn;
				}                              
			}
			for (i = 0; i < r.length; i++) //Format the roles correctly.
			{
					r[i]=capitalize(r[i]);
			}                                    
			return r;
          },
          hasRolecard: function(name)
          {              
                        return ( getRoleNum(name.toLowerCase())!=-1);
          },
          getRoleCard: function (name, results)
          {
                var output;
                name=name.toLowerCase();
                var num=getRoleNum(name);
                if (name!="")
                {
                        if (num==-1){
                                return ("Role '"+name+"' not found!");
                        }                                              
                        var al="<span class='aligntext' style='color:"+hilitecolor+"'><u>Alignment</u>: </span>"+module.exports.formatAlignment(roles[num].alignment);
                        var abi="<div class='abilities' style='color:"+hilitecolor+";'><b>Abilities: </b></div>"+getAbilities(num);
                        var att="<div class='abilities' style='color:"+hilitecolor+";'><b>Attributes: </b></div>"+getAttributes(num);
                        var goal="<span class='goal'><div style='color:"+hilitecolor+"'><b>Goal</b>: </div>"+roles[num].goal+"</span>";
                        output="<div class='rolecard'>"+format(name)+al+"<br>"+
                        abi+"<br>"+
                        att+"<br>"+
                        goal+"</div>";
                        //Add invest and consig results if they are available
                        if (results.investResult)
                        {
							var container = '<div class="investresultcontainer">';
							container = container + "<div class='investresult'>"+results.investResult+"</div>" + '</div>';
							output += container;
						}
                        if (results.sheriffResult)
                        {
							var container = '<div class="investresultcontainer">';
							container = container + "<div class='sheriffresult'>"+results.sheriffResult+"</div>" + '</div>';
							output += container;
						}
                        return output;                                                                                                 
                }      
                return "You need to specify a role!<br>";
        },
        formatAlignment: function (str)
        {                              
                if (module.exports.hasRolecard(str))
                {
                        var num=getRoleNum(str.toLowerCase());
                        var color;                     
                        str="<span style='color:"+roles[num].color+"'>"+capitalize(roles[num].rolename)+"</span>";
                }
                else
                {
                        str=str.replace(/[Tt]own/,"<span style='color:"+towncolor+"'>Town</span>");
                        str=str.replace(/[Ii]nvestigative/,"<span style='color:"+randcolor+"'>Investigative</span>");
                        str=str.replace(/[Ss]upport/,"<span style='color:"+randcolor+"'>Support</span>");
                        str=str.replace(/[Pp]rotective/,"<span style='color:"+randcolor+"'>Protective</span>");
                        str=str.replace(/[Pp]ower/,"<span style='color:"+randcolor+"'>Power</span>");
                        str=str.replace(/[Cc]asual/,"<span style='color:"+randcolor+"'>Casual</span>");
                        str=str.replace(/[Rr]andom/,"<span style='color:"+randcolor+"'>Random</span>");
                        str=str.replace(/[Kk]illing/,"<span style='color:"+randcolor+"'>Killing</span>");
                        str=str.replace(/[Mm]afia/,"<span style='color:"+mafiacolor+"'>Mafia</span>");
                        str=str.replace(/[Dd]eception/,"<span style='color:"+randcolor+"'>Deception</span>");
                        str=str.replace(/[Ee]vil/,"<span style='color:"+randcolor+"'>Evil</span>");
                        str=str.replace(/[Bb]enign/,"<span style='color:"+randcolor+"'>Benign</span>");
                        str=str.replace(/[Cc]haos/,"<span style='color:"+randcolor+"'>Chaos</span>");
                        str=str.replace(/[Nn]eutral/,"<span style='color:"+neutcolor+"'>Neutral</span>");      
                }
                return str;
        },
        setCustomRoles:function(bool){
			customRolesRollable = bool;
		},
	getRolenames:function()
	{
		var roleNames = '';
		for (i in roles)
		{
		roleNames = roleNames + roles[i].rolename + ', ';
		}
		return(roleNames);
	},
};
