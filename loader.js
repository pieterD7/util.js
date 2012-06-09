
/**
 * @namespace
 * @description Modular framework for app interfaces
 * Tested and developed w/ on:
 * - jQuery
 * - Google Maps v3
 * 
 * 	- Android 2.2, 2.3.4, 4.0 native browser
	- Chrome 15-19
	- Opera 11.60
	- Opera Mini Simulator 4.2
	- Opera Mobile Emulator 11.5
	- Safari 5
	- IE9
 * 
 * utiljs loader If available, uses yepnope.js from http://yepnopejs.com/ 
 * to load the modules.
 * 
 */
var util = util || {

	/**
	 * @constructor
	 * @description utiljs error object
	 * @memberOf util
	 * @param {String} err
	 */
	error: function(err)
	{
		var e = Error(err)
		this.message = err
		this.stack = (e.stack && !e.stacktrace?e.stack:(e.stacktrace?e.stacktrace:err))
		this.toString = function(){return "[util.error]"}
		return this
	},
	
	/**
	 * @constructor 
	 * @description utiljs warning object for interfaces on desktop computers
	 * @memberOf util
	 * @param {String} str Text
	 */
	warning:function(str)
	{
		this.message = str
		this.toString = function(){return "[util.warning]"}
		return this
		
	},
	isDebug:(typeof utilConfig !== 'undefined' ? 
			(utilConfig.debug ? utilConfig.debug : false) : false),
	
	/* kind of user agent */
	isTouchDevice: false,
	
	hasLocalStorage: false,
	
	isCompatibleUA: false,
	
	/* translations */
	_lang: [],
	
	_defaultStrings: [],
	
	_bankholidays: [],
	
	/* regional formats */
	_locale: [],
	
	userSet:null,
	
	selectedLocale:null,
	
	dataDecimalSeparator: '.',
	
	iconDir: 'uicons/',
	
	/* modules */
	_mods: [
	        
	        /* modules */
	        'array', 'validations', 
	        'io', 'number', 
	        'struct', 'options',
	        'http', 'selector', 
	        'date', 'time', 
	        'unum',  'debug',  
	        'event', 'sprintf',
	        'json', 'string',
	        
	        // from http://sizzlejs.com/
	        'external/sizzle',
	        
	        // from http://modernizr.com
	        'external/modernizr',
	        
           	/* the js part of the 960 grid layout 
           	 * from http://adapt.960.gs */
           	'external/adapt',
	        
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
              
              
              '/bankholidays_' +                               
              	(	typeof utilConfig != 'undefined' && 
                        typeof utilConfig.defLocale != 'undefined' ? 
                               utilConfig.defLocale : 
                               (typeof utilConfig != 'undefined' && typeof utilConfig.locale != 'undefined' ? 
                                utilConfig.locale : 
                                'en')),                             
                             
             /* init language */   			
           	'lang/initLang', 'lang/bankholidays',
           	
           	'jsjbridge', 'emulator', 
           	
           	/* App language blueprint */
           	'lang/com_lang', 
           	
           	/* modules for browsers */
           	'content',
           	'css', 'theme', 
          	'dnd', 'chatbox',   
           	'cpath', 'menu',
           	'setman', 'icons', 
           	
           	'form/datepicker', 
           	'form/currency',
           	'form/upload',
           	'form/combobox',
           	'form/country',
           	'form/placeholder',
           	         
           	'layout/layout',
           	'layout/columnlayout',
           	'layout/tablayout',
           	'layout/fixedsplitter',
           	
           	'crumbs', 'tilt', 
           	'ui/canvas',
           	'ui/langbar',
           	'ui/hud',
           	'ui/toolbar',
           	'ui/button', 
           	'ui/icon',
           	
           	'app',
           //	'datagrid', 
           	//'apps/maersk',
           	'apps/fractal',
  
           	
           	/* html5 local storage */
           	'sql', 'localstorage',
           	
           	/* map functions */
           	'map', 'geohash',
           	'gmaps', 
           	
           	//'tests/general', 
           	'finishloading'
           ]
	,

	/* pointer to timer */
	_t:null,

	_onprepare:[],
	
	/* array with functions to be called after load */
	_onloads:[],
	
	/*  array with callbacks to be called when steady */
	_steady:[],
	
	huds:[],
	
	getLocaleString: function()
	{
		var ret = util.selectedLocale
		if(util.selectedLocale.length == 4) 
			ret = util.selectedLocale.substring(0,2) + 
			'-' + util.selectedLocale.substring(2,4)
		return ret
	},
	
	/**
	 * @memberOf util 
	 */
	storeString: function(string, lang)
	{
		this._lang[lang][string.store] = string.html

	},
	
	setDataDecimalSeparator: function(sep)
	{
		util.dataDecimalSeparator = sep
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
	 * @descripton sanity check
	 */
	sanityCheck: function()
	{
//		if((typeof document.querySelector === 'function' || 
//				typeof document.querySelector === 'object'))
//		{
//			alert("Check for document.querySelector FAILED.\nPlease upgrade your browser " +
//					"or read http://msdn.microsoft.com/en-us/library/cc288326(v=vs.85).aspx")
//		}else
		if(1)
		{
			util.isCompatibleUA = true
			util.isTouchDevice = ""//"onTouchStart" in document.documentElement
			util.hasLocalStorage = ""//'localStorage' in window && window['localStorage'] !== null;
		}
	},
	
	/**
	 * @memberOf util
	 * @description Util.js main init function
	 */
	initUtil: function()
	{	
		this.sanityCheck()
		if(window.yepnope)
		{
			var mods = this._mods
			var ms = []
			for(var c = 0; c < mods.length; c++)
			{
				ms.push(util.getBaseUrl() + mods[c] + '.js')
			}
			
			yepnope({
				load:ms, 
				complete:util.initWaitForLanguageLoaded})
		}
		else if(util.isCompatibleUA)
		{
			var base = ''
				url = util.getBaseUrl()
				for(var c = 0; c < util._mods.length; c++)
				{
					this.loadScript(url + util._mods[c])
				}
			util._t = setInterval("util.waitForLoadCompleted();", 50)
		}
	},
	
	
	initWaitForLanguageLoaded: function()
	{
		util._t = setInterval("util.waitForLoadCompleted();", 50)		
	},
	
	
	/**
	 * @memberOf util
	 * @description Prepares mod name (strips pathname)
	 * @returns {String} name
	 */
	prepareModName: function(name)
	{
		return name.replace(/(\w*[/])*/, '')
	},
	
	/**
	 * @memberOf util
	 */
	waitForLoadCompleted: function()	
	{
		if(document.readyState === 'complete')
		{
			clearInterval(util._t)
			
			util.initLang()
			util.isTouchDevice = Modernizr.touch
			util.hasLocalStorage = Modernizr.localstorage 
			
			util.forEach(util._mods, function(m)
			{
				var mm = util.prepareModName(m)
				if(typeof util[mm] == 'object')
					if(typeof util[mm]._init == 'function')
						util[mm]._init()
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
			while(cb = util._steady.pop())
				this.onLoadCompleted(cb)

			util.userSet = new util.userSettings('util')	
				
			if(util.langbar)
			{
				var userLang = util.userSet.get('locale')
				util.langbar.selectLang(userLang)
			}

				
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

util.steady = function(cb)
{
	if(document.documentElement.readyState === 'complete' &&
		util.isFunction(cb))
			cb()
	else
		util._steady.push(cb)	
}

/**
 * @param {function} cb
 * @description Called after modules have been prepared
 */
util.ready = function(cb)
{
	if(document.documentElement.readyState === 'complete' &&
		util.isFunction(cb))
			cb()
	else
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

