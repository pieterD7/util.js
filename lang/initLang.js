/**
 * @description World regions. Defines a set of locales.
 * Europe Middle East and Africa (EMEA),
 * North, Central, and South America (NCSA),
 * Asia Pacific, and Japan (APAC)	
 */
util.regions = 
{
	EMEA: ['en','nl'],
	NCSA: ['en-us'],
	APAC: ['en-us']
}

util.lang = null
util.curLang = ''

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
	var region = 'EMEA'
	var ulang = this.getBestUserLang()	
	ulang = typeof utilConfig != 'undefined' && 
			typeof utilConfig.defLocale != 'undefined' ? utilConfig.defLocale : 'en'
	var url = util.getBaseUrl()
	var locales = ['en']

	if(	typeof utilConfig != 'undefined' &&
		typeof utilConfig.region != 'undefined')
	{
		region = utilConfig.region
		locales = util.regions[region]	
	}
	else if( typeof utilConfig === 'object')
		typeof utilConfig.locales === 'object' ? locales = utilConfig.locales : null
				
	util.forEach(locales, function(iso_code)
	{
		var s = url + 'lang/' + iso_code + '/' + 'lang_' + iso_code 
		util.loadScript(s)
		s = url + 'lang/' + iso_code + '/' + 'def_' + iso_code
		util.loadScript(s)
		s = url + 'lang/' + iso_code + '/' + 'locale_' + iso_code
		util.loadScript(s)		
		s = url + 'lang/' + iso_code + '/bankholidays_' + iso_code
		util.loadScript(s)
	})

	ulang = String(ulang).replace(/[-]/, '')
	if(util.isObject(util._lang[ulang]))
	{
		/* this is only true if ulang eq utilConfig.defLocale 
		 * because others need to be loaded yet */
		try
		{		
			util.curLang = ulang
			strings =  _initLang(util._lang[ulang])
			util.locale = util._locale[ulang]
			util.defaultStrings = util._defaultStrings[ulang]
			for(var i in strings)
			{	
				var o = _s(strings[i].sel)
					if(util.isObject(o))
					{
						if(strings[i].html && o != 'store')
							o.setHtml(strings[i].html)
						else if(strings[i].value && o != 'store')
							o.val(strings[i].value)
						else if(strings[i].placeholder && o != 'store')
							o.placeholder(strings[i].placeholder)
						else if(o == 'store')
							util.storeString(strings[i], ulang)
					}
			}	
			util.lang = util._lang[ulang]
			util.selectedLocale = ulang
			util.bankholidays = util._bankholidays[ulang]
			util.defaultStrings = util._defaultStrings[ulang]
		}
		catch(e)
		{
			util.debug.log(i)
		}	
	}	
}
