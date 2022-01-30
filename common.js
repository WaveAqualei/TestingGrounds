var Type = {
	PING:0,
	PONG:1,
	MSG:2,
	ROOMLIST:3,
	TOGGLE:4,
	JOINROOM:5,
	JOIN:6,
	LEAVE:7,
	SYSTEM:9,
	SETROLE:10,
	HIGHLIGHT:11,
	SETPHASE:12,
	WHISPER:13,
	MOD:14,
	TOGGLELIVING:15,
	PRENOT:16,
	VOTE:17,
	CLEARVOTES:18,
	VERDICT:19,
	TICK:20,
	JUDGEMENT:21,
	SETDEV:22,
	WILL:23,
	SETMOD:24,
	SWITCH:25,
	ACCEPT:26,
	ROLEUPDATE:27,
	DENY:28,
	KICK:29,
	ROLECARD:30,
	ROLL:31,
	SETROLESBYLIST:32,
	MASSROLEUPDATE:33,
	SHOWLIST:34,
	SHOWALLROLES:35,
	LATENCIES:36,
	GETWILL:37,
	HEY:38,
	TARGET:39,
	HUG:40,
	ME:41,
	ROLELIST:42,
	AUTOLEVEL:43,
	SUGGESTIONS:44,
	SYSSENT:45,
	CUSTOMROLES:46,
	HELP:47,
	PAUSEPHASE:48,
	SETDAYNUMBER:49,
	SETSPEC:50,
	REMSPEC: 51,
	LOGINDEXI: 52,
	LOGINDEXO: 53,
	MAYOR: 54,
	GUARDIAN_ANGEL: 55,
	REMOVE_EMOJI: 56,
	NOTES: 57,
	GETNOTES: 58,
	DISCONNECT: 59,
	RECONNECT: 60
};
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

if(typeof jQuery !== 'undefined') {
	function sanitize(msg) {
		return $("<span>").text(msg).html()
	}
} else {
	function sanitize(msg) {
		msg = msg.replace(/&/g, '&amp'); //This needs to be replaced first, in order to not mess up the other codes.
		msg = msg.replace(/</g, '&lt;');
		msg = msg.replace(/>/g, '&gt;');
		msg = msg.replace(/\"/g, '&quot;');
		msg = msg.replace(/\'/g, '&#39;');
		msg = msg.replace(/:/g, '&#58;');
		return msg;
	}
}

function processMessage(msg, type)
{
	switch (type)
	{
		case 'msg':
			return '<li>'+msg+'</li>';
		break;
		case 'me':
			return '<li class="me">*<em>'+msg+'</em>*</li>';
		break;
		case 'rolecard':
			return '<li class="rolecardcontainer">'+msg+'</li>';
		break;
		case 'hug':
			return '<li>*<b>'+msg.name+' hugs '+msg.target+'</b>*</li>';
		break;
		case 'system':
			return '<li><b>'+msg+'</b></li>';
		break;
		case 'automod':
			return '<li>'+msg+'</li>';
		break;
		case 'highlight':
			msg.msg = (function(msg) {
				var changes = ['maf','cov','arso','jester','ww','town','sk','neut'];
				for (i in changes)
				{
					var start = '['+changes[i]+']';
					var end = '[/'+changes[i]+']';
					var a = msg.indexOf(start);
					var b = msg.indexOf(end);
					while ( a!=-1 && b!=-1)
					{
						var a = msg.indexOf(start);
						var b = msg.indexOf(end);
						msg = msg.replace(start,'<'+changes[i]+'>');
						msg = msg.replace(end,'</'+changes[i]+'>');
					}
				}
				return msg;
			})(msg.msg);
			msg.styling = msg.styling || 'highlight';
			return '<li class="'+msg.styling+'"><b>'+msg.msg+'</b></li>';
		break;
		case 'whisper':
			if (!msg.msg)
			{
				return '<li><b>'+msg.from+'</b><span class="whisper"> is whispering to </span><b>'+msg.to+'</b></span></li>';
			}
			else if (msg.from && msg.to)
			{
				return '<li><b>'+msg.from+'</b><span class="whisper"> whispers to </span><b>'+msg.to+':</b><span class="whisper"> '+msg.msg+' </span></li>';
			}
			else if (msg.from)
			{
				return '<li><span class="whisper">From</span> <b>'+msg.from+':</b><span class="whisper"> '+msg.msg+' </span></li>';
			}
			else if (msg.to)
			{
				return '<li><span class="whisper">To</span> <b>'+msg.to+':</b><span class="whisper"> '+msg.msg+' </span></li>';
			}
			else
			{
				return '<li><span class="whisper">A whisper in the wind</span></li>';
			}
		break;
		case 'mod':
			if (msg.from)
			{
				return '<li><span class="mod">From</span> <b>'+msg.from+':</b><span class="mod"> '+msg.msg+' </span></li>';
			}
			else if (msg.to)
			{
				return '<li><span class="mod">To</span> <b>'+msg.to+':</b><span class="mod"> '+msg.msg+' </span></li>';
			}
			else
			{
				return '<li><span class="mod">Malformed message</span></li>';
			}
		break;
		case 'target':
			if (msg.target != '')
			{
				if (msg.role)
				{
					msg.role = '('+msg.role+') is';
				}
				else
				{
					msg.role = ' are';
				}
				var str = msg.name+msg.role+' now targeting <b>'+msg.target+'</b>.';
			}
			else
			{
				if (msg.role)
				{
					var str = msg.name+'('+msg.role+') cancels their targetting.';
				}
				else
				{
					var str = 'You cancel your targetting.';
				}
			}
			return '<li><span class="mod">'+str+'</span></li>';
		break;
		case 'custom':	
			return '<li><span class="'+msg.styling+'">'+msg.name+': '+msg.msg+'</span></li>';
		break;
		case 'prenot':
			return '<li class="'+msg.styling+'">'+msg.msg+'</li>';
		break;
		case 'vote':
			return '<li><b>'+msg.voter+'</b><span class="vote">'+msg.msg+'</span><b>'+msg.voted+'</b></li>';
		break;
		case 'verdict':
			if (msg.val==0)
			{
				return '<li><b>'+msg.name+'</b> <span class="vote">has voted.</span>';
			}
			else if (msg.val==1)
			{
				return '<li><b>'+msg.name+'</b> <span class="vote">has changed their vote.</span>';
			}
			else
			{
				return '<li><b>'+msg.name+'</b> <span class="vote">has cancelled their vote.</span>';
			}
		break;
		case 'judgement':
			var guilties = 0;
			var innos = 0;
			for (i in msg.votes)
			{
				if (msg.votes[i] >0) //Inno
				{
					innos+=msg.votes[i];
				}
				else if (msg.votes[i] <0) //Guilty
				{
					guilties-=msg.votes[i];
				}
			}
			var message = '';
			message += '<li><h2><span class="guilty"><b>'+guilties+'</b></span> - <span class="inno"><b>'+innos+'</b></span></h2></li>';
			if (msg.result) //Inno
			{
				message += '<li><span class="guilty"><b>Guilty!</b></span></li>';
			}
			else //Guilty
			{
				message += '<li><span class="inno"><b>Innocent!</b></span></li>';
			}
			for (i in msg.votes)
			{
				switch (msg.votes[i])
				{
					case -1: case -3: message += '<li>'+i+' voted <span class="guilty">guilty</span>.</li>'; break;
					case 0: message += '<li>'+i+' <span class="abstain">abstained</span>.</li>'; break;
					case 1: case 3: message += '<li>'+i+' voted <span class="inno">innocent</span>.</li>'; break;
				}
			}
			return output;
		break;
		case 'will':
			if (msg == '')
			{
				return '<li class="highlight"><span>We could not find a last will.</span></li>';
			}
			else
			{
				return '<li class="highlight"><span>Their last will reads:</span></li><li><div class="will">'+msg+'</div></li>';
			}
		break;
		case 'allroles':
			var message = '';
			for (i in msg)
			{
				message += '<li class="displaylistitem allroles"><div class="innerlistitem">'+msg[i].name+'</div><div class="innerlistitem">'+msg[i].role+'</div></li>';
			}
			return '<li><ul class="allroleslist">'+message+'</ul></li>';
		break;
		case 'rolelist':
			var message = '';
			for (i in msg)
			{
				message += '<li class="displaylistitem">'+msg[i]+'</li>';
			}
			return '<li><ul class="displaylist"></ul></li>';
		break;
		default:
			return '<li>Bad message type: '+type+'</li>';
	}
}
var messageHandlers = {};
function addMessageHandler(type,callback) {
	messageHandlers[type] = callback;
}
function msgToHTML(type, args) {
	if(messageHandlers[type]) {
		return messageHandlers[type].apply(this, args);
	}
}
addMessageHandler(Type.MSG,function(name,msg)
{
	if (msg.styling)
	{
		msg.name=name;
		return processMessage(msg,'custom');
	}
	else
	{
		return processMessage(name+': '+msg,'msg');
	}
});
addMessageHandler(Type.ME,function(name,msg)
{
	return processMessage(name+' '+msg,'me');
});
addMessageHandler(Type.HIGHLIGHT,function(msg, styling)
{
	return processMessage({msg: msg, styling: styling}, 'highlight');
});
addMessageHandler(Type.JOIN,function(name)
{
	return processMessage(name+' has joined.','system');
});
addMessageHandler(Type.DISCONNECT,function(name)
{
	return processMessage(name +' has left.','system');
});
addMessageHandler(Type.RECONNECT,function(name)
{
	return processMessage(name +' has reconnected.','system');
});
addMessageHandler(Type.SYSTEM,function(msg)
{
	return processMessage(msg,'system');
});
addMessageHandler(Type.SYSSENT,function(to,msg)
{
	return processMessage('To '+to+': '+msg,'system');
});
var phasetext = [
	'Pregame',
	'Roles',
	'Modtime',
	'Day',
	'Voting',
	'Trial',
	'Verdict',
	'Last Words',
	'Night',
	'Day 1',
];
addMessageHandler(Type.SETDAYNUMBER,function(num){
	phasetext[3] = 'Day '+num;
	phasetext[8] = 'Night '+num;
});
addMessageHandler(Type.SETPHASE,function(phase,silent,time)
{
	if (!silent)
	{
		return processMessage({msg: phasetext[phase], styling: 'phasechange'}, 'highlight');
	}
});
addMessageHandler(Type.WHISPER,function(msg)
{
	return processMessage(msg,'whisper');
});
addMessageHandler(Type.MOD,function(msg)
{
	return processMessage(msg,'mod');
});
addMessageHandler(Type.PRENOT,function(notification)
{
	switch (notification)
	{
	  case 'GUARDIAN_ANGEL':
		return processMessage({msg: "The Guardian Angel was watching over you!", styling: 'reviving'}, 'prenot');
		break;
	  case 'TRANSPORT':
		return processMessage({msg: "You were transported to another location.", styling: 'dying'}, 'prenot');
		break;
	  case 'POISON_CURABLE':
		return processMessage({msg: "You were poisoned. You will die tomorrow unless you are cured!", styling: 'dying'}, 'prenot');
		break;
	  case 'POISON_UNCURABLE':
		return processMessage({msg: "You were poisoned. You will die tomorrow!", styling: 'dying'}, 'prenot');
		break;
	  case 'PROTECTED':
		return processMessage({msg: "You were attacked but someone protected you!", styling: 'reviving'}, 'prenot');
		break;
	  case 'SAVED_BY_BG':
		return processMessage({msg: "You were attacked but someone fought off your attacker!", styling: 'reviving'}, 'prenot');
		break;
	  case 'SAVED_BY_TRAP':
		return processMessage({msg: "You were attacked but a trap saved you!", styling: 'reviving'}, 'prenot');
		break;
	  case 'SAVED_BY_GA':
		return processMessage({msg: "You were attacked but the Guardian Angel saved you!", styling: 'reviving'}, 'prenot');
		break;
	  case 'TARGET_ATTACKED':
		return processMessage({msg: "Your target was attacked!", styling: 'dying'}, 'prenot');
		break;
	  case 'MEDUSA_STONE':
		return processMessage({msg: "You turned someone to stone.", styling: 'dying'}, 'prenot');
		break;
	  case 'DEAD':
		 return processMessage({msg:'You have died!',styling:'dying'},'prenot');
	  break;
	  case 'BLACKMAIL':
		 return processMessage({msg:'Someone threatened to reveal your secrets. You are blackmailed!',styling:'dying'},'prenot');
	  break;
	  case 'DOUSE':
		 return processMessage({msg:'You were doused in gas!',styling:'dying'},'prenot');
	  break;
	  case 'TARGETIMMUNE':
		 return processMessage({msg:'Your target\'s defense was too strong to kill.',styling:'dying'},'prenot');
	  break;
	  case 'IMMUNE':
		 return processMessage({msg:'Someone attacked you but your defense was too strong!',styling:'dying'},'prenot');
	  break;
	  case 'JESTER':
		 return processMessage({msg:'The Jester will have their revenge from the grave!',styling:'dying'},'prenot');
	  break;
	  case 'SHOTVET':
		 return processMessage({msg:'You were shot by the Veteran you visited!',styling:'dying'},'prenot');
	  break;
	  case 'VETSHOT':
		 return processMessage({msg:'You shot someone who visited you!',styling:'dying'},'prenot');
	  break;
	  case 'RB':
		 return processMessage({msg:'Someone occupied your night. You were roleblocked!',styling:'dying'},'prenot');
	  break;
	  case 'WITCHED':
		 return processMessage({msg:'You felt a mystical power dominating you. You were controlled by a Witch!',styling:'dying'},'prenot');
	  break;
	  case 'REVIVE':
		 return processMessage({msg:'You were revived!',styling:'reviving'},'prenot');
	  break;
	  case 'HEAL':
		 return processMessage({msg:'You were attacked but someone nursed you back to health!',styling:'reviving'},'prenot');
	  break;
	  case 'JAILED':
		 return processMessage({msg:'You were hauled off to jail!',styling:'dying'},'prenot');
	  break;
	  case 'JAILING':
		 return processMessage({msg:'You dragged your target to jail!',styling:'reviving'},'prenot');
	  break;
	  case 'LINKED':
		 return processMessage({msg:'You have been linked!',styling:'reviving'},'prenot');
	  break;
	  case 'FULLMOON':
		 return processMessage({msg:'There is a full moon out tonight.',styling:'moon'},'prenot');
	  break;
   }
});
addMessageHandler(Type.TARGET,function(name,role,target)
{
	return processMessage({name:name,role:sanitize(role),target:target},'target');
});
addMessageHandler(Type.MAYOR, function(name) {
	return processMessage({msg: '🎩' +name+' has revealed themselves as the Mayor!', styling: 'mayor_reveal'}, "highlight");
});
addMessageHandler(Type.HUG,function(name,target)
{
	return processMessage({name:name,target:target},'hug');
});
addMessageHandler(Type.VOTE,function(voter,msg,voted,prev)
{
	return processMessage({voter:voter,msg:msg,voted:voted},'vote');
});
addMessageHandler(Type.VERDICT,function(name,val)
{
	return processMessage({name:name,val:val},'verdict');
});
addMessageHandler(Type.GUARDIAN_ANGEL, function(name, yourName) {
	return processMessage({msg: '👼 The Guardian Angel has protected '+name+'.', styling: 'highlight'}, "highlight");
});
addMessageHandler(Type.JUDGEMENT,function(votes,result)
{
	var msg = {
		result:result,
		votes:votes,
	};
	return processMessage(msg,'judgement');
});
addMessageHandler(Type.ROLECARD,function(card)
{
	return processMessage(card,'rolecard');
});
addMessageHandler(Type.WILL,function(will)
{
	return processMessage(will,'will');
});
addMessageHandler(Type.NOTES, function (notes) {
	return processMessage(notes, 'notes');
});
addMessageHandler(Type.LATENCIES,function(p)
{
	if (typeof p == "number")
	{
		return processMessage('Ping: '+p+'ms','system');
	}
	else
	{
		var output = '';
		for (i in p)
		{
			output += processMessage(i+': '+p[i]+'ms','system');
		}
		return output;
	}
});
addMessageHandler(Type.SHOWLIST,function(list)
{
	return processMessage(list,'rolelist');
});
addMessageHandler(Type.SHOWALLROLES,function(list)
{
	return processMessage(list,'allroles');
});

if(typeof module !== 'undefined') {
	module.exports = {
		Type: Type,
		Phase: Phase,
		sanitize: sanitize,
		msgToHTML: msgToHTML,
	};
}