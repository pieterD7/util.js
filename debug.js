/**
 * @class
 */

util.debug = {
		
	/** Some browsers don't provide a stacktrace, currently not used. Code
	 * taken from http://code.google.com/p/greasefire */
	stack: function() 
	{
		var callstack = [];
		var currentFunction = arguments.callee.caller;
		while (currentFunction) {
			var fn = currentFunction.toString();
			var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf(' ')) || 'anonymous';
			callstack.push(fname);
			currentFunction = currentFunction.caller;
		}
		return callstack;
	},	
	
	/**
	 * @function
	 * @description Function to be called on debug
	 */
	getAppState: function()
	{
		var ret = ''
		var n = 0
		util.forEach(util._mods, function(mod)
		{
			if(util.isObject(util[mod]) && util.isObject(util[mod].options))
			{
				if(!n++ == 0)
					ret += ', ' 
				ret += 'opt_' + mod + '=' + util[mod].options.data.value
			}
		})
		return ret
	},
	msgContainerSel: null,
	onError:[],
	_init: function()
	{
		if(typeof utilConfig === 'object' && utilConfig.debug)
			util.debug.setMsgContainerSel('div')		
	}
}

/**
 * @function
 * @description Set function to be called on debug
 * 
 */
util.debug.setGetAppState = function(cb)
{
	if(util.isFunction(cb))
		this.getAppState = cb
}

/**
 * @function
 * @description Set HTML element containing the debug messages
 * 
 */
util.debug.setMsgContainerSel = function(str)
{
	if(util.isString(str))
		this.msgContainerSel = str
}

/**
 * @function
 * @description Sets function to be called on error
 * 
 */
util.debug.setOnError = function(cb)
{
	if(util.isFunction(cb))
		this.onError.push(cb)
}

/**
 * @function
 * @description The function displaying the debug info
 * 
 */
util.debug.log = function(err)
{
	var state = 0
	if(util.isFunction(util.debug.getAppState))
		state = util.debug.getAppState()
	var htmlstr = '<div class="debugMsgHeader">' + util.defaultStrings.debugHeader  + '</div>' +
	'<div class="debugMsgText">' + util.defaultStrings.debugMsg.toFormattedText() + '<br/>' + 
	document.location.pathname.split('/').slice(2).join('/') + '<br/>' +
	state + '<br/>' + 
	'<pre>' + err.stack + '</pre></div>'	

	if(util.isString(util.debug.msgContainerSel) &&
		_s(util.debug.msgContainerSel))
		_s(util.debug.msgContainerSel)
			.setHtml(
					htmlstr
			)
			
	util.forEach(this.onError,
		function(onErr)
		{
			if(util.isFunction(onErr))
				onErr(
					document.location.pathname.split('/').slice(2).join('/'),
					state, 
					err)
		})
}

