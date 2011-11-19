/**
 *  
 */

var util = util || {

	_mods: ['validations', 'io', 
           	'util', 'lang/nl/lang_nl', 
           	'http', 'lang/initLang', 
           	'lang/com_lang', 'display']
	,

	_t:null,

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
		if(isObject(util.lang))
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
