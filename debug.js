/**
 * 
 */

util.debug = {
		
	appGetState: function(){return ''},
	msgContainerSel: '.info'
}

util.debug.log = function(err)
{
	var state = 0
	if(util.isFunction(util.debug.appGetState))
		state = util.debug.appGetState()
	if(! util.isUndef(util.debug.msgContainerSel))
		_s(util.debug.msgContainerSel).html(state + ' ' + err)	
}