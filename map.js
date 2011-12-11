/**
 * 
 */
util.toDegrees = function(r)
{
	return r * (180 / Math.PI);
}

util.toRad = function(d)
{
	return d * (Math.PI / 180);
}

util.toDirection = function(orgLng, orgLat, targetLng, targetLat)
{
	var deg = '';
	var dif_lat = targetLat - orgLat;
	var dif_long =  targetLng - orgLng;

	dif_long2 = 180 + orgLng - targetLng;
	dif_long3 = -180 + orgLng - targetLng; 

	if(Math.abs(dif_long3) < Math.abs(dif_long2) && (Math.abs(dif_long3) < Math.abs(dif_long)))
		dif_lng = dif_long3;
	else if(Math.abs(dif_long2) < Math.abs(dif_long))
		dif_lng = dif_long2;
	else 
		dif_lng = dif_long;
			 
	deg = util.toDegrees(Math.atan2(dif_lng, dif_lat));
	var dir = false
	
	var dirs = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
		.forEach(function(d, i){
			if(	((deg + 360) % 360 >= i * (360 / 8) - (360 / 16)) &&
					((deg + 360) % 360 < i * (360 / 8) + (360 / 16)))
					dir = d;		
			
		})
	return dir;
}

//alert(util.toDirection(5.4, 53, 5.3, 52))