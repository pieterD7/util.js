/**
 * 
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

