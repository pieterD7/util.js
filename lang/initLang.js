/**
 * 
 */
util.lang = ''

String.prototype.format = function(ar, as, char)
{
	var ret = this.toString()
	
	/* Set default character for translations to be replaced */
	if(!util.isString(char)) var char = '%'

	/* Set default number type:arg */	
	if(!util.isString(as)) var as = 'integer'
	
	if(util.isObject(ar))
	for(var c = 0; c < ar.length; c++)
	{
		if(util.isNumber(parseFloat(ar[c])))
			ret = ret.replace(RegExp(char), Number(ar[c]).format(as, util.locale))
		else if(util.isString(ar[c]))
			ret = ret.replace(RegExp(char), ar[c])
	}
	return ret
}
	
util.getBestUserLang = function()
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

util.initLang = function()
{
	var ulang = this.getBestUserLang()
	ulang = utilConfig.defLocale
	
	if(util.isObject(util._lang[ulang]))
	{	
		/* this is only true if ulang eq utilConfig.defLocale 
		 * because others need to be loaded yet */
		strings =  _initLang(util._lang[ulang])
		util.locale = util._locale[ulang]
		util.defaultStrings = util._defaultStrings[ulang]
		for(var i in strings)
		{					
			var o = _s(strings[i].sel) || 'store'
			if(util.isUndef(strings[i].value) && o != 'store')
				o.html(strings[i].html)
				else if(o != 'store')
					o.val(strings[i].value)
				else if(o == 'store')
				util.storeString(strings[i], ulang)
		}	
		util.lang = util._lang[ulang]
	}	
	
	this.HttpStatus('lang/' + ulang + '/lang_' + ulang + '.js', 
		function(stat)
		{
			var strings = ''
			if(stat == 200)
			{
				
				{
					ulang = 'en'
					strings =  _initLang(util._lang['en'])
					util.locale = util._locale['en']
					util.defaultStrings = util._defaultStrings['en']					
				}
			}
		})
}
