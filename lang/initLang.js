/**
 * 
 */
util.lang = ''

String.prototype.format = function(ar, char)
{
	var ret = this.toString()
	
	/* Set default character to be replaced */
	if(util.isUndef(char)) char = '%'
	
	if(util.isObject(ar))
	for(var c = 0; c < ar.length; c++)
	{
		ret = ret.replace(new RegExp(char), ar[c])
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
				var strings = _initLang(_lang[ulang])
				for(var i in strings)
				{					
					var o = _s(strings[i].sel)
					if(util.isUndef(strings[i].value) && o)
						o.html(strings[i].html)
					else if(o)
						o.val(strings[i].value)
						
				}			
				util.lang = _lang[ulang]
			}
		})
}

