/**
 * 
 */

//@return Object or HTMLElement
function _s(sel)
{
	if(typeof sel === 'object')
		return sel
	else if(typeof sel === 'string')
	{
		var e = document.querySelector(sel)
		if(e)
		{
			return new HTMLElement(e)	
		}
	}
	return 
}
	
//@return Array
function _sa(sel)
{
	if(typeof sel === 'object')
		return [].push(sel)
	else if(typeof sel === 'string')	
		return document.querySelectorAll(sel)
}
