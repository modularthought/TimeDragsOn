Time.C = {
	pause: false, pauseSave: false, blur: 0, shift: 1
	, initlisten: function(){
		window.addEventListener('blur', function(){
			Time.C.blur = 100;
		}, false);
		window.addEventListener('focus', function(){Time.C.blur=0}, false);
		Time.V.img.addEventListener('mousedown', Time.C.initdrag, false);
		document.addEventListener('keydown', Time.C.keyFn, false);
		document.getElementById('periods').addEventListener('click', Time.C.skipViaSelect, false);
		window.addEventListener('resize', function(){
			Time.V.centerText('tperiod',true)
			Time.V.centerText('tframe')
		}, false)
		document.getElementById('periods').addEventListener('mouseover', function() {
			document.getElementById('text_f').setAttribute('class','hilite_fill');
			document.getElementById('text_o').setAttribute('class','hilite_outline');
		}, false)
		document.getElementById('periods').addEventListener('mouseout', function() {
			document.getElementById('text_f').setAttribute('class','text_fill');
			document.getElementById('text_o').setAttribute('class','text_outline');
		}, false)
	}
	, initdrag: function(e) {
		var t = Time.V.stitch;
		if (e.preventDefault) e.preventDefault();
		e.cancelBubble = false;
		if (Time.M.currentS != "" && Time.M.currentS.getElementsByTagName('image')[0]) {
			t.width = Time.M.currentS.getElementsByTagName('image')[0].width.baseVal.value;
			t.height = Time.M.currentS.getElementsByTagName('image')[0].height.baseVal.value;
		} else {
			t.width = 553;
			t.height = 395;
		}
		t.dragX = e.clientX || 0;
		t.dragY = e.clientY || 0;
		if (t.dragX === 0) {
			Time.C.drag(e);
		} else {
			document.addEventListener('mousemove', Time.C.drag, false);
			document.addEventListener('mouseup', Time.C.removedrag, false);
		}
	}
	, drag: function(e) {
		var t = Time.V.stitch;
		var framesizex = 553, framesizey = 395;
		var x = ((+t.getAttribute('transform').match(/\(([-\d.]+)/)[1]||0)+
				(e.clientX || e.x || 0) - t.dragX)
		, y = ((+t.getAttribute('transform').match(/,([-\d.]+)/)[1]||0)+
					(e.clientY || e.y || 0) - t.dragY)
		x = (x > 0) ? 0 : (x < -t.width+framesizex-2) ? -t.width+framesizex-2 : x
		y = (y > t.height-framesizey+2) ? t.height-framesizey+2 :  (y < 0) ? 0 : y
		if (!Time.M.current.hasAttribute('class') || !Time.M.current.getAttribute('class').match(/sdrag/)) {
			x = y = 0;
		}
		t.dragX = e.clientX;
		t.dragY = e.clientY;
		Time.M.setTranslate(x,y)
	}
	, removedrag: function() {
		document.removeEventListener('mousemove', Time.C.drag, false);
		document.removeEventListener('mouseup', Time.C.removedrag, false);
	}
	, pauseToggle: function() {
		Time.C.pause = !Time.C.pause;
		Time.V.displayPStat(Time.C.pause);
		if (!Time.C.pause && !Time.V.blackflag) {
			clearInterval(Time.V.stopIterate);
			Time.V.iterate();
		}
	}
	, keyFn: function(e) {
		if (!e.altKey && (e.keyCode <= 40 && e.keyCode >= 37)) {
			e.cancelBubble = false;
			e.x = e.y = 0;
			if (e.ctrlKey) {
				if (e.keyCode === 37) {
					Time.C.shift -= 2;
					if (Time.C.pause && !Time.V.blackflag) {
						clearInterval(Time.V.stopIterate);
						Time.V.iterate()
					}
				} else if (e.keyCode === 39) {
					++Time.C.shift;
					if(Time.C.pause && !Time.V.blackflag){
						--Time.C.shift;
						clearInterval(Time.V.stopIterate);
						Time.V.iterate()
					}
				}
			} else if (e.ctrlKey && e.shiftKey) {
				if (e.keyCode === 37) {
				} else if (e.keyCode === 39) {
				}
			} else {
				switch (e.keyCode) {
				case 37: e.x = -1;
					break;
				case 38: e.y = -1;
					break;
				case 39: e.x = 1;
					break;
				case 40: e.y = 1;
					break;
				}
				if (e.shiftKey) e.x *= 10, e.y *= 10;
				Time.C.initdrag(e);
			}
		} else if (!e.altKey && !e.shiftKey && e.ctrlKey && (e.keyCode === 90)) {
			Time.M.setTranslate(Time.M.resX,Time.M.resY)
		} else if (!e.altKey && !e.shiftKey && !e.ctrlKey && (e.keyCode === 32 || e.keyCode === 80)) {
			Time.C.pauseToggle();
		} else if (!e.altKey && !e.shiftKey && !e.ctrlKey && (e.keyCode === 192)) {
			var gui = document.getElementById('gui');
			gui.setAttribute('class',
				(gui.getAttribute('class') == 'show') ? 'hide' : 'show'
				);
		}
	}
	, periodPause: function(){
		document.getElementById('periods').removeEventListener('blur', Time.C.periodPause, false);
		Time.C.pause = Time.C.pauseSave;
		Time.V.displayPStat(Time.C.pause);
		if (!Time.C.pause && !Time.V.blackflag) {
			clearInterval(Time.V.stopIterate);
			Time.V.iterate();
		}
	}
	, skipViaSelect: function(e) {
		document.getElementById('periods').addEventListener('blur', Time.C.periodPause, false);
		if (e.target && e.target.nodeName == "option" && !e.target.disabled) {
			var target = e.target;
			Time.M.cfn = +target.label;
			Time.C.pause = Time.C.pauseSave;
			Time.V.displayPStat(Time.C.pause);
			clearInterval(Time.V.stopIterate);
			Time.M.cfn -= 1;
			Time.V.iterate();
		} else {
			Time.C.pauseSave = Time.C.pause;
			Time.C.pause = true;
			Time.V.displayPStat(Time.C.pause);
		}
	}
}
