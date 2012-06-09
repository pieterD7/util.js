/**
 * @class util.canvas
 * @description HTML5 canvas module 
 */

util.canvas = {
	cvasses:[],
	blendModes: [
		"source-over", // (default)
		"source-atop",
		"source-in",
		"source-out",
		"destination-over",
		"destination-atop",
		"destination-in",
		"destination-out",
		"lighter",
		"copy",
		"xor"]
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
		this.data = pix.putPixelData(this.data, x | 0, y | 0)
	}

	util.canvas.Canvas.prototype.line = function(x0, y0, x1, y1)
	{
		this.context.strokeStyle = 'black'
		this.context.beginPath()
		this.context.moveTo(x0, y0)
		this.context.lineTo(x1, y1)
		this.context.stroke()
	}
	
	util.canvas.Canvas.prototype.fillRect = function(st, x, y, width, height)
	{
		this.context.save()
		this.context.fillStyle = st
		this.context.fillRect(x, y, width, height)
		this.context.restore()
	}
	
	util.canvas.Canvas.prototype.loadImage = function(url, alpha, bmode)
	{
		var imageObj = new Image();
		var me = this
	 	imageObj.onload = function() 
	 	{
			me.context.scale(1.5,1.5)
			me.context.globalAlpha = alpha
			me.context.globalCompositeOperation = bmode
         	me.context.drawImage(imageObj, 200, 180);
        }
        imageObj.src = url;	      
	}
	
	util.canvas.Canvas.prototype.fillText = function(text, x, y)
	{
		//this.context.save()
		this.context.font = "48px Times"
		this.context.fillStyle = "#000";
//		this.context.rotate(0.5)
		this.context.fillText(text, x, y)
		//this.context.restore()
	}
	
	util.canvas.Canvas.prototype.draw = function()
	{
		this.context.putImageData(this.data, 0, 0)		
	}
	
	util.canvas.Canvas.prototype.save = function()
	{
		return this.o.toDataURL("image/png");
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
		console.log(cs)
		util.forEach(cs, function(cvas)
		{
			var c = new util.canvas.Canvas(cvas, width, height)
			util.canvas.cvasses.push(c)
		})
		return util.canvas.cvasses
	}
	
	util.canvas.save = function(index)
	{
		return util.canvas.cvasses[index].save()
	}
})()
