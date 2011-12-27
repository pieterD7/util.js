/**
 * 
 */

util.debug = {
		
	getAppState: function(){return 0},
	msgContainerSel: '.info'
}

util.debug.setGetAppState = function(cb)
{
	if(util.isFunction(cb))
		this.getAppState = cb
}

util.debug.log = function(err)
{
	var state = 0
	if(util.isFunction(util.debug.getAppState))
		state = util.debug.getAppState()
		
	if(! util.isUndef(util.debug.msgContainerSel))
		_s(util.debug.msgContainerSel)
			.html(
				'<div class="debugMsgHeader">' + util.defaultStrings.debugHeader  + '</div>' +
				'<div class="debugMsgText">' + util.defaultStrings.debugMsg + '<br/>' + 
				document.location.pathname.split('/').slice(2).join('/') + '<br/>' +
				state + '<br/>' + 
				'<i>' + err + '</i></div>'
			)	
}