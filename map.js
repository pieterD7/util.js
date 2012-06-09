
(function () {
    "use strict";
 

	/**
	 * @param {Number} r Radians
	 * @returns {Number}
	 */
	util.toDegrees = function(r)
	{
		return r * (180 / Math.PI);
	}
	
	/**
	 * @param {Number} d Degrees
	 * @returns {Number}
	 */
	util.toRad = function(d)
	{
		return d * (Math.PI / 180);
	}
	
	/**
	 * @param {Number} orgLng From longitude
	 * @param {Number} orgLat From latitude
	 * @param {Number} targetLng To logitude
	 * @param {Number} targetLat To latitude
	 * @returns {String} The direction (n, ne, ...)
	 */
	util.toDirection = function(orgLng, orgLat, targetLng, targetLat)
	{
		var deg = '';
		var dif_lat = targetLat - orgLat;
		var dif_long =  targetLng - orgLng;
	
		var dif_long2 = 180 + orgLng - targetLng;
		var dif_long3 = -180 + orgLng - targetLng; 
		var dif_lng = null
		
		if(Math.abs(dif_long3) < Math.abs(dif_long2) && (Math.abs(dif_long3) < Math.abs(dif_long)))
			dif_lng = dif_long3;
		else if(Math.abs(dif_long2) < Math.abs(dif_long))
			dif_lng = dif_long2;
		else 
			dif_lng = dif_long;
				 
		deg = util.toDegrees(Math.atan2(dif_lng, dif_lat));
		var dir = false
		
		var dirs = util.forEach(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'],
			function(d, i){
				if(	((deg + 360) % 360 >= i * (360 / 8) - (360 / 16)) &&
						((deg + 360) % 360 < i * (360 / 8) + (360 / 16)))
						dir = d;		
				
			})
		return dir;
	}
})()