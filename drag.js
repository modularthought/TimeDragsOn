"use strict";
Number.prototype.pad = function() {
	var s = this.toString();
	return (s.length < 4) ? ('000' + s).slice(-4) : s;
}
var Time = {
	anim: false
	, vel: 5, speed: 10, delay: 2000
	, init: function(){
		Time.M.xhr = new XMLHttpRequest();
		if (!document.getElementById('frame_text').firstChild) {
			document.getElementById('frame_text').appendChild(document.createTextNode(''));
			document.getElementById('tperiod').appendChild(document.createTextNode(''));
		}
		var xhr = Time.M.xhr;
		if (!xhr) return false;
		Time.M.loadJSON("periods",Time.M.setPeriods);
		Time.M.loadJSON(Time.M.dotjson,Time.M.parseJSON);
		Time.C.initlisten();
	}
}