"use strict";
Number.prototype.pad = function() {
	var s = this.toString();
	return (s.length < 4) ? ('000' + s).slice(-4) : s;
}

/* Time object, holds all data/fn */
var Time = {
	anim: true
	/* vel=opacity steps, speed=interval speed, delay=time between frames */
	, vel: 5, speed: 10, delay: 2000
	, init: function(json){
		Time.Model.xhr = new XMLHttpRequest();
		Time.Model.loadJSON(json);
	}
	, recur: function(json){
		var adv = Time.Model.cfn;
		if (json[adv].start && Time.Model.start) {
			Time.Model.setCurrent(json[adv]);
			console.log('start '+adv)
			if (Time.anim){
				Time.View.oAnim(json[adv],json);
			} else {
				Time.View.next(json[adv],json);
			}
		} else if (json[adv].end){ // end
			Time.Model.start = true;
			console.log('end '+adv)
			if (false) {
				Time.View.oAnim(json[adv+1],json);
			}
		} else {
			console.log('both '+(adv+1))
			Time.Model.setCurrent(json[adv+1]);
			Time.Model.resX = Time.Model.current.getAttribute('transform').match(/([\d.-]+),/)[1]*-1+1;
			Time.Model.resY = Time.Model.current.getAttribute('transform').match(/,([\d.-]+)/)[1]*-1-2;
			if (Time.anim){
				Time.View.oAnim(json[adv+1],json);
			} else {
				Time.View.next(json[adv+1],json);
			}
		}
	}
	, initdrag: function(e) {
		var t = Time.View.stitch;
		if (e.preventDefault) e.preventDefault();
		e.cancelBubble = false;
		if (t.getElementsByTagName('image')[0]) {
			t.width = t.getElementsByTagName('image')[0].width.baseVal.value;
			t.height = t.getElementsByTagName('image')[0].height.baseVal.value;
		} else {
			t.width = 553;
			t.height = 395;
		}
		t.dragX = e.clientX || 0;
		t.dragY = e.clientY || 0;
		if (t.dragX === 0) {
			Time.drag(e);
		} else {
			document.addEventListener('mousemove', Time.drag, false);
			document.addEventListener('mouseup', Time.Controller.removedrag, false);
		}
	}
	, drag: function(e) {
		var t = Time.View.stitch;
		var x = ((+t.getAttribute('transform').match(/\(([-\d.]+)/)[1]||0)+
				(e.clientX || e.x || 0) - t.dragX)
		, y = ((+t.getAttribute('transform').match(/,([-\d.]+)/)[1]||0)+
					(e.clientY || e.y || 0) - t.dragY)
	/* translate x =
			check right limit
						  check left limit  else leave alone */
		x = (x > 0) ? 0 : (x < -t.width+553-2) ? -t.width+553-2 : x
	/* translate y =
			check bottom limit 			check top limit 	else leave alone */
		y = (y > t.height-395+2) ? t.height-395+2 :  (y < 0) ? 0 : y
		if (!Time.Model.current.hasAttribute('class') || !Time.Model.current.getAttribute('class').match(/(\d{4})/)) {
			x = y = 0;
		}
		t.dragX = e.clientX;
		t.dragY = e.clientY;
		Time.Model.setTranslate(x,y)
	}
}
