/**
 * @class
 * cpath
 * Module to store clickpaths locally and retrieve them w/ the consent of the end user 
 */

util.cpath = {
	cpathar:[],
	isSaved:false
}

util.cpath.pushCPath = function(str)
{
	var now = new Date()
	var o = {
		time:(	now.getFullYear()	+	' ' +
				now.getMonth()+1) 	+ 	'-' + 
				now.getDate() 		+ 	' ' + 
				now.getHours() 		+ 	':' + 
				now.getMinutes() 	+ 	':' +
				now.getSeconds(), 
		cpath:str
	}
	this.cpathar.push(o)
}

/**
 * @description Stores cpath locally
 */
util.cpath.storePath = function()
{
	
}

util.ready(function()
{
	if(window.attachEvent)
		window.attachEvent("onbeforeunload", util.cpath.storePath)
	else
		window.addEventListener('beforeunload', util.cpath.storePath)	
})