var themes = {
	'Dark (Wave\'s Version)': {
		classname: '',
		mpregame: 'Aquabatics.mp3',
		whoami: 'Agari.mp3',
		mmodtime: 'Touch_of_Tranquility.mp3',
		mdaytime: 'Piglets.mp3',
		mvoting: 'Deceitful.mp3',
		mtrial: 'Truth.mp3',
		mnight: 'TorchlitTerror.mp3',
	},
	'Dark (Bayonetta)': {
		classname: '',
		mpregame: 'Alfheim.mp3',
		whoami: 'Valkyrie.mp3',
		mmodtime: 'ShibuyaSewers.mp3',
		mdaytime: 'Cascades.mp3',
		mvoting: 'Deceitful.mp3',
		mtrial: 'Truth.mp3',
		mnight: 'Chaos.mp3',
	},
	'Dark (Salem)': {
		classname: '',
		mpregame: 'Cauldron.mp3',
		whoami: 'Searching.mp3',
		mmodtime: 'GreenMeadows.mp3',
		mdaytime: 'Heated.mp3',
		mvoting: 'Suspicion.mp3',
		mtrial: 'Innocence.mp3',
		mnight: 'WLITN.mp3',
	},
	'Light (Wave\'s Version)': {
		className: 'lighttheme',
		mpregame: 'Mii-in-a-Row.mp3',
		whoami: 'Spinwheel.m4a',
		mmodtime: 'AutumnMountain.mp3',
		mdaytime: 'Skyworld.mp3',
		mvoting: 'Deceitful.mp3',
		mtrial: 'Truth.mp3',
		mnight: 'Cosmic_Cove.mp3',
	},
	'Light (Mario)': {
		className: 'lighttheme',
		mpregame: 'StarlitSky.mp3',
		whoami: 'PeaceAndTranquility.mp3',
		mmodtime: 'AutumnMountain.mp3',
		mdaytime: 'Skyworld.mp3',
		mvoting: 'Deceitful.mp3',
		mtrial: 'Truth.mp3',
		mnight: 'Cosmic_Cove.mp3',
	},
	'Rustic (Salem)': {
		className: 'tostheme',
		mpregame: 'CalmBeforeTheStorm.mp3',
		whoami: 'WhoAmI.mp3',
		mmodtime: 'LittleItaly.mp3',
		mdaytime: 'Heated.mp3',
		mvoting: 'Suspicion.mp3',
		mtrial: 'Innocence.mp3',
		mnight: 'WLITN.mp3',
	},
	'Rustic (Zelda)': {
		className: 'tostheme',
		mpregame: 'Riverside.mp3',
		whoami: 'KakarikoSaved.mp3',
		mmodtime: 'Bewitching.mp3',
		mdaytime: 'ToyPuzzle.mp3',
		mvoting: 'Magmic.mp3',
		mtrial: 'MountHylia.mp3',
		mnight: 'KakarikoNight.mp3',
	},
};

$(function() {
	var themeselector = $('<label id="themeselector">🎨</label>');
	var menu = $('<select>');
	for(var title in themes) {
		var option = document.createElement('option');
		option.innerText = option.value = title;
		menu.append(option);
	}
	menu.change(function() {
		var theme = themes[this.value];
		if(theme) {
			var music = { mpregame, whoami, mmodtime, mdaytime, mvoting, mtrial, mnight };
			for(var v in music) {
				if(theme[v]) {
					music[v].src = theme[v];
					music[v].play();
				}
			}
			document.body.className = theme.className;
			localStorage.setItem('preferred_theme', this.value);
		}
	});
	menu.val(localStorage.getItem('preferred_theme')).change();
	themeselector.append(menu);
	$('#inputarea').append(themeselector);
});
