/**
 * 
 */

var _s = [	'validations', 'io', 'util', 'http', 'lang/initLang', 
          	'lang/nl/lang.nl', 'lang/com.lang', 'screen']

var _t = null
var _lang = null

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
	for(var c = 0; c < _s.length; c++)
	{
		loadScript(_s[c])
	}
	_t = setInterval("waitForLoadCompleted();", 50)
}

function waitForLoadCompleted()
{
	if(document.readyState === 'complete' && typeof _lang != 'undefined')
	{
		clearInterval(_t)
		onLoadCompleted(function(){init()}) 
	}		
}

function onLoadCompleted(cb)
{
	if(isFunction(cb))
		cb()
}
initUtil();