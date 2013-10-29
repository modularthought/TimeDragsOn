"use strict";
Number.prototype.pad = function() {
	var s = this.toString();
	return (s.length < 4) ? ('000' + s).slice(-4) : s;
}
			var date1, date2;

/* Time object, holds all data/fn */
var Time = {
	anim: false
	/* vel=opacity steps, speed=interval speed, delay=time between frames */
	, vel: 5, speed: 10, delay: 2000
	, init: function(){
		Time.Model.xhr = new XMLHttpRequest();
		if (!document.getElementById('frame_text').firstChild) {
			document.getElementById('frame_text').appendChild(document.createTextNode(''));
			document.getElementById('tperiod').appendChild(document.createTextNode(''));
		}
		var xhr = Time.Model.xhr;
		if (!xhr) return false;
		date1 = Date.now();
		Time.Model.loadJSON("periods",Time.Model.setPeriods);
		Time.Model.loadJSON(Time.Model.dotjson,Time.Model.parseJSON);
		Time.Controller.initlisten();
	}
}
