/**
 *  
 */
var _mods = [	'io', 'util', 'http', 'lang/nl/lang_nl', 
             	'lang/initLang', 'lang/com_lang', 'screen']

var _t = null
var _initLang = null
var _onloads = []
var util = {}

function loadScript(fileName)
{
	var fileName = new String(fileName)
	var s = document.createElement('script')
	s.setAttribute('src', fileName + '.js')
	s.setAttribute('type', 'text/javascript')
	document.getElementsByTagName('head')[0].appendChild(s)
}

function initUtil()
{
	loadScript('validations')
	
	for(var c = 0; c < _mods.length; c++)
	{
		loadScript(_mods[c])
	}

	_t = setInterval("waitForLoadCompleted();", 50)
}

function isUtil(level)
{
	var isLoaded = true
	for (var c = 0; c < level.length; c++)
	{
		if(	typeof eval('util.' + level[c].replace(/\//g, '_')) == 'undefined')
			isLoaded = false
	}
	return isLoaded
}

function waitForLoadCompleted()
{
	if(document.readyState == 'complete' && isUtil(_mods))
	{
		clearInterval(_t)
		initLang()
		while(cb = _onloads.shift())
			onLoadCompleted(cb)		
	}		
}

function onLoadCompleted(cb)
{
	if(typeof cb === 'function')
		cb()
}

function addOnLoad(cb)
{
	_onloads.push(cb)
}
initUtil()
