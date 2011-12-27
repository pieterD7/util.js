/**
 *  
 */

var util = util || {

	/* translations */
	_lang: [],
	
	_defaultStrings: [],
	
	/* regional formats */
	_locale: [],
	
	/* modules */
	_mods: [
	        
	        /* modules */
	        'debug',
	        'array', 'validations', 
	        'selector', 'number', 
	        'struct', 'options',
	        'http', 'io', 
	        'date', 'time', 
	        'enum', 'combobox',
	        
	        /* util proper */
	        'util', 'jsjbridge',
	        
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
             
            'lang/' + 
            (	typeof utilConfig != 'undefined' && 
                     typeof utilConfig.defLocale != 'undefined' ? 
                         	utilConfig.defLocale : 
                         	(typeof utilConfig != 'undefined' && typeof utilConfig.locale != 'undefined' ? 
                         			utilConfig.locale : 
                         				'en')) + 
            '/locale_' + 
            (	typeof utilConfig != 'undefined' && 
            		 typeof utilConfig.defLocale != 'undefined' ? 
            				 utilConfig.defLocale : 
            				(typeof utilConfig != 'undefined' && typeof utilConfig.locale != 'undefined' ? 
                             utilConfig.locale : 
                             'en')), 

             'lang/' + 
             (	typeof utilConfig != 'undefined' && 
            		 typeof utilConfig.defLocale != 'undefined' ? 
            				 utilConfig.defLocale : 
                             (typeof utilConfig != 'undefined' && typeof utilConfig.locale != 'undefined' ? 
                             utilConfig.locale : 
                            'en')) + 
             '/def_' + 
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
           	'display',
           	
           	/* map functions */
           	'map'
           ]
	,

	/* pointer to timer */
	_t:null,

	_onprepare:[],
	
	/* array with functions to be called after load */
	_onloads:[],
	
	storeString: function(string, lang)
	{
		this._lang[lang][string.store] = string.html

	},
	
	loadScript : function(fileName)
	{
		var s = document.createElement('script')
		s.setAttribute('src', fileName + '.js')
		s.setAttribute('type', 'text/javascript')
		document.getElementsByTagName('head')[0].appendChild(s)
	},
	
	initUtil: function()
	{	
		var base = ''
		url = ''
		var scripts = document.getElementsByTagName('script')
		for(var c = 0; c < scripts.length; c++)
		{
			if(String(scripts[c].src).match(/loader/))
				base = scripts[c].src
		}
		var bs = base.split('/')
		for(var c = 0; c < bs.length - 1; c++)
		{
			url += bs[c] + '/'
		}
		for(var c = 0; c < util._mods.length; c++)
		{
			this.loadScript(url + util._mods[c])
		}		
		util._t = setInterval("util.waitForLoadCompleted();", 50)
	},
	
	waitForLoadCompleted: function()	
	{
		if(document.readyState == 'complete')
		{
			clearInterval(util._t)

			util.initLang()
			util._t = setInterval("util.waitForLanguageLoaded();", 50)	
		}		
	},
	
	waitForLanguageLoaded: function()
	{
		if(util.isObject(util.lang))
		{	
			clearInterval(util._t)
			while(cb = util._onprepare.pop())
				this.onLoadCompleted(cb)
			while(cb = util._onloads.pop())
				this.onLoadCompleted(cb)
		}
	},
	
	onLoadCompleted: function(cb)
	{
		if(typeof cb === 'function')
		{
			try{
				cb()				
			}
			catch(err)
			{
				
			}
		}
	}
}

Object.prototype.ready = function(cb)
{
	if(document.readyState == 'complete')
		util.onLoadCompleted(cb)
	else
		util._onloads.push(cb)
}
Object.prototype.prepare = function(cb)
{
		util._onprepare.push(cb)
}
util.initUtil()

