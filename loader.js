/**
 *  
 */

var util = {}

var _mods = [	'validations', 'io', 'util', 'http', 
             	'lang/nl/lang_nl', 'lang/initLang', 
             	'lang/com_lang', 'screen']

var _t = null
var _onloads = []

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
	for(var c = 0; c < _mods.length; c++)
	{
		loadScript(_mods[c])
	}

	_t = setInterval("waitForLoadCompleted();", 50)
}

function waitForLoadCompleted()
{
	if(document.readyState == 'complete')
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

Object.prototype.ready = function(cb)
{
	if(document.readyState == 'complete')
		onLoadCompleted(cb)
	else
		_onloads.push(cb)
}
initUtil()
