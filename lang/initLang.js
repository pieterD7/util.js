/**
 * 
 */
util.lang = ''

String.prototype.format = function(ar, char, as)
{
	var ret = this.toString()
	
	/* Set default character for translations to be replaced */
	if(!util.isString(char)) var char = '%'

	/* Set default number type:arg */	
	if(!util.isString(as)) var as = 'integer'
	
	if(util.isObject(ar))
	for(var c = 0; c < ar.length; c++)
	{
		if(util.isNumber(parseFloat(ar[c]) || parseInt(ar[c])))
		ret = ret.replace(new RegExp(char), new Number(ar[c]).format(as, util.locale))
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
	
	this.HttpStatus('lang/' + ulang + '/lang_' + ulang + '.js', 
		function(stat)
		{
			if(stat == 200)
			{
				var strings = _initLang(util._lang[ulang])
				for(var i in strings)
				{					
					var o = _s(strings[i].sel)
					if(util.isUndef(strings[i].value) && o)
						o.html(strings[i].html)
					else if(o)
						o.val(strings[i].value)
						
				}			
				util.lang = util._lang[ulang]
				util.locale = util._locale[ulang]
				util.defaultStrings = util._defaultStrings[ulang]
			}
		})
}

