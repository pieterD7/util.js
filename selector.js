/**
 * 
 */

//@return Object
function _s(sel)
{
	if(typeof sel === 'object')
		return sel
	else if(typeof sel === 'string')
		return document.querySelector(sel)
}
	
//@return Array
function _sa(sel)
{
	if(typeof sel === 'object')
		return [].push(sel)
	else if(typeof sel === 'string')	
		return document.querySelectorAll(sel)
}
