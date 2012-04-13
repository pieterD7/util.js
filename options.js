/**
 * @constructor
 */

util.options = function()
{
	return this
}
/**
 * @param {Arrray} flags Flags
 */
util.options.prototype.set = function(flags)
{
	for(var c = 0; c < flags.length; c++)
	{
		this.data.value ^= flags[c]
	}
}
/**
 * @param {Number} flag Flag
 * @returns {Number}
 */
util.options.prototype.get = function(flag)
{
	if(util.isUndef(flag))
		return this.data.value
	return this.data.value & flag
}