// Author: Blake Perdue <blake.perdue@ingramcontent.com>, Dave Campbell <dave.campbell@ingramcontent.com>
// Version: 1.3
// Release Notes:
//  1.3 - adjusted to support URLs with varying prefixed protcols
//  1.2 - do not open videos in a browser on unsupported devices
//	1.1 - updated fallback URL to use HTML instead of MP4 to open in all browsers
//  1.0 - first release

document.addEventListener("DOMContentLoaded", function(event) {
  
	function addVideoTag(element) {
		var videoId = element.getAttribute('data-id');
		var videoPlaylist = 'https://content.jwplatform.com/feeds/' + videoId + '.json';

		var xhr = new XMLHttpRequest();
		xhr.open('GET', videoPlaylist);
		xhr.timeout = 4000;
		xhr.onerror = function() { showError(element); }

		xhr.onreadystatechange = function() {
		  if (xhr.readyState === 4) { // readyState 4 means the request is done.
		    if (xhr.status === 200) { // status 200 is a successful return.
					var values = JSON.parse(xhr.responseText);
					if (values.playlist && values.playlist[0].sources) {
						// we have valid json, let's find the HLS source and delete it
						var sources = values.playlist[0].sources;
						var source;
						var poster = fixTrackFile(values.playlist[0].image);

						// find the best resolution file first (they're ordered small to large)
						for(var i = sources.length - 1; i > -1; i--) {
							if (sources[i].type == 'video/mp4') {
								source = sources.splice(i, 1)[0];
								break;
							}
						}
						// console.log(source);
						source = fixTrackFile(source.file);
						
						/*if (isAndroid || isIE9) {
							var htmlSource = 'https://content.jwplatform.com/videos/' + videoId + '.html';
							var container = element.parentNode;
							container.removeChild(element);
							container.innerHTML = '<div style="width:100%; text-align:left !important;"><div style="text-decoration:none; display:inline-block;"><img src="' + poster + '" style="border:0; width:100%; height:auto; max-width:600px;" /><div style="margin:10px 0 15px 0; width:100%; max-width:600px; border:solid 1px #ebcccc; background:#f2dede"><div style="color:#a94442 !important; padding:10px;">Video for this product is not supported on this device. Please read this book in a browser to view the video.</div></div></div></div>';
							return;
						}*/

						element.setAttribute('src', source);
						element.setAttribute('poster', poster);

						if (values.playlist[0].tracks && values.playlist[0].tracks.length > 0) {
							var tracks = values.playlist[0].tracks;
							for (var i = 0; i < tracks.length; i++) {
                                var sourceTrack = tracks[i];
                                var kind = sourceTrack.kind;

                                if (kind !== 'captions' && kind !== 'subtitles') {
									//this should be a more reliable check than filename containing .vtt
                                    continue; 
                                }

								var track = document.createElement('track');
								track.label = sourceTrack.label;
                                track.kind = sourceTrack.kind;
                                //valid srclang values do not appear to be available through JW api
								//track.srclang = 'en';
								track.src = fixTrackFile(sourceTrack.file);
								element.appendChild(track);
							}
						}
					}

		    } else {
		      showError(element);
		    }
		  }
		}
		xhr.send(null);
	}

	function showError(element) {
		if (element && element.parentNode) {
			element.parentNode.innerHTML = '<span style="color:#c00; font-weight:bold;">You need an Internet connection to view this video. Please connect and reload this page.</span>';
		}
	}

	// verify or force secure protocal
	function fixTrackFile(file) {
		var protocol = 'https://';
		var slashIndex = file.indexOf('\/\/');
		return (slashIndex === -1) ? protocol + file : protocol + file.substring(slashIndex+2);
	}

	try {
		var videos = document.getElementsByClassName('jwp-video');
		var isAndroid = navigator.userAgent.indexOf('Android') != -1;
		var isIE9 = ((navigator.userAgent.indexOf('Windows') != -1) && (navigator.userAgent.indexOf('Awesomium') != -1));

		for(var i = 0; i < videos.length; i++) {
			addVideoTag(videos[i]);
		}
	} catch(e) {
		// error occured, do nothing
	}
});