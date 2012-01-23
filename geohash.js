// geohash.js
// Geohash library for Javascript
// (c) 2008 David Troy
// modified by Pieter Hoekstra
// Distributed under the MIT License

util.geohash = 
{
		BITS : [16, 8, 4, 2, 1],

		BASE32 : "0123456789bcdefghjkmnpqrstuvwxyz",
		NEIGHBORS : { 	right  : { even :  "bc01fg45238967deuvhjyznpkmstqrwx" },
					  	left   : { even :  "238967debc01fg45kmstqrwxuvhjyznp" },
					  	top    : { even :  "p0r21436x8zb9dcf5h7kjnmqesgutwvy" },
					  	bottom : { even :  "14365h7k9dcfesgujnmqp0r2twvyx8zb" } },
		BORDERS   : { 	right  : { even : "bcfguvyz" },
						left   : { even : "0145hjnp" },
						top    : { even : "prxz" },
						bottom : { even : "028b" } },

		_init : function()
		{						
			this.NEIGHBORS.bottom.odd = this.NEIGHBORS.left.even
			this.NEIGHBORS.top.odd = this.NEIGHBORS.right.even
			this.NEIGHBORS.left.odd = this.NEIGHBORS.bottom.even
			this.NEIGHBORS.right.odd = this.NEIGHBORS.top.even

			this.BORDERS.bottom.odd = this.BORDERS.left.even
			this.BORDERS.top.odd = this.BORDERS.right.even
			this.BORDERS.left.odd = this.BORDERS.bottom.even
			this.BORDERS.right.odd = this.BORDERS.top.even
		}
}

util.geohash.refine_interval = function(interval, cd, mask) {
	if (cd&mask)
		interval[0] = (interval[0] + interval[1])/2;
  else
		interval[1] = (interval[0] + interval[1])/2;
}

/**
 * @function 
 * @param {String} srcHash Source hash
 * @param {String} dir Direction (n, ne, ...)
 * 
 */
util.geohash.calculateAdjacent = function(srcHash, dir) {
	srcHash = srcHash.toLowerCase();
	var lastChr = srcHash.charAt(srcHash.length-1);
	var type = (srcHash.length % 2) ? 'odd' : 'even';
	var base = srcHash.substring(0,srcHash.length-1);
	if (this.BORDERS[dir][type].indexOf(lastChr)!=-1)
		base = calculateAdjacent(base, dir);
	return base + this.BASE32[this.NEIGHBORS[dir][type].indexOf(lastChr)];
}

/**
 * @param {String} geohash Geo hash
 * @returns {Object}
 */
util.geohash.decodeGeoHash = function(geohash) {
	var is_even = 1;
	var lat = []; var lon = [];
	lat[0] = -90.0;  lat[1] = 90.0;
	lon[0] = -180.0; lon[1] = 180.0;
	lat_err = 90.0;  lon_err = 180.0;
	
	for (i=0; i<geohash.length; i++) {
		c = geohash[i];
		cd = this.BASE32.indexOf(c);
		for (j=0; j<5; j++) {
			mask = this.BITS[j];
			if (is_even) {
				lon_err /= 2;
				util.geohash.refine_interval(lon, cd, mask);
			} else {
				lat_err /= 2;
				util.geohash.refine_interval(lat, cd, mask);
			}
			is_even = !is_even;
		}
	}
	lat[2] = (lat[0] + lat[1])/2;
	lon[2] = (lon[0] + lon[1])/2;

	return { latitude: lat[1], longitude: lon[1]};
}

/**
 * @param {Number} latitude Latitude
 * @param {Number} longitude Longitude
 * @returns {String}
 */
util.geohash.encodeGeoHash = function(latitude, longitude) {
	var is_even=1;
	var i=0;
	var lat = []; var lon = [];
	var bit=0;
	var ch=0;
	var precision = 12;
	geohash = "";

	lat[0] = -90.0;  lat[1] = 90.0;
	lon[0] = -180.0; lon[1] = 180.0;
	
	while (geohash.length < precision) {
	  if (is_even) {
			mid = (lon[0] + lon[1]) / 2;
	    if (longitude > mid) {
				ch |= this.BITS[bit];
				lon[0] = mid;
	    } else
				lon[1] = mid;
	  } else {
			mid = (lat[0] + lat[1]) / 2;
	    if (latitude > mid) {
				ch |= this.BITS[bit];
				lat[0] = mid;
	    } else
				lat[1] = mid;
	  }

		is_even = !is_even;
	  if (bit < 4)
			bit++;
	  else {
			geohash += this.BASE32[ch];
			bit = 0;
			ch = 0;
	  }
	}
	return geohash;
}
/*
 * 	public function enumBetweenGeoHashes($srcHash, $destHash, $n = 2, $chars = 5)
	{

		if(!isset($srcHash))
			return;
		
		if($srcHash == $destHash)
		{
			return $srcHash;
		}	
			
		$hash = substr($srcHash, 0, $chars);
		$hash2 = substr($destHash, 0, $chars);
		$dpos = $this->decode($hash2);		

		$hashes = array();
		$_ha = array($hash);
		$h = $hash;
		for($c = 0; $c < 500; $c++)
		{	
			$pos = $this->decode($h);
			$dir = $this->toDirection($pos[1],$pos[0], $dpos[1], $dpos[0]);

			if($n > 0)
			{
				foreach($this->dirs as $dd)
				{
					$hh = $this->calculateAdjacent($h, $dd);
					if(!in_array($hh, $this->seas))
						$_ha[] = $hh;
				}
			}
			else 
			{
				$hh = $this->calculateAdjacent($h, $dir);
					if(!in_array($hh, $this->seas))
						$_ha[] = $hh;
			}
			$hn = $this->calculateAdjacent($h, $dir);
			$fin = false;
			foreach($this->dirs as $d)
			{
				$ch = $hn;
				for($cc = 0; $cc < $n; $cc++)
				{
					if(strlen($d) == 2 && $cc == 1) continue;
					$ad = $this->calculateAdjacent($ch, $d);
					$ch = $ad;
					if(!in_array($ad, $this->seas))
						$_ha[] = $ad;
					if($ad == $hash2)
					{
						$fin = true;
						break;
					}	
			
				}
			}
			if($hn == $hash2 || $fin)
			{
				break;
			}
			$h = $hn;
		}
		$_ha = array_unique($_ha);
		//sort($_ha, SORT_STRING | SORT_LOCALE_STRING);
		$s = implode("|", $_ha);
		return $s;
	}
 * 
 */