/**
 * @class util.canvas
 * @description HTML5 canvas module 
 */

util.canvas = {
	cvasses:[]	
};

(function()
{
	"use strict"
	
	util.canvas.Canvas = function(o, width, height)
	{
		this.o = o
		this.context = null
		this.data = null
		this.width = width 
		this.height = height 
		this.initData(this.width, this.height)
		return this
	}
	
	util.canvas.Canvas.prototype.initData = function(width, height)
	{
		this.context = this.o.getContext('2d')
		this.data = this.context.createImageData(width, height)
	}
	
	util.canvas.Canvas.prototype.setPixel = function(pix, x, y)
	{
		this.data = pix.putPixelData(this.data, x, y)
	}

	util.canvas.Canvas.prototype.draw = function()
	{
		this.context.putImageData(this.data, 0, 0)		
	}
	
	util.canvas.Pixel = function(r,g,b,a)
	{
		this.r = r
		this.g = g
		this.b = b
		this.a = a
		return this
	}
	
	util.canvas.Pixel.prototype.putPixelData = function(data, x, y)
	{
		var index = (x + y * data.width) * 4;
		data.data[index+0] = this.r | 0 
		data.data[index+1] = this.g | 0 
		data.data[index+2] = this.b | 0 
		data.data[index+3] = this.a | 0
		return data
	}
	
	util.canvas.init = function(sel, width, height)
	{
		var cs = _sa(sel)
		util.forEach(cs, function(cvas)
		{
			var c = new util.canvas.Canvas(cvas, width, height)
			util.canvas.cvasses.push(c)
		})
		return util.canvas.cvasses
	}
	
})()
