<?php
/***************************************************************
*  Copyright notice
*
*  (c) 2007 Peter Klein (pmk@io.dk)
*  (c) 2007 Stefan Galinski (stefan.galinski@frm2.tum.de)
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/

/**
 * Google Maps Positioner for longtitude / latitude
 *
 * @author Hannes Maier <h.maier@yama.at>
 */
class user_googlemapsPositioner {
	
	
	function user_googlemapsPositioner($PA=null, $fobj=null) {
		if (!$PA) return;
		if (!$fobj) return;

		$this->tceforms = &$PA['pObj'];
		$PArow = $PA['row'];
		
		if($PArow['tx_googlemapinfobox_latitude'] == '') $PArow['tx_googlemapinfobox_latitude'] = '47.80949';
		if($PArow['tx_googlemapinfobox_longitude'] == '') $PArow['tx_googlemapinfobox_longitude'] = '13.05501';
		
		if (intval($PArow['uid']) == 0) return '';

		// Add custom JavaScript functions
		$out = array();
		$out[]='
		<script>
			tmpLongHr = \'data[tt_address][' . $PArow['uid'] . '][tx_googlemapinfobox_longitude]_hr\';
            tmpLatHr = \'data[tt_address][' . $PArow['uid'] . '][tx_googlemapinfobox_latitude]_hr\';
            tmpLong = \'data[tt_address][' . $PArow['uid'] . '][tx_googlemapinfobox_longitude]\';
            tmpLat = \'data[tt_address][' . $PArow['uid'] . '][tx_googlemapinfobox_latitude]\';
            address = \'data[tt_address][' . $PArow['uid'] . '][address]\';

            function loadMap() {
                tmpAddr = \'data[tt_address][' . $PArow['uid'] . '][address]\';

                Event.observe(document.' . $this->tceforms->formName . '[tmpAddr], \'blur\', function () {
                    this.style.backgroundColor = \'#cccccc\';
                    showAddress(this.value);
                });

                var map = new GMap2(document.getElementById("myMap"));
                console.log(\'map\');
                map.addControl(new GSmallMapControl());
                map.addControl(new GMapTypeControl());
                var center = new GLatLng(48.20817,  	16.37382);
                map.setCenter(center, 7);
                geocoder = new GClientGeocoder();
                var marker = new GMarker(center, {draggable: true});
                map.addOverlay(marker);
                document.' . $this->tceforms->formName . '[tmpLatHr].value = center.lat().toFixed(5);
                document.' . $this->tceforms->formName . '[tmpLongHr].value = center.lng().toFixed(5);

                GEvent.addListener(marker, "dragend", function() {
                    var point = marker.getPoint();
                    map.panTo(point);
                    document.' . $this->tceforms->formName . '[tmpLatHr].value = point.lat().toFixed(5);
                    document.' . $this->tceforms->formName . '[tmpLongHr].value = point.lng().toFixed(5);

                });


                GEvent.addListener(map, "moveend", function() {
                    map.clearOverlays();
                    var center = map.getCenter();
                    var marker = new GMarker(center, {draggable: true});
                    map.addOverlay(marker);
                    document.' . $this->tceforms->formName . '[tmpLatHr].value = center.lat().toFixed(5);
                    document.' . $this->tceforms->formName . '[tmpLongHr].value = center.lng().toFixed(5);


                    GEvent.addListener(marker, "dragend", function() {
                        var point =marker.getPoint();
                        map.panTo(point);
                        document.' . $this->tceforms->formName . '[tmpLatHr].value = point.lat().toFixed(5);
                        document.' . $this->tceforms->formName . '[tmpLongHr].value = point.lng().toFixed(5);

                    });

                });
            }

            function showAddress(address) {
                document.' . $this->tceforms->formName . '[tmpLatHr].value = "test";
                var map = new GMap2(document.getElementById("myMap"));
                map.addControl(new GSmallMapControl());
                map.addControl(new GMapTypeControl());
                if (geocoder) {
                    geocoder.getLatLng(
                        address,
                        function(point) {
                            if (!point) {
                                alert(address + " not found");
                            } else {
                                document.' . $this->tceforms->formName . '[tmpLatHr].value = point.lat().toFixed(5);
                                document.' . $this->tceforms->formName . '[tmpLongHr].value = point.lng().toFixed(5);
                                map.clearOverlays()
                                map.setCenter(point, 14);
                                var marker = new GMarker(point, {draggable: true});
                                map.addOverlay(marker);

                                GEvent.addListener(marker, "dragend", function() {
                                    var pt = marker.getPoint();
                                    map.panTo(pt);
                                    document.' . $this->tceforms->formName . '[tmpLatHr].value = pt.lat().toFixed(5);
                                    document.' . $this->tceforms->formName . '[tmpLongHr].value = pt.lng().toFixed(5);
                                });


                                GEvent.addListener(map, "moveend", function() {
                                    map.clearOverlays();
                                    var center = map.getCenter();
                                    var marker = new GMarker(center, {draggable: true});
                                    map.addOverlay(marker);
                                    document.' . $this->tceforms->formName . '[tmpLatHr].value = center.lat().toFixed(5);
                                    document.' . $this->tceforms->formName . '[tmpLongHr].value = center.lng().toFixed(5);

                                    GEvent.addListener(marker, "dragend", function() {
                                        var pt = marker.getPoint();
                                        map.panTo(pt);
                                        document.' . $this->tceforms->formName . '[tmpLatHr].value = pt.lat().toFixed(5);
                                        document.' . $this->tceforms->formName . '[tmpLongHr].value = pt.lng().toFixed(5);
                                    });

                                });
                            }
                        }
                    );
                }
            }
		</script>	
            ';
			
		$out[] = '<script type="text/javascript" src="http://maps.google.com/maps?file=api&amp;v=2&amp;key='.$PA['fieldConf']['config']['googleMapKey'].'"></script>';
		$out[] = '<div id="myMap"></div>';
		$out[] = '
					<style type="text/css">
						/*<![CDATA[*/
					<!--
						#myMap {
							width:600px;
							height:400px;
							color:#000;
							margin-bottom:15px;
						}
					// -->
						/*]]>*/
					</style>
				';

		$out[] = '
				<script type="text/javascript">
					/*<![CDATA[*/
						<!--
							loadMap();
							if(document.' . $this->tceforms->formName . '[address].value) {
							    showAddress(document.' . $this->tceforms->formName . '[address].value);
							}
						// -->
					/*]]>*/
				</script>
				';
		return implode('', $out);
	}
}

?>
