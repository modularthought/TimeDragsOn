Time.Model = {
	start: true, current: '', currentS: '', xhr: '', json: [[]]
	, cfn: 0
	/* reset x,y to current frame orientation; set x,y when new orientation occurs */
	, resX: 0, resY: 0
	, load: function(json){ // set up as a loading event
		for (var i = Time.Model.cfn; i < json.length; i++) {
			if (json[i].stitch_obj) {
				Time.View.addStitch(json[i]);
			}
		};
		Time.View.cacheImg(json[Time.Model.cfn],json);
	}
	, loadJSON: function(json){
		var xhr = Time.Model.xhr;
		Time.Model.json[0].push(json)
		if (!xhr) return false;
		xhr.open('GET','json/'+json+'.json',true);
		xhr.onreadystatechange=function(){
			if (xhr.readyState === 4) {
				var parsed = JSON.parse(xhr.responseText)
				for (var i = 0; i < parsed.length; i++) {
					Time.Model.json[parsed[i].num] = parsed[i];
				}
				Time.Model.cfn = Time.Model.json[0][0];
				Time.Controller.initlisten();
				Time.Model.load(Time.Model.json);
			}
		};
		xhr.send(null);
	}
	, setCurrent: function(frame){
		Time.Model.current = document.getElementById('imgf'+frame.num.pad())
	}
	, setTranslate: function(x,y) {
		var translate = 'translate('+x+','+y+')';
		Time.View.stitch.setAttribute('transform',translate);
		Time.View.frames.setAttribute('transform',translate);
	}
}
