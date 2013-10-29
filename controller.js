Time.Controller = {
	pause: false, pauseSave: false, blur: 0, shift: 1
	, initlisten: function(){
		window.addEventListener('blur', function(){Time.Controller.blur=100}, false);
		window.addEventListener('focus', function(){Time.Controller.blur=0}, false);
		Time.View.img.addEventListener('mousedown', Time.Controller.initdrag, false);
		document.addEventListener('keydown', Time.Controller.keyFn, false);
		document.getElementById('periods').addEventListener('click', Time.Controller.skipViaSelect, false);
		document.getElementById('periods').addEventListener('blur', function(){
			Time.Controller.pause = Time.Controller.pauseSave;
			Time.View.displayPStat(Time.Controller.pause);
			if (!Time.Controller.pause && !Time.View.blackflag) {
				Time.View.iterate();
			}
		}, false);
		window.addEventListener('resize', function(){
			Time.View.centerText('tperiod',true)
			Time.View.centerText('tframe')
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
			Time.Controller.drag(e);
		} else {
			document.addEventListener('mousemove', Time.Controller.drag, false);
			document.addEventListener('mouseup', Time.Controller.removedrag, false);
		}
	}
	, drag: function(e) {
		var t = Time.View.stitch;
		var framesizex = 553, framesizey = 395;
		var x = ((+t.getAttribute('transform').match(/\(([-\d.]+)/)[1]||0)+
				(e.clientX || e.x || 0) - t.dragX)
		, y = ((+t.getAttribute('transform').match(/,([-\d.]+)/)[1]||0)+
					(e.clientY || e.y || 0) - t.dragY)
	/* translate x =
			check right limit
						  check left limit  else leave alone */
		x = (x > 0) ? 0 : (x < -t.width+framesizex-2) ? -t.width+framesizex-2 : x
	/* translate y =
			check bottom limit 			check top limit 	else leave alone */
		y = (y > t.height-framesizey+2) ? t.height-framesizey+2 :  (y < 0) ? 0 : y
		if (!Time.Model.current.hasAttribute('class') || !Time.Model.current.getAttribute('class').match(/s\d{4}/)) {
			x = y = 0;
		}
		t.dragX = e.clientX;
		t.dragY = e.clientY;
		Time.Model.setTranslate(x,y)
	}
	, removedrag: function() {
		document.removeEventListener('mousemove', Time.Controller.drag, false);
		document.removeEventListener('mouseup', Time.Controller.removedrag, false);
	}
	, keyFn: function(e) {
		if (!e.altKey && (e.keyCode <= 40 && e.keyCode >= 37)) {
			e.cancelBubble = false;
			e.x = e.y = 0;
			if (e.ctrlKey) {
			/* step frame forward/reverse */
				if (e.keyCode === 37) {
					Time.Controller.shift-=2;
					if (Time.Controller.pause && !Time.View.blackflag) Time.View.iterate()
				} else if (e.keyCode === 39) {
					++Time.Controller.shift;
					if(Time.Controller.pause && !Time.View.blackflag){
						Time.View.iterate()
					}
				}
			} else if (e.ctrlKey && e.shiftKey) {
			/* skip scene forward/reverse */
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
				Time.Controller.initdrag(e);
			}
		} else if (!e.altKey && !e.shiftKey && e.ctrlKey && (e.keyCode === 90)) {
			/* reset with [ctrl]+[z] */
			Time.Model.setTranslate(Time.Model.resX,Time.Model.resY)
		} else if (!e.altKey && !e.shiftKey && !e.ctrlKey && (e.keyCode === 32)) {
			/* pause/play with [space bar] */
			Time.Controller.pause = !Time.Controller.pause;
			Time.View.displayPStat(Time.Controller.pause);
			if (!Time.Controller.pause && !Time.View.blackflag) {
				Time.View.iterate();
			}
		} else if (!e.altKey && !e.shiftKey && !e.ctrlKey && (e.keyCode === 192)) {
			/* toggle menu with [`] */
			var gui = document.getElementById('gui');
			gui.setAttribute('class',
				(gui.getAttribute('class') == 'show') ? 'hide' : 'show'
				);
		}
	}
	, skipViaSelect: function(e) {
		if (e.target && e.target.nodeName == "option" && !e.target.disabled) {
			var target = e.target;
			Time.Model.cfn = (+target.label == 1) ? 1 : +target.label-1;
			Time.Controller.pause = Time.Controller.pauseSave;
			Time.View.displayPStat(Time.Controller.pause);
			Time.View.iterate();
		} else {
			Time.Controller.pauseSave = Time.Controller.pause;
			Time.Controller.pause = true;
			Time.View.displayPStat(Time.Controller.pause);
		}
	}
}
