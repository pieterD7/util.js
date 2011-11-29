/**
 * 
 */

Array.prototype.unique = function(id)
{
	var temp = []
	var _temp = []
	var id = util.isUndef(id) ? false : id
	this.forEach(function(t)
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
Array.prototype.joinEach = function(id, sep)
{
	var ret = ''
	var id = util.trim(id)
	var sep = util.trim(sep)
	var c = this.length
	this.forEach(function(t, i)
	{
		ret += t[id] + (i < c-1? sep : '')
	})
	return ret
}
//alert([1, 2, 3, 3].unique().join())
//alert([{name:'ik'},{name:'ik'}, {name:'pieter'}].unique('name').joinEach('name', '|'))