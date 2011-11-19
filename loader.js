/**
 *  
 */

var util = util || {

	/* translations */
	_lang: [],
	
	/* modules */
	_mods: [
	        
	        /* core module */
	        'validations', 
	        
	        /* other modules */
	        'http', 'io', 
	        
	        /* util proper */
	        'util', 
	        
	        /* default language based on utilConfig or 'en' */
	        'lang/' + 
           	(	typeof utilConfig != 'undefined' && typeof utilConfig.defLocale != 'undefined' ? 
           			utilConfig.defLocale : 
           				(typeof utilConfig != 'undefined' && typeof utilConfig.locale != 'undefined' ? 
           				utilConfig.locale : 
           					'en')) + 
           	'/lang_' +
           	(	typeof utilConfig != 'undefined' && 
                typeof utilConfig.defLocale != 'undefined' ? 
                	utilConfig.defLocale : 
                	(typeof utilConfig != 'undefined' && typeof utilConfig.locale != 'undefined' ? 
                			utilConfig.locale : 
                				'en')),
                			
             /* init language */   			
           	'lang/initLang',
           	
           	/* App language blueprint*/
           	'lang/com_lang', 
           	
           	/* module for browsers */
           	'display'
           ]
	,

	/* pointer to timer */
	_t:null,

	/* array with functions to be called after load */
	_onloads:[],
	
	loadScript : function(fileName)
	{
		var s = document.createElement('script')
		s.setAttribute('src', fileName + '.js')
		s.setAttribute('type', 'text/javascript')
		document.getElementsByTagName('head')[0].appendChild(s)
	},
	
	initUtil: function()
	{	
		for(var c = 0; c < util._mods.length; c++)
		{
			this.loadScript(util._mods[c])
		}
		util._t = setInterval("util.waitForLoadCompleted();", 50)
	},
	
	waitForLoadCompleted: function()	
	{
		if(document.readyState == 'complete')
		{
			clearInterval(util._t)
			this.initLang()
			_t = setInterval("util.waitForLanguageLoaded();", 50)	
		}		
	},
	
	waitForLanguageLoaded: function()
	{
		if(this.isObject(util.lang))
		{
			clearInterval(util._t)
			while(cb = util._onloads.shift())
				this.onLoadCompleted(cb)
		}
	},
	
	onLoadCompleted: function(cb)
	{
		if(typeof cb === 'function')
			cb()
	}
}

Object.prototype.ready = function(cb)
{
	if(document.readyState == 'complete')
		onLoadCompleted(cb)
	else
		util._onloads.push(cb)
}

util.initUtil()
