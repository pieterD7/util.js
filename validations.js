var util = util || {}
/**
 * @returns {boolean}
 */
String.prototype.isEmpty = function()
{
	return this.toString() == '' 
}
/**
 * @returns {boolean}
 */
util.isUndef = function(a)
{
	return typeof a === 'undefined'
}
/**
 * @returns {boolean}
 */
util.isObject = function(a)
{
	return a instanceof Object
}
/**
 * @returns {boolean}
 */
util.isString = function(a)
{
	return typeof a === 'string'
}
/**
 * @returns {boolean}
 */
util.isFunction = function(a)
{
	return typeof a === 'function'
}
/**
 * @returns {boolean}
 */
util.isBool = function(a)
{
	return typeof a === 'boolean'
}
/**
 * @returns {boolean}
 */
util.isNumber = function(a)
{
	return typeof a === 'number' && isFinite(a)
}
