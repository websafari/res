google.load("maps", "3",  {other_params:"sensor=false"}); 
	
var map;
var geocoder;
var bounds;
var counterNext = 0;
var counterPrev = -2; 
var markersArray = [];
var infoBoxArray = [];   

function initialize(address) {
	geocoder = new google.maps.Geocoder();
	
	var latlng = new google.maps.LatLng(48.705, 12.128);
	var myZoom;
	if(address != ''){
		myZoom = 6
	}else{
		myZoom = 5
	}
	
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
	if(address != ''){
		if (geocoder) {
			geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					 map.setCenter(results[0].geometry.location);
				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
			});
		}
	}
}

function filterMap() {
	var x;
	for (x in markerObject)	{
		codeAddress(markerObject[x]['address'], markerObject[x]['image'], markerObject[x]['background'], markerObject[x]['uid'], markerObject[x]['content']);
	}
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
    
	
	if (geocoder) {
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				//console.log(results[0].geometry.location);
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

function closeInfoBoxes() {

  if (infoBoxArray && markersArray) {
    for (i = 0; i < infoBoxArray.length; i++) {
      infoBoxArray[i].close(map, markersArray[i]);
    }
  }
}
