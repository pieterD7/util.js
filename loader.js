/**
 * 
 */

var _s = [	'validations', 'io', 'util', 'lang/initLang', 
          	'lang/nl/lang.nl', 'lang/com.lang', 'screen']

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
}

initUtil()