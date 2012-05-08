

tmpLongHr = \'data[tt_address][' . $PArow['uid'] . '][tx_googlemapinfobox_longitude]_hr\';
tmpLatHr = \'data[tt_address][' . $PArow['uid'] . '][tx_googlemapinfobox_latitude]_hr\';
tmpLong = \'data[tt_address][' . $PArow['uid'] . '][tx_googlemapinfobox_longitude]\';
tmpLat = \'data[tt_address][' . $PArow['uid'] . '][tx_googlemapinfobox_latitude]\';


function load() {
    if (GBrowserIsCompatible()) {


        var map = new GMap2(document.getElementById("map"));
        map.addControl(new GSmallMapControl());
        map.addControl(new GMapTypeControl());
        var center = new GLatLng(48.89364,  	2.33739);
        map.setCenter(center, 15);
        geocoder = new GClientGeocoder();
        var marker = new GMarker(center, {draggable: true});
        map.addOverlay(marker);
        document.' . $this->tceforms->formName . '[tmpLatHr].innerHTML = center.lat().toFixed(5);
        document.' . $this->tceforms->formName . '[tmpLongHr].innerHTML = center.lng().toFixed(5);

        GEvent.addListener(marker, "dragend", function() {
            var point = marker.getPoint();
            map.panTo(point);
            document.' . $this->tceforms->formName . '[tmpLatHr].innerHTML = point.lat().toFixed(5);
            document.' . $this->tceforms->formName . '[tmpLongHr].innerHTML = point.lng().toFixed(5);

        });


        GEvent.addListener(map, "moveend", function() {
            map.clearOverlays();
            var center = map.getCenter();
            var marker = new GMarker(center, {draggable: true});
            map.addOverlay(marker);
            document.' . $this->tceforms->formName . '[tmpLatHr].innerHTML = center.lat().toFixed(5);
            document.' . $this->tceforms->formName . '[tmpLongHr].innerHTML = center.lng().toFixed(5);


            GEvent.addListener(marker, "dragend", function() {
                var point =marker.getPoint();
                map.panTo(point);
                document.' . $this->tceforms->formName . '[tmpLatHr].innerHTML = point.lat().toFixed(5);
                document.' . $this->tceforms->formName . '[tmpLongHr].innerHTML = point.lng().toFixed(5);

            });

        });

    }
}

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
                    document.' . $this->tceforms->formName . '[tmpLatHr].innerHTML = point.lat().toFixed(5);
                    document.' . $this->tceforms->formName . '[tmpLongHr].innerHTML = point.lng().toFixed(5);
                    map.clearOverlays()
                    map.setCenter(point, 14);
                    var marker = new GMarker(point, {draggable: true});
                    map.addOverlay(marker);

                    GEvent.addListener(marker, "dragend", function() {
                        var pt = marker.getPoint();
                        map.panTo(pt);
                        document.' . $this->tceforms->formName . '[tmpLatHr].innerHTML = pt.lat().toFixed(5);
                        document.' . $this->tceforms->formName . '[tmpLongHr].innerHTML = pt.lng().toFixed(5);
                    });


                    GEvent.addListener(map, "moveend", function() {
                        map.clearOverlays();
                        var center = map.getCenter();
                        var marker = new GMarker(center, {draggable: true});
                        map.addOverlay(marker);
                        document.' . $this->tceforms->formName . '[tmpLatHr].innerHTML = center.lat().toFixed(5);
                        document.' . $this->tceforms->formName . '[tmpLongHr].innerHTML = center.lng().toFixed(5);

                        GEvent.addListener(marker, "dragend", function() {
                            var pt = marker.getPoint();
                            map.panTo(pt);
                            document.' . $this->tceforms->formName . '[tmpLatHr].innerHTML = pt.lat().toFixed(5);
                            document.' . $this->tceforms->formName . '[tmpLongHr].innerHTML = pt.lng().toFixed(5);
                        });

                    });
                }
            }
        );
    }
}