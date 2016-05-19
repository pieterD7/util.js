/**
 * @class util.currrency
 * @description Currency input hat
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

	this.userSet = new util.userSettings('currency')		
		
	this.options = new util.struct([util.options], {value:0})

}

/**
 * @description Set currency
 * @param {String} currency Currency
 * @example util.currency.setCurrency('USD')
 */
util.currency.setCurrency = function(currency)
{
	util.currency.currency = currency
}

/**
 * @description Inits currency hats
 * @param {String} sel Selector
 * @example util.currency.initInputTypeCurrency('input[type=currency]')
 */
util.currency.initInputTypeCurrency = function(sel)
{
	var curs = _sa(sel)
	util.forEach(curs, function(cur)
	{
		var c = new HTMLElement(cur)
		var name = c.getNode().getAttribute('name')
		
		var currency = util.currency.currency
		var rel = c.parseRelAttribute()
		if(!util.isUndef(rel.currency))
			currency = rel.currency
		c.setAttribute('currency', currency)
		
		// Add onfocus handler
		c.addListener('focus', function()
		{
			util.eventHandler(function()
			{
				var val = _s('input[name=' + name + ']').val()
				if(!String(val).isEmpty() && !isNaN(val))
				{
					var nval = String(val).replace(RegExp(util.dataDecimalSeparator.escapeRegExpSpecialChars()), util.locale.decimalSeparator)
					c.val(nval)
				}
				else
				{
					c.val('')
					_s('input[name=' + name + ']').val('')
				}
			})
		})
		
		// Add onblur handler
		c.addListener('blur', function()
		{
			util.eventHandler(function()
			{		
				var currency = c.node.getAttribute('currency') || util.currency.currency
				_s('input[name=' + name + ']').val(
					util.trim(
						String(c.val())
							.replace(RegExp(String(util.locale.decimalSeparator).escapeRegExpSpecialChars()), util.dataDecimalSeparator)
							.replace(RegExp(currency), '')))
				c.val(util.trim(
					util.currency.format(
						String(_s('input[name=' + name + ']').val()), false, currency)))
			})
		})		
		
		// Insert hidden field
		var hid = util.createElement('input')
		hid.setAttribute('type', 'hidden')
		hid.setAttribute('name', name)
		hid.val(c.val())
		c.val(util.currency.format(c.val(), false, currency))
		c.setAttribute('name', '')
		c.setAttribute('rel', name)
		c.getNode().parentNode.appendChild(hid.getNode())
	})
}

/**
 * @description Updates currency hats
 * @param {String} sel Selector
 * @example util.currency.onUpdateLocale('input[type=currency]')
 */
util.currency.onUpdateLocale = function(sel)
{
	var curs = _sa(sel)
	util.forEach(curs, function(cur)
	{
		var c = new HTMLElement(cur)
		var name = c.getNode().getAttribute('rel')
		var currency = util.currency.currency
		var cur = c.node.getAttribute('currency')
		if(!util.isUndef(cur))
			currency = cur
		var hid = _s('input[name=' + name + ']')
		c.val(util.currency.format(hid.val(), false, currency))
	})
}

/**
 * @description Formats currency values based on locale and 
 * util.dataDecimalSeparator
 * @param {Number} num Value
 * @param {Boolean} b Hide currency symbol  
 */
util.currency.format = function(num, b, currency)
{
	var cur = " "
	if(!util.isUndef(b) && b)
		cur = ''
	else
		cur = currency
		
	if(util.locale.currencyAfterNumber)
		return (String(num).replace(
			RegExp(String(util.dataDecimalSeparator).escapeRegExpSpecialChars()),
			util.locale.decimalSeparator)
			+ " " + cur).trim()
	else
		return cur + String(num).replace(
			RegExp(String(util.dataDecimalSeparator).escapeRegExpSpecialChars()),
			util.locale.decimalSeparator)
}
util.prepare(function()
{	
	var localOpt = util.currency.userSet.get('options')
	if(localOpt)
		util.currency.options.data.value = localOpt
	else
		util.currency.options.set(
		[util.currency.flags.marknegativevalues])
})	
