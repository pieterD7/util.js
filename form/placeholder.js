/**
 * @class util.placeholder
 * @description Adds placeholder behaviour to input fields (basically w/ IE)
 * @example util.placeholder.initInputPlaceholders();
 */

util.placeholder = {};

(function () {
    "use strict";

	/**
	 * @description Changes placeholder attribute on input fields 
	 * into default behaviour w/ if not supported by UA
	 * and applies css class .valueishint. When using this function
	 * it is impossible to enter and submit a value equal to the hint.
	 */
	util.placeholder.initInputPlaceholders = function()
	{
		if('placeholder' in document.createElement('input'))
		{
			// Is supported already by UA
			return
		}
		else
		{
			var ar = _sa('input')
			util.forEach(ar, function(i)
			{
				if(!util.trim(i.getAttribute('placeholder')).isEmpty())
				{
					var ii = new HTMLElement(i)
					util.placeholder.addListeners(ii, i.getAttribute('placeholder'))								
					if(util.trim(i.getAttribute('value')).isEmpty() ||
						String(i.getAttribute('placeholder')).equals(i.getAttribute('value')))
					{
						util.fireEvent(i, 'blur')
					}
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
			if(String(inp.node.value).isEmpty() ||
				String(inp.node.value).equals(hint)	)
			{
				inp.addClassName('valueishint')			
				inp.node.value = hint
			}
		})
	
		if(inp.node.form)
		{	
			var f = new HTMLElement(inp.node.form)
			f.addListener('submit', function()
			{
				if(inp.hasClassName('valueishint'))
					inp.node.value = ''
			})
		}
	}
})();
