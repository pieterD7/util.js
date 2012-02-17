/**
 * 
 */

util.chatbox = function(){
	this.url=null
	this.nick=null
	this.inpSel=null
	this.msgSel=null
	this.options= new util.struct([util.options], {value:0})
	this.flags=[].unum()
	return this
}

util.chatbox.prototype.setUrl = function(url)
{
	this.url = url
}

util.chatbox.prototype.setNick = function(nick)
{
	this.nick = nick
}

util.chatbox.prototype.logon = function(nick)
{
	this.nick = nick
}

util.chatbox.prototype.setMsgSel = function(sel)
{
	this.msgSel = sel
}

util.chatbox.prototype.setInpSel = function(sel)
{
	this.inpSel = sel
}

util.chatbox.prototype.poll = function()
{
	
}

util.chatbox.prototype.display = function()
{
	
}