Time.Controller = {
	pause: false
	, initlisten: function(){
		Time.View.img.addEventListener('mousedown', Time.initdrag, false);
		document.addEventListener('keydown', Time.Controller.keyFn, false);
	}
	/* remove event-handlers */
	, removedrag: function() {
		document.removeEventListener('mousemove', Time.drag, false);
		document.removeEventListener('mouseup', Time.Controller.removedrag, false);
	}
	, keyFn: function(e) {
		if (!e.altKey && (e.keyCode <= 40 && e.keyCode >= 37)) {
			e.cancelBubble = false;
			e.x=e.y=0;
			if (e.ctrlKey) {
	// insert step frame forward/reverse script here
			} else if (e.ctrlKey && e.shiftKey) {
	// insert skip scene forward/reverse script here
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
				Time.initdrag(e);
			}
		} else if (!e.altKey && !e.shiftKey && !e.ctrlKey && (e.keyCode === 32)) {
			/* pause/play with [space bar] */
			Time.Controller.pause = !Time.Controller.pause;
			if (!Time.Controller.pause) {
				console.log("unpaused")
				Time.recur(Time.Model.json);
			}
		} else if (!e.altKey && !e.shiftKey && e.ctrlKey && (e.keyCode === 90)) {
			/* reset with [ctrl]+[z] */
			Time.Model.setTranslate(Time.Model.resX,Time.Model.resY)
		}
	}
}
