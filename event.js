/**
 * @description Abstract handler with try/catch
 * @param {function} cb Callback
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

