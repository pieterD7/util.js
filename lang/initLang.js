/**
 * 
 */
util.lang = null
util.curLang = ''

/**
 * @description Formats string
 * @param {array} ar Array of identifiers
 * @param {string} as Type of replacements
 * @param {string} char Replacement character
 */
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
	    return 'en'
}

util.initLang = function()
{
	var ulang = this.getBestUserLang()	
	ulang = typeof utilConfig === 'object' && 
			typeof utilConfig.defLocale === 'object' ? utilConfig.defLocale : 'en'
	var url = util.getBaseUrl()
	var locales = ['en']
	if( typeof utilConfig === 'object')
		typeof utilConfig.locales === 'object' ? utilConfig.locales : ['en']
	util.forEach(locales, function(iso_code)
	{
		var s = url + 'lang/' + iso_code + '/' + 'lang_' + iso_code 
		util.loadScript(s)
		s = url + 'lang/' + iso_code + '/' + 'def_' + iso_code
		util.loadScript(s)
		s = url + 'lang/' + iso_code + '/' + 'locale_' + iso_code
		util.loadScript(s)		
		s = url + 'lang/' + iso_code + '/bank_holidays_' + iso_code
		util.loadScript(s)
	})

	if(util.isObject(util._lang[ulang]))
	{
		/* this is only true if ulang eq utilConfig.defLocale 
		 * because others need to be loaded yet */
		util.curLang = ulang
		strings =  _initLang(util._lang[ulang])
		util.locale = util._locale[ulang]
		util.defaultStrings = util._defaultStrings[ulang]
		for(var i in strings)
		{	
			try
			{
				var o = _s(strings[i].sel)
				if(util.isObject(o))
				{
					if(strings[i].html && o != 'store')
						o.setHtml(strings[i].html)
					else if(strings[i].value)
						o.val(strings[i].value)
					else if(o == 'store')
						util.storeString(strings[i], ulang)
				}
			}
			catch(e)
			{
				util.debug.log(i)
			}
		}	
		util.lang = util._lang[ulang]
		util.bankholidays = util._bankholidays[ulang]
	}	
	
//	this.HttpStatus(util.getBaseUrl() + '/lang/' + ulang + '/lang_' + ulang + '.js', 
//		function(stat)
//		{
//			var strings = ''
//			if(stat == 200)
//			{
//				
//				{
//					ulang = 'en'
//					strings =  _initLang(util._lang['en'])
//					util.locale = util._locale['en']
//					util.defaultStrings = util._defaultStrings['en']					
//				}
//			}
//		})
}
