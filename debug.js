/**
 * 
 */

util.debug = {
		
	getAppState: function()
	{
		var ret = ''
		var n = 0
		util._mods.forEach(function(mod)
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
		if(utilConfig.debug)
			util.debug.setMsgContainerSel('div')		
	}
}

util.debug.setGetAppState = function(cb)
{
	if(util.isFunction(cb))
		this.getAppState = cb
}

util.debug.setMsgContainerSel = function(str)
{
	if(util.isString(str))
		this.msgContainerSel = str
}

util.debug.setOnError = function(cb)
{
	if(util.isFunction(cb))
		this.onError.push(cb)
}


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
			
	this.onError.forEach(
		function(onErr)
		{
			if(util.isFunction(onErr))
				onErr(
					document.location.pathname.split('/').slice(2).join('/'),
					state, 
					err)
		})
}

