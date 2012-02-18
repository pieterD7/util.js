// TESTS

util.test = {
	notify: 1
}
util.test.assertStr = function(str1, str2, msg)
{		
	if(!String(str1).isEmpty() && String(str1).match(new RegExp("^"+str2+"$")))
	{
		if(util.test.notify == 1)	
			alert("Test " + msg + " passed")
	}
	else
		alert("TEST " + msg + " FAILED :" + str1)
}

var d = util.createElement('div')
d.addClassName('test1')
d.addClassName('test2')
d.addClassName('test1')
util.test.assertStr(d.getClassName(), "test1 test2", "Test1")

var n = util.toJson("{'name':'pieter's'}")
util.test.assertStr(n.name, "pieter's", "Test2")

var n = util.toJson("[{'name':'pieter\'s'},{'name':'lo\\\\pi'},{'name':'Kilo zei:\\\"Hoera!\\\"'}]")
util.test.assertStr(n[2].name, 'Kilo zei:"Hoera!"', 'Test3')
util.test.assertStr(n[1].name, "lo\\\\pi", 'Test4')
util.test.assertStr(n[0].name, "pieter's", 'Test5')

var s = [1, 2, 3, 3].unique().join()
util.test.assertStr(s, "1,2,3", "Test6")

var s = [{name:'ik'},{name:'ik'}, {name:'pieter'}].unique('name').joinEach('name', '|')
util.test.assertStr(s, "ik|pieter", 'Test7')

var s = util.toDirection(5.4, 53, 5.3, 52)
util.test.assertStr(s, "s", 'Test8')

var s = util.toXml("<tag>&amp;</tag>").getElementsByTagName('tag')[0].childNodes[0].nodeValue
util.test.assertStr(s, "&", 'Test9')
