"use strict";

Number.prototype.pad = function() {
	var s = this.toString();
	return (s.length < 4) ? ('000' + s).slice(-4) : s;
}
			var date1, date2;


var Time = {
	anim: false
	
	, vel: 5, speed: 10, delay: 1000
	, init: function(){
		Time.M.xhr = new XMLHttpRequest();
		if (!document.getElementById('frame_text').firstChild) {
			document.getElementById('frame_text').appendChild(document.createTextNode(''));
			document.getElementById('tframe').style.display = 'none';
			document.getElementById('tperiod').appendChild(document.createTextNode(''));
		}
		var xhr = Time.M.xhr;
		if (!xhr) return false;
		date1 = Date.now();
		if (true) {
			Time.M.loadJSON("periods",Time.M.loadPeriods);
			Time.C.initlisten();
		}

	}
}
