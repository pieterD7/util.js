/**
 * 
 */

Number.prototype.format = function(as, locale)
{
	if(!util.isString(as)) var as = 'integer'
	var n = ''
	var arg = 2
	
	if(as.indexOf(":") > -1)
		arg = parseInt(as.split(":")[1])

	if(as.match(/precision/i))
	{
		n = Number(this.valueOf()).toPrecision(arg)
		
	}
	else if(as.match(/float/i))
	{
		n = Number(this.valueOf()).toFixed(arg)
	}	
	else
		n = Number(this.valueOf())
	return util._formatNumber(n, locale.thousandSeparator, locale.decimalSeparator)
}
util._formatNumber = function(number, thousand, decimal)
{
	var _s = new String(number)
	var decpos = _s.indexOf(".") > -1 ? true : false
	var expos = _s.indexOf("e") > -1 ? true : false
			
	var decimalPos = _s.length  
	if(expos)
		decimalPos =  _s.indexOf('e')
	else if(decpos)
		decimalPos = _s.indexOf(".")
		
	if(util.isString(decimal)) 
		_s = _s.replace(/\./, decimal)
	
	var s = ''
	for(var c = 0; c < decimalPos; c++)
	{
		if( c % 3 == 0 && c > 0)
		{
			s = thousand + s
		}
		s = _s[decimalPos - c - 1] + s
	}
	if(decpos || expos)
		s += _s.slice(decimalPos, _s.length)

	return s
}

