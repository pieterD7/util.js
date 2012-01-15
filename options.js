/**
 * 
 */

util.options = function()
{
	return this
}
util.options.prototype.set = function(flags)
{
	for(var c = 0; c < flags.length; c++)
	{
		this.data.value |= flags[c]
	}
}
util.options.prototype.get = function(flag)
{
	if(util.isUndef(flag))
		return this.data.value
	return this.data.value & flag
}