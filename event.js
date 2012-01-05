/**
 * 
 */
util.eventHandler = function(cb)
{
	if(util.isFunction(cb))
	{
		try
		{
			return cb()
		}
		catch(err)
		{
			util.debug.log(err)
		}
	}
}

Object.prototype.addListener = function(event, cb)
{
	// W3C style 
	this.addEventListener(event, cb, false)
}
