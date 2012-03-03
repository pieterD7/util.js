/**
 * Google Maps V3 implementation
 */

util.gmaps = {
	goptions: {
		zoom:10
	} 
}

util.gmaps.setGMap = function(sel)
{   
	if(util.isObject(google))
	{
		var map = new google.maps.Map(_s(sel).getNode(), util.gmaps.goptions);
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