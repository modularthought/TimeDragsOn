Time.Model = {
	start: true, current: '', currentS: '', previousS: '', xhr: '', json: [[]], jperiod: []
	, cfn: 0, pfn: 0, dotjson: 0, jsonlen: 15
	/* reset x,y to current frame orientation; set x,y when new orientation occurs */
	, resX: 0, resY: 0
	, load: function(img){
		if (++Time.Model.dotjson < Time.Model.jsonlen) {
			for (var i = Time.Model.jperiod.eras[Time.Model.dotjson-1][0]; i < Time.Model.jperiod.eras[Time.Model.dotjson][0]; i++) {
				Time.View.addFrame(Time.Model.json[i]);
				if (Time.Model.json[i].stitch_obj) {
					Time.View.addStitch(Time.Model.json[i]);
				}
			};
			Time.Model.loadJSON(Time.Model.dotjson,Time.Model.parseJSON);
		} else {
			for (var i = Time.Model.jperiod.eras[Time.Model.jperiod.eras.length-1][0]; i < Time.Model.json.length; i++) {
				Time.View.addFrame(Time.Model.json[i]);
				if (Time.Model.json[i].stitch_obj) {
					Time.View.addStitch(Time.Model.json[i]);
				}
			};
			Time.View.displayPStat(false);
			Time.View.iterate();
		}
	}
	, loadJSON: function(json,fn){
		var xhr = new XMLHttpRequest();
		xhr.open('GET','json/'+json+'.json',true);
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4) {
				fn(xhr);
			}
		};
		xhr.send(null);
	}
	, parseJSON: function(xhr){
		var parsed = JSON.parse(xhr.responseText)
		if (Time.Model.cfn == 0) {
			Time.Model.json[0].push(parsed[0].num)
			Time.Model.cfn = Time.Model.json[0][Time.Model.json[0].length-1];
		}
		for (var i = 0; i < parsed.length; i++) {
			Time.Model.json[parsed[i].num] = parsed[i];
		}
		Time.Model.load(Time.Model.json[1]);
	}
	, setPeriods: function(xhr){
		var parsed = Time.Model.jperiod = JSON.parse(xhr.responseText)
		var period = document.getElementById('periods');
		for (var i = 0, j = 0, k = 0, il = parsed.eons.length; i < il; i++) {
			var optN = document.createElementNS(Time.View.html,'option')
			optN.setAttribute('class','eon eon'+i)
			optN.setAttribute('disabled','disabled');
			optN.appendChild(document.createTextNode(parsed.eons[i][1]))
			period.appendChild(optN)
			for (var jl = parsed.eras.length; j < jl; j++) {
				var optA = document.createElementNS(Time.View.html,'option')
				optA.setAttribute('class','era eon'+i+' era'+j)
				optA.setAttribute('disabled','disabled')
				optA.appendChild(document.createTextNode(parsed.eras[j][1]))
				period.appendChild(optA)
				for (var kl = parsed.periods.length; k < kl; k++) {
					var optP = document.createElementNS(Time.View.html,'option')
					optP.setAttribute('class','eon'+i+' era'+j)
					optP.setAttribute('label', parsed.periods[k][0])
					optP.appendChild(document.createTextNode(parsed.periods[k][1]))
					period.appendChild(optP)
					if (parsed.periods[(k+1 < kl ? k+1 : k)][0] ==
						parsed.eras[(j+1 < jl ? j+1 : 0)][0]) {
						k++;
						break;
					}
				};
				if (j+1 == jl) {
					optP.setAttribute('class',optP.getAttribute('class')+' end')
				}
				if (parsed.eras[(j+1 < jl ? j+1 : j)][0] ==
					parsed.eons[(i+1 < il ? i+1 : 0)][0]) {
					optP.setAttribute('class',optP.getAttribute('class')+' end')
					j++;
					break;
				}
			};
		}
	}
	, setCurrent: function(frame){
		Time.Model.current = document.getElementById('imgf'+frame.num.pad())
		Time.Model.resX = frame.x*-1;
		Time.Model.resY = frame.y*-1;
		var opts = document.getElementById('periods').getElementsByTagName('option');
		for (var i = 0; i < opts.length; i++) {
			if (!+opts[i].label) continue;
			opts[i].selected = false;
			if (+opts[i].label - frame.num <= 0) {
				opts[i].selected = true;
				document.getElementById('tperiod').firstChild.nodeValue = opts[i].value;
				Time.View.centerText('tperiod',true)
			}
		};
		if (frame.stitch) {
			Time.Model.previousS = Time.Model.currentS;
			Time.Model.currentS = document.getElementById('imgs'+frame.stitch.pad())
		} else {
			Time.Model.currentS = '';
		}
	}
	, setTranslate: function(x,y) {
		var translate = 'translate('+x+','+y+')';
		Time.View.stitch.setAttribute('transform',translate);
		Time.View.frames.setAttribute('transform',translate);
	}
}
