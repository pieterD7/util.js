/**
 * @param {String} Unique property, can be omitted
 * @returns {Array}
 */

Array.prototype.unique = function(id)
{
	var temp = []
	var _temp = []
	var id = util.isUndef(id) ? false : id
	util.forEach(this, function(t)
	{
		if(id)
		{
			if(util.isUndef(_temp[t[id]]))
			{
					_temp[t[id]] = true
				temp.push(t)
			}
		}
		else
		{
			if(util.isUndef(_temp[t]))
			{
				_temp[t] = true
				temp.push(t)
			}
		}

	})
	return temp
}
/**
 * @param {String} id Identifier
 * @param {String} sep Separator
 * @returns {String}
 * 
 */
Array.prototype.joinEach = function(id, sep)
{
	var ret = ''
	id = util.trim(id)
	sep = util.trim(sep)
	var c = this.length
	util.forEach(this, function(t, i)
	{
		ret += t[id] + (i < c-1? sep : '')
	})
	return ret
}


/**
 * @param {Number} form From, can be omitted
 * @param {Number} to To, can be omitted
 * @param {util.options} opt Options, can be omitted
 * @example
 * var option = ['optionFoo', 'optionBar', 'optionBaz'].unum()  
 */
Array.prototype.unum = function(from, to, opt)
{
	var ret = {}
	var c = 0
	if(util.isUndef(to) && util.isUndef(from) || ( util.isUndef(to) && from == 1))
	{
		var opt = opt || {}
		opt.optunumFlags = true
		from = 1
		to = Math.pow(this.length, 2)
	}
	else if(!util.isUndef(from) && util.isUndef(to) && from == 0)
	{
		to = this.length
	}
	var e = util.unum(from, to, opt)
	util.forEach(this, 
		function(p)
		{
			ret[p] = e[c++]
		})
	return ret
}

/**
 * @param {object} ar Array of items 
 * @param {function} cb Function to be called per item
 */
util.forEach = function(ar, cb)
{
	if(util.isFunction(cb) && util.isObject(ar))
	{
		for(var c = 0; c < ar.length; c++)
		{
			cb(ar[c], c)
		}
	}
}
