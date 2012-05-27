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
	
	util.canvas.Canvas = function(o)
	{
		this.o = o
		this.context = null
		this.data = null
		this.initData()
		return this
	}
	
	util.canvas.Canvas.prototype.initData = function(left, top)
	{
		this.context = this.o.getContext('2d')
		this.data = this.context.createImageData(1,1)
	}
	
	util.canvas.Canvas.prototype.setPixel = function(pix, x, y)
	{
		this.data = this.context.getImageData(x,y,1,1)
		this.context.putImageData(pix.getPixelData(this.data), x, y)
	}
	
	util.canvas.Pixel = function(r,g,b,a)
	{
		this.r = r
		this.g = g
		this.b = b
		this.a = a
		return this
	}
	
	util.canvas.Pixel.prototype.getPixelData = function(data)
	{
		data.data[0] = this.r | 0 
		data.data[1] = this.g | 0 
		data.data[2] = this.b | 0 
		data.data[3] = this.a | 0
		return data
	}
	
	util.canvas.init = function(sel)
	{
		var cs = _sa(sel)
		util.forEach(cs, function(cvas)
		{
			var c = new util.canvas.Canvas(cvas)
			util.canvas.cvasses.push(c)
		})
	}
	
})()


})