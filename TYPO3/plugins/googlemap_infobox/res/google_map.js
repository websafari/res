google.load("maps", "3",  {other_params:"sensor=false"}); 
	
var map;
var geocoder;
var bounds;
var counterNext = 0;
var counterPrev = -2; 
var markersArray = [];
var infoBoxArray = [];
var myZoom = 4;

function initialize() {
	geocoder = new google.maps.Geocoder();
	
	var latlng = new google.maps.LatLng(47.9, 13.48);
	
	var myOptions = {
      zoom: myZoom,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
	  navigationControl: true,
	  navigationControlOptions: {
        style: google.maps.NavigationControlStyle.ZOOM_PAN,
        position: google.maps.ControlPosition.LEFT_BOTTOM
    	}
    }

	map = new google.maps.Map(document.getElementById("map"), myOptions);
}

function codeAddress(address, image, background, uid, content, lat, lng) {
	//markersArray = [];
	//infoBoxArray = []; <---grr deadly, if you activate this strange miracly things will happen!!!

	bounds = new google.maps.LatLngBounds();

	var myOptions = {
		content: content,
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(-41, -188),
		zIndex: null,
		boxStyle: { 
		  background: "url("+background+") no-repeat",
		  opacity: 1,
		  width: "202px",
		  height: "145px"
		 },
		closeBoxMargin: "10px 10px 2px 2px",
		//closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
		infoBoxClearance: new google.maps.Size(1, 1),
		sHidden: false,
		pane: "floatPane",
		enableEventPropagation: false
     };
    
	
	if(lat && lng) {
		latlng = new google.maps.LatLng(lat, lng);
		
		var marker = new google.maps.Marker({
			map: map, 
			position: latlng,
			icon: image
		});
		
		
		markersArray.push(marker);
		
		var ib = new InfoBox(myOptions);
		
		google.maps.event.addListener(marker, 'click', function() {
			closeInfoBoxes();
			ib.open(map,marker);
		});
		
		$('.uid'+uid).click(
			function(){
				closeInfoBoxes();
				ib.open(map,marker);
			}
		);
				
		infoBoxArray.push(ib);
		
		bounds.extend(marker.position);	
	} else {
	
		if (geocoder) {
			geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
			
				var marker = new google.maps.Marker({
					map: map, 
					position: results[0].geometry.location,
					icon: image
				});
				
				markersArray.push(marker);
				
				var ib = new InfoBox(myOptions);
				
				google.maps.event.addListener(marker, 'click', function() {
					closeInfoBoxes();
					ib.open(map,marker);
				});

				$('.uid'+uid).click(
					function(){
						closeInfoBoxes();
						ib.open(map,marker);
					}
				);
				
				infoBoxArray.push(ib);
			
				bounds.extend(marker.position);
				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
			});
		}
	}
}


function filterMap(category) {
	clearOverlays();
	closeInfoBoxes();	
	counterNext = 0;
	counterPrev = -2;

	for(var i=0; i < markerObject[0].length; i++){
		x = markerObject[markerObject[0][i]];
		
		if(markerObject[0][i] == category || typeof category == 'undefined' || category == 0) {
			for(var j=0; j < x[0].length; j++) {
				y = x[x[0][j]];
				codeAddress(y['address'], y['image'], y['background'], y['uid'], y['content'], y['latitude'], y['longitude']);
			}
		}		
	}
}

function clearOverlays() {
  if (markersArray) {
    for (i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
  }
  google.maps.event.clearListeners(map, 'click');
}

function closeInfoBoxes() {

  if (infoBoxArray && markersArray) {
    for (i = 0; i < infoBoxArray.length; i++) {
      infoBoxArray[i].close(map, markersArray[i]);
    }
  }
}
	
$(document).ready(function(){
	initialize();
	
	$('#selectList').change(function(){
		filterMap($(this).val());
	});
	
});

function showAddress(address) {
    var map = new GMap2(document.getElementById("map"));
    map.addControl(new GSmallMapControl());
    map.addControl(new GMapTypeControl());
    if (geocoder) {
        geocoder.getLatLng(
            address,
            function(point) {
                if (!point) {
                    alert(address + " not found");
                } else {
                    document.getElementById("lat").innerHTML = point.lat().toFixed(5);
                    document.getElementById("lng").innerHTML = point.lng().toFixed(5);
                    map.clearOverlays()
                    map.setCenter(point, 14);
                    var marker = new GMarker(point, {draggable: true});
                    map.addOverlay(marker);

                    GEvent.addListener(marker, "dragend", function() {
                        var pt = marker.getPoint();
                        map.panTo(pt);
                        document.getElementById("lat").innerHTML = pt.lat().toFixed(5);
                        document.getElementById("lng").innerHTML = pt.lng().toFixed(5);
                    });


                    GEvent.addListener(map, "moveend", function() {
                        map.clearOverlays();
                        var center = map.getCenter();
                        var marker = new GMarker(center, {draggable: true});
                        map.addOverlay(marker);
                        document.getElementById("lat").innerHTML = center.lat().toFixed(5);
                        document.getElementById("lng").innerHTML = center.lng().toFixed(5);

                        GEvent.addListener(marker, "dragend", function() {
                            var pt = marker.getPoint();
                            map.panTo(pt);
                            document.getElementById("lat").innerHTML = pt.lat().toFixed(5);
                            document.getElementById("lng").innerHTML = pt.lng().toFixed(5);
                        });

                    });

                }
            }
        );
    }
}






























