Time.C = {
	pause: false, pauseSave: false, blur: 0, shift: 1
	, initlisten: function(){
		window.addEventListener('blur', function(){
		
			Time.C.blur = 100;
		}, false);
		window.addEventListener('focus', function(){Time.C.blur=0}, false);
		Time.V.img.addEventListener('mousedown', Time.C.initdrag, false);
		document.addEventListener('keydown', Time.C.keyFn, false);
		window.addEventListener('resize', function(){
		
		
		}, false)
		document.getElementById('text_f').addEventListener('mouseover', function() {
			document.getElementById('text_f').addEventListener('click', Time.C.toggleSelect, false);
			document.getElementById('text_f').setAttribute('class','hilite_fill');
			document.getElementById('text_o').setAttribute('class','hilite_outline');
		}, false)
		document.getElementById('text_f').addEventListener('mouseout', function() {
			document.getElementById('text_f').removeEventListener('click', Time.C.toggleSelect, false);
			document.getElementById('text_f').setAttribute('class','text_fill');
			document.getElementById('text_o').setAttribute('class','text_outline');
		}, false)
		document.getElementById('periods').addEventListener('select',function(){
			if (e.preventDefault) e.preventDefault();
			e.cancelBubble = false;
		});
	}
	, setDrag: function(e,el) {
		el.dragX = e.clientX || 0;
		el.dragY = e.clientY || 0;
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
		Time.C.setDrag(e,t);
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
		Time.C.setDrag(e,t);
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
	, setMenuDrag: function(e) {
		var p = document.getElementById('periods');
		Time.M.ph = p.getBoundingClientRect().height;
		Time.C.setDrag(e,p);
		if (e.preventDefault) e.preventDefault();
		e.cancelBubble = false;
		p.addEventListener('mousemove', Time.C.menuDrag, false);
		p.addEventListener('mouseup', Time.C.removeMenuDrag, false);
	}
	, menuDrag: function(e) {
		var p = document.getElementById('periods');
		var y = ((+p.getAttribute('transform').match(/,([-\d.]+)/)[1]||0)+
					(e.clientY || e.y || 0) - p.dragY);
		y = (y > 0) ? 0 :  (y < -Time.M.ph+393) ? -Time.M.ph+393 : y;
		p.removeEventListener('mouseup', Time.C.skipViaSelect, false);
		
		Time.C.setDrag(e,p);
		p.setAttribute('transform','translate(0,'+y+')');
	}
	, removeMenuDrag: function(){
		var p = document.getElementById('periods');
		p.addEventListener('mouseup', Time.C.skipViaSelect, false);
		p.removeEventListener('mousemove', Time.C.menuDrag, false);
		p.removeEventListener('mouseup', Time.C.removeMenuDrag, false);
	}
	, toggleSelect: function() {
		var p = document.getElementById('periods');
		if (p.style.display == "block") {
			Time.V.togglePShow(false);
			Time.C.pause = Time.C.pauseSave;
			Time.V.displayPStat(Time.C.pause);
			Time.V.iterate();
		} else {
			Time.V.togglePShow(true);
			Time.C.pauseSave = Time.C.pause;
			Time.C.pause = true;
			Time.V.displayPStat(Time.C.pause);
		}
	}
	, skipViaSelect: function(e) {
		var p = document.getElementById('periods');
	
		if (e.target.parentNode && e.target.parentNode.getAttribute('id') && e.target.parentNode.getAttribute('id').match(/f\d+/)) {
			var target = e.target.parentNode;
			Time.M.cfn = +target.getAttribute('id').match(/f(\d+)/)[1];
			Time.C.pause = Time.C.pauseSave;
			Time.V.displayPStat(Time.C.pause);
			clearInterval(Time.V.stopIterate);
			Time.M.cfn -= 1;
			Time.V.togglePShow(false);
			Time.V.iterate();
		}
	}
}
