/**
 * 
 */

util.currency = {
	currency: 'EUR',
	cPickers: null,
	flags:[],
	options:null
}

util.currency._init = function()
{
	this.flags =
		[ 'marknegativevalues'].unum()
	this.options = new util.struct([util.options], {value:0})

}

util.currency.setCurrency = function(currency)
{
	util.currency.currency = currency
}

util.currency.initInputTypeCurrency = function()
{
	var curs = _sa('input[type=currency]')
	util.forEach(curs, function(cur)
	{
		var c = new HTMLElement(cur)
		var name = c.getNode().getAttribute('name')
		
		// Add onfocus handler
		c.addListener('focus', function()
		{
			util.eventHandler(function()
			{
				var val = _s('input[name=' + name + ']').val()
				if(!String(val).isEmpty())
				{
					var nval = String(val).replace(RegExp(util.dataDecimalSeparator.escapeRegExpSpecialChars()), util.locale.decimalSeparator)
						c.val(nval)
				}
			})
		})
		
		// Add onblur handler
		c.addListener('blur', function()
		{
			util.eventHandler(function()
			{			
				_s('input[name=' + name + ']').val(
					util.trim(
						String(c.val())
							.replace(RegExp(String(util.locale.decimalSeparator).escapeRegExpSpecialChars()), util.dataDecimalSeparator)
							.replace(RegExp(util.currency.currency), '')))
				c.val(util.trim(
					util.currency.format(
						String(_s('input[name=' + name + ']').val()))))
			})
		})		
		
		// Insert hidden field
		var hid = util.createElement('input')
		hid.setAttribute('type', 'hidden')
		hid.setAttribute('name', name)
		hid.val(c.val())
		c.val(util.currency.format(c.val()))
		c.setAttribute('name', '')
		c.setAttribute('rel', name)
		c.getNode().parentNode.appendChild(hid.getNode())
	})
}

util.currency.onUpdateLocale = function()
{
	var curs = _sa('input[type=currency]')
	util.forEach(curs, function(cur)
	{
		var c = new HTMLElement(cur)
		var name = c.getNode().getAttribute('rel')
		var hid = _s('input[name=' + name + ']')
		c.val(util.currency.format(hid.val()))
	})
}

util.currency.format = function(num, b)
{
	var cur = util.currency.currency + " "
	if(!util.isUndef(b) && b)
		cur = ''
	if(util.locale.currencyAfterNumber)
		return String(num).replace(
			RegExp(String(util.dataDecimalSeparator).escapeRegExpSpecialChars()),
			util.locale.decimalSeparator)
			+ " " + cur
	else
		return cur + String(num).replace(
			RegExp(String(util.dataDecimalSeparator).escapeRegExpSpecialChars()),
			util.locale.decimalSeparator)
}

util.ready(function()
{
})