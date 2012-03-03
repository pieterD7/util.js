/**
 * @param {element} obj Element on page
 * @returns {Object}
 */

util.getCumulativeOffset = function(obj) 
{
    var left, top;
    left = top = 0;
    if (obj.offsetParent) 
    {
        do 
        {
            left += obj.offsetLeft;
            top  += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    var ret = {x : left, y : top}
    return ret
}

util.toggle = function(sel, b)
{
	if(util.isBool(b) && b)
		_s(sel).style("display:block;")
	// b = false or undef : force hide or toggle off			
	else if((util.isBool(b) && b) || _s("#sitemap").node.style.display == 'block')
		_s(sel).style("display:none;")
	// toggle on
	else
		_s(sel).style("display:block;")		
}

util.getStyle = function(el,styleProp)
{
	var x = el;
	if (x.currentStyle)
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	var r = String(y).replace(/[a-z]/g, '');
	return Number(r)
}	

util.initSpreadColToMax = function()
{
	var cols = _sa('.col')
	var _l = getScreenX()
	var colWidth = util.getCumulativeOffset(cols[1]).x + 
					util.getStyle(cols[0], 'margin-right') +
					util.getStyle(cols[0], 'margin-left');
	util.forEach(cols, function(col)
	{
		_l -= colWidth
	})
	if(_l > colWidth)
		_s('.spreadColToMax').style('width:' + (_l + colWidth) +  'px;')
}

