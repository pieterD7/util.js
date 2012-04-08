/**
 * Google Maps V3 implementation
 */

util.gmaps = {
	sel:null,
	goptions: {
		zoom:10
	} 
};

(function () {
    "use strict";

	util.gmaps.setMap = function(sel)
	{   
		if(util.isString(sel))
			util.gmaps.sel = sel
		else
			throw(new util.error("Invalid parameter for 'gmaps' 'setMap'"))
	}
	
	util.gmaps.showMap = function(str)
	{
		if(util.isObject(google))
		{
			if(util.isString(str))
			{
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({"address":str}, function(result, status)
				{
					var lat = null, lng = null
					lat = result[0].geometry.location.lat()
					lng = result[0].geometry.location.lng()
					util.extend(util.gmaps.goptions, {center:new google.maps.LatLng(lat, lng)})
					var map = new google.maps.Map(_s(util.gmaps.sel).getNode(), util.gmaps.goptions);					
				})
				  
			}
		}
	}
	
	util.prepare(function()
	{
		if(typeof google !== 'undefined' &&
			util.isObject(google))
		{
			util.gmaps.goptions = util.extend(util.gmaps.goptions,{
		      center: new google.maps.LatLng(52, 5.2),
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    })
		}
	})
})()