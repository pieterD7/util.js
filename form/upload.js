/**
 * @class util.upload
 * @description File upload field with a new file element after selecting a 
 * file for IE8
 * @example
 * &lt;input type='file' multiple name='atts[]'/>
 * var fs = _sa('input[type=file]')
	util.forEach(fs, function(f)
	{
		util.upload.init(f)
	})
 */

util.upload = {};

(function()
{
	"use strict";
	
	/**
	 * @description Function to detect input type=file + multiple 
	 * support by UA sniffing
	 */
	util.upload.isLame = function()
	{
		return String(navigator.userAgent).match(/MSIE 8\.0/)		
	}
	
	util.upload.onchange = function(ff)
	{
		var fi = util.createElement('input')
		fi.setAttribute('type', 'file')
		fi.setAttribute('name', ff.getNode().getAttribute('name'))
		fi.addListener('change', function()
		{
			util.upload.onchange(fi)
		})
		// Try to insert this element as best as we 
		// can by roughly guessing
		ff.getNode().parentNode.appendChild(fi.getNode())		
	}
	
	util.upload.init = function(f)
	{
		var ff = new HTMLElement(f)
		if(f.getAttribute('multiple') != null &&
			util.upload.isLame() )
		{
			ff.addListener('change', function()
			{
				util.upload.onchange(ff)
			})
		}		
	}
	
})()
