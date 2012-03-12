/**
 *  Adds placeholder behaviour to input fields
 */

util.placeholder = {}

util.ready(function()
{
	util.placeholder.initInputPlaceholders()
})

/**
 * @description Changes placeholder attribute on input fields into default behaviour w/ IE
 * and applies css class .valueishint
 */
util.placeholder.initInputPlaceholders = function()
{
	if(navigator.userAgent.match(RegExp(".NET".escapeRegExpSpecialChars())))
	{
		var ar = _sa('input')
		util.forEach(ar, function(i)
		{
			if(!util.trim(i.getAttribute('placeholder')).isEmpty())
			{
				var ii = new HTMLElement(i)
				if(util.trim(i.getAttribute('value')).isEmpty())
				{
					ii.setAttribute('value', i.getAttribute('placeholder'))
					ii.addClassName('valueishint')
				}
				util.placeholder.addListeners(ii, i.getAttribute('placeholder'))				
			}
		})
	}
}	

util.placeholder.addListeners = function(inp, hint)
{
	inp.addListener('keydown', function()
	{
		if(inp.node.value && inp.node.value == hint)
		{
			inp.removeClassName('valueishint')			
			inp.node.value = ''
		}
	})
	
	inp.addListener('blur', function()
	{
		if(String(inp.node.value).isEmpty())
		{
			inp.addClassName('valueishint')			
			inp.node.value = hint
		}
	})
}