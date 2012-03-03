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
	return y
}	

util.getScreenX = function()
{
	return document.body.clientWidth || document.documentElement.clientWidth	
}

util.initSpreadColToMax = function()
{
	var cols = _sa('.col')
	if(cols.length > 1)
	{
		var _l = util.getScreenX() - (util.getCumulativeOffset(cols[1]).x - parseInt(util.getStyle(cols[0], 'width') || 0))
		var colWidth = util.getCumulativeOffset(cols[1]).x  +
						parseInt(util.getStyle(cols[0], 'margin-right') || 0) +
						parseInt(util.getStyle(cols[0], 'margin-left') || 0)
							
		util.forEach(cols, function(col)
		{
			_l -= colWidth
		})
	
		if(_l > 0)
			_s('.spreadColToMax').style(
					'width:' + (_l + colWidth) +  'px;' +
					'max-width:' +  (_l + colWidth) +  'px;')
	}
}

