/**
 * 
 */

util.options = function()
{
	return this
}
util.options.prototype.set = function(ops)
{
	for(var c = 0; c < ops.length; c++)
	{
		this.data.value |= ops[c]
	}
}
util.options.prototype.get = function()
{
	return this.data.value
}