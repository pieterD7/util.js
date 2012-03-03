
/**
 * @namespace
 * @description Modular framework for app interfaces
 * Tested and developed on:
 * 	- Android 2.2, 2.3.4 native browser
	- Chrome 15
	- Opera 11.60
	- Opera Mini Simulator 4.2
	- Opera Mobile Emulator 11.5
	- Firefox 8 
	- Safari 5
	- IE9
 * 
 */
var util = util || {

	/**
	 * @constructor
	 * @description Util.js error object
	 * @memberOf util
	 * @param {String} err
	 */
	error: function(err)
	{
		var e = Error(err)
		this.message = err
		this.stack = (e.stack && !e.stacktrace?e.stack:(e.stacktrace?e.stacktrace:err))
		return this
	},
	
	/* translations */
	_lang: [],
	
	_defaultStrings: [],
	
	_bankholidays: [],
	
	/* regional formats */
	_locale: [],
	
	/* modules */
	_mods: [
	        
	        /* modules */
	        'debug', 'langbar', 
	        'array', 'validations', 
	        'io', 'number', 
	        'struct', 'options',
	        'http', 'selector', 
	        'date', 'time', 
	        'unum', 'combobox',
	        'event', 
	        
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

                             
              'lang/' + (	typeof utilConfig != 'undefined' && 
            		 typeof utilConfig.defLocale != 'undefined' ? 
            				 utilConfig.defLocale : 
                             (typeof utilConfig != 'undefined' && typeof utilConfig.locale != 'undefined' ? 
                             utilConfig.locale : 
                            'en')) + 
              
              
              '/bank_holidays_' +                               
              	(	typeof utilConfig != 'undefined' && 
                        typeof utilConfig.defLocale != 'undefined' ? 
                               utilConfig.defLocale : 
                               (typeof utilConfig != 'undefined' && typeof utilConfig.locale != 'undefined' ? 
                                utilConfig.locale : 
                                'en')),                             
                             
             /* init language */   			
           	'lang/initLang', 'lang/bankholidays',
           	
           	/* App language blueprint*/
           	'lang/com_lang', 
           	
           	/* module for browsers */
           	'display', 'datePicker', 
           	'crumbs', 'chatbox', 
           	'dnd', 'hud', 'menu',
           	
           	/* map functions */
           	'map', 'geohash',
           	'gmaps', 'finishloading'
           ]
	,

	/* pointer to timer */
	_t:null,

	_onprepare:[],
	
	/* array with functions to be called after load */
	_onloads:[],
	
	/**
	 * @memberOf util 
	 */
	storeString: function(string, lang)
	{
		this._lang[lang][string.store] = string.html

	},
	
	/**
	 * @memberOf util
	 * @function
	 * @param {String} fileName Name of module
	 */
	loadScript : function(fileName)
	{
		var s = document.createElement('script')
		s.setAttribute('src', fileName + '.js')
		s.setAttribute('charset', 'UTF-8');
		s.setAttribute('type', 'text/javascript')
		document.getElementsByTagName('head')[0].appendChild(s)
	},
	
	/**
	 * @memberOf util
	 * @function
	 */
	getBaseUrl : function()
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
		return url
	},
	
	/**
	 * @memberOf util
	 * @description Util.js main init function
	 */
	initUtil: function()
	{	
		var base = ''
		url = util.getBaseUrl()
		for(var c = 0; c < util._mods.length; c++)
		{
			this.loadScript(url + util._mods[c])
		}
		util._t = setInterval("util.waitForLoadCompleted();", 50)
	},
	
	/**
	 * @memberOf util
	 */
	waitForLoadCompleted: function()	
	{
		if(document.readyState === 'complete' &&
			util.finishloading)
		{
			clearInterval(util._t)
			
			util.initLang()

			util.forEach(util._mods, function(m)
			{
				if(typeof util[m] == 'object')
					if(typeof util[m]._init == 'function')
						util[m]._init()
			})

			while(cb = util._onprepare.pop())
				this.onLoadCompleted(cb)
			
			util._t = setInterval("util.waitForLanguageLoaded();", 50)	
		}		
	},
	
	/**
	 * @memberOf util
	 */
	waitForLanguageLoaded: function()
	{
		if(util.isObject(util.lang))
		{	
			clearInterval(util._t)
			
			while(cb = util._onloads.pop())
				this.onLoadCompleted(cb)
		}
	},

	/**
	 * @memberOf util
	 */
	onLoadCompleted: function(cb)
	{
		if(typeof cb === 'function')
		{
			try{
				cb()				
			}
			catch(err)
			{
				util.debug.log(err)
			}
		}
	}
}

/**
 * @param {function} cb
 * @description Called after modules have been prepared
 */
util.ready = function(cb)
{
	util._onloads.push(cb)
}

/**
 * @param {function} cb
 * @description Called after modules loaded
 */
util.prepare = function(cb)
{
		util._onprepare.push(cb)
}
util.initUtil()

