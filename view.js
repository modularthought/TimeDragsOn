Time.View = {
	svg: 'http://www.w3.org/2000/svg', xlink: 'http://www.w3.org/1999/xlink'
	, url:
		location.protocol === 'https:' ? 'https://imgs.xkcd.com/comics/time/' :
			location.protocol === 'http:' ? 'http://imgs.xkcd.com/comics/time/' :
				'../../Pictures/Time/hash/'
	, urlf1: 'img/0001.png'
	, limg: '', ready: false
	, img: document.getElementById('images_group')
	, stitch: document.getElementById('stitch_group')
	, frames: document.getElementById('frames_group')
	, addStitch: function(frame){ // json object
		var imgS = document.createElementNS(Time.View.svg,'image');
		imgS.setAttributeNS(Time.View.xlink, 'href', 'img/'+frame.num.pad()+'_stitch.png');
		imgS.setAttribute('x',frame.stitch_obj.x);
		imgS.setAttribute('y',frame.stitch_obj.y);
		imgS.setAttribute('width',frame.stitch_obj.width);
		imgS.setAttribute('height',frame.stitch_obj.height);
		imgS.setAttribute('id','imgs'+frame.num.pad());
		Time.View.stitch.appendChild(imgS);
	}
	, addFrame: function(frame){
		var img = document.createElementNS(Time.View.svg,'image')
		img.setAttributeNS(Time.View.xlink, 'href', ((frame.num === 1) ? Time.View.urlf1 :
											 Time.View.url+frame.hash+'.png'))
		img.setAttribute('transform','translate('+frame.x+','+frame.y+')');
		img.setAttribute('width',553);
		img.setAttribute('height',395);
		if (frame.stitch) {
			img.setAttribute('class','s'+frame.stitch);
		}
		img.setAttribute('id','imgf'+frame.num.pad());
		Time.View.frames.appendChild(img);
	}
	, showFrame: function(frame,o,end){
		document.getElementById('imgf'+frame.num.pad()).style.opacity = (end) ? (100-o)/100 : (o) ? o/100 : 1;
	}
	, hideFrame: function(frame) {
		if (Time.Model.start) {
			Time.Model.start = false;
		} else {
			document.getElementById('imgf'+frame.num.pad()).style.display = 'none';
			++Time.Model.cfn;
		}
	}
	, next: function(frame,json) {
		Time.View.showFrame(frame);
		if (!!json[Time.Model.cfn+1]) {
			Time.View.hideFrame(json[Time.Model.cfn]);
		}
		Time.View.delay(json);
	}
	, oAnim: function(frame,json) {
		var o = 0;
		var sI = setInterval(function () {
			Time.View.showFrame(frame,o);
			if ((o += Time.vel) > 100) {
				if (!json[Time.Model.cfn].end) {
					Time.View.hideFrame(json[Time.Model.cfn]);
				}
				clearInterval(sI);
				Time.View.delay(json);
			}
		},Time.speed)
	}
	, delay: function(json) {
		var adv = Time.Model.cfn;
		var wait = setTimeout(function(){
			if (json[Time.Model.cfn+1] && !json[Time.Model.cfn+1].load) {
				clearInterval(wait);
				Time.View.ready = false;
				return false;
			}
			if (!Time.Controller.pause) Time.recur(json)
		}, Time.anim ? Time.delay : (100/Time.vel*Time.speed)+Time.delay)
	}
	, cacheImg: function(img,json){
		Time.View.limg = new Image()
		Time.View.limg.src = ((img.num === 1) ? Time.View.urlf1 :
											 Time.View.url+img.hash+'.png');
		Time.View.limg.onload = function() {
			delete Time.View.limg.onload;
			Time.View.addFrame(img);
			img.load = true;
			if (!Time.View.ready && !Time.Controller.pause) {
				Time.View.ready = true;
				setTimeout(function(){Time.recur(json)},500)
			}
			if (json[img.num+1]) Time.View.cacheImg(json[img.num+1],json)
		}
		return false;
	}
}
