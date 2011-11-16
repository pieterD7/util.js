/**
 * 
 */
var _lang = {}
var lang = ''

function getBestUserLang()
{
	    if ( navigator.language ) {
	        return navigator.language;
	    }
	    else if ( navigator.userLanguage ) {
	        return navigator.userLanguage;
	    }	    
	    else if ( navigator.browserLanguage ) {
	        return navigator.browserLanguage;
	    }
	    else if ( navigator.systemLanguage ) {
	        return navigator.systemLanguage;
	    }
	    return ''
}

function chooseLang()
{
	var lang = '', ulang = getBestUserLang()

	switch(typeof _lang[ulang])
	{
		case 'undefined':
			lang = _lang.nl
			break;
		default: 
			lang = _lang[ulang]
	}
	return lang
}

function initLang()
{
	lang = chooseLang()
	var strings = _initLang(lang)
	
	for(var i in strings)
	{
		var o = _s(strings[i].sel)			
		if(isUndef(strings[i].value) && o)
			o.html(strings[i].html)
		else if(o)
			o.val(strings[i].value)
			
	}
}