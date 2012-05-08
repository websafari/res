<?php
/***************************************************************
 *  Copyright notice
 *
 *  (c) 2012 Miladin Bojic <miladin.beg@gmail.com>
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
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/
/**
 * [CLASS/FUNCTION INDEX of SCRIPT]
 *
 * Hint: use extdeveval to insert/update function index above.
 */

require_once(PATH_tslib.'class.tslib_pibase.php');


/**
 * Plugin 'Googlemaps with infobox' for the 'googlemap_infobox' extension.
 *
 * @author	Miladin Bojic <miladin.beg@gmail.com>
 * @package	TYPO3
 * @subpackage	tx_googlemapinfobox
 */
class tx_googlemapinfobox_pi1 extends tslib_pibase {
    var $prefixId      = 'tx_googlemapinfobox_pi1';		// Same as class name
    var $scriptRelPath = 'pi1/class.tx_googlemapinfobox_pi1.php';	// Path to this script relative to the extension dir.
    var $extKey        = 'googlemap_infobox';	// The extension key.
    var $pi_checkCHash = true;

    /**
     * The main method of the PlugIn
     *
     * @param	string		$content: The PlugIn content
     * @param	array		$conf: The PlugIn configuration
     * @return	The content that is displayed on the website
     */
    function main($content, $conf) {
        $this->init();
        $this->conf = $conf;
        $this->pi_setPiVarDefaults();
        $this->pi_loadLL();

        $myWidth = intval($this->lConf['width']);
        $myWidth = $myWidth ? $myWidth : intval($this->conf['width']);
        $myWidth = $myWidth ? $myWidth : 500;

        $myHeight = intval($this->lConf['height']);
        $myHeight = $myHeight ? $myHeight : intval($this->conf['height']);
        $myHeight = $myHeight ? $myHeight : 500;

        $myZoom = intval($this->lConf['zoom']);
        $myZoom = $myZoom ? $myZoom : intval($this->conf['zoom']);
        $myZoom = $myZoom ? $myZoom : 5;

        if($this->lConf['image']) $myImage = 'uploads/pics/'.$this->lConf['image'];
        $myImage = $myImage ? $myImage : $this->conf['image'];
        $myImage = $myImage ? $myImage : 'typo3conf/ext/googlemap_infobox/res/marker.gif';

        if($this->lConf['infoBoxImage']) $myBackground = 'uploads/pics/'.$this->lConf['infoBoxImage'];
        $myBackground = $myBackground ? $myBackground : $this->conf['infoBoxImage'];
        $myBackground = $myBackground ? $myBackground : 'typo3conf/ext/googlemap_infobox/res/infobox.png';

        $myPage = intval($this->lConf['pages']);
        $myPage = $myPage ? $myPage : intval($this->conf['pages']);
        if(!$myPage) return "You must enter the page with tt_address records!";

        $confArr = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['googlemap_infobox']);
        if(!$confArr['googleMapKey']) return 'Please set up Googlemap key in extension configuration for this Webseite';

        $this->templateHtml = $this->cObj->fileResource($conf['templateFile']);
        $subpart = $this->cObj->getSubpart($this->templateHtml, '###TEMPLATE###');

        $js = '$(document).ready(function(){';


        /**
         * get all markers for selected country
         */
        $res = $GLOBALS['TYPO3_DB']->exec_SELECT_mm_query	(
            'tt_address.address, tt_address.uid, tt_address_group.uid as groupid, tt_address.phone, tt_address.tx_googlemapinfobox_longitude, tt_address.tx_googlemapinfobox_latitude', //$select,
            'tt_address', //$local_table,
            'tt_address_group_mm', //$mm_table,
            'tt_address_group', //$foreign_table,
            ' and tt_address.pid='.$myPage,//$whereClause = '',
            '',//$groupBy = '',
            '',//$orderBy = '',
            ''//$limit = ''
        );
        while ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res)) {
            $markerArray['###PHONE###'] = $row['phone'];
            $markerArray['###ADDRESS###'] = $row['address'];
            $infoBoxContent = $this->cObj->substituteMarkerArrayCached($subpart, $markerArray);
            $mapMarkers[$row['groupid']][$row['uid']] = array(
                'uid' => $row['uid'],
                'address' => $row['address'],
                'image' => $myImage,
                'background' => $myBackground,
                'content' => $infoBoxContent,
                'latitude' => $row['tx_googlemapinfobox_latitude'],
                'longitude' => $row['tx_googlemapinfobox_longitude'],
            );
        }



        /**
         * get all country that are used
         */
        $res = $GLOBALS['TYPO3_DB']->exec_SELECT_mm_query	(
            'distinct tt_address_group.title, tt_address_group.uid', //$select,
            'tt_address', //$local_table,
            'tt_address_group_mm', //$mm_table,
            'tt_address_group', //$foreign_table,
            ' and tt_address.pid='.$myPage,//$whereClause = '',
            '',//$groupBy = '',
            '',//$orderBy = '',
            ''//$limit = ''
        );		
		
		$selectCountry = '';
		if($this->conf['selectByCategory']) {
			$selectCountry = '<div id="selectCountry">
									<select id="selectList">
										<option  value="0">'.$this->pi_getLL('allCountries').'</option>';
										while ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res)) {
											$selectCountry .=       '<option value="'.$row['uid'].'">'.$row['title'].'</option>';
										}
										$selectCountry .=       '
									</select>
								</div>';
		}					


        //The data will be transferred into an object in js, so it's necessary to add arrays with the kids
        $mapMarkerKeys = array_keys($mapMarkers);
        $i = 0;
        foreach($mapMarkers as $category) {
            $mapMarkers[$mapMarkerKeys[$i]][0] = array_keys($category);
            $i++;
        }
        $mapMarkers[0] = $mapMarkerKeys;


        $js .= 'markerObject = eval(('.json_encode($mapMarkers).'));';
        $js .= 'filterMap();});';
        if($myZoom) {
            $js .= 'myZoom = '.$myZoom.';';
        }

        $myFile = "typo3temp/gmap.js";
        $fh = fopen($myFile, 'w') or die("can't open file");
        fwrite($fh, $js);
        fclose($fh);

        $GLOBALS["TSFE"]->additionalHeaderData[] = '<script type="text/javascript" src="https://www.google.com/jsapi"></script>';
        $GLOBALS["TSFE"]->additionalHeaderData[] = '<script type="text/javascript" src="typo3conf/ext/googlemap_infobox/res/google_map.js?v='.time().'"></script>';
        $GLOBALS["TSFE"]->additionalHeaderData[] = '<script type="text/javascript" src="typo3conf/ext/googlemap_infobox/res/infobox_packed.js"></script>';
        $GLOBALS["TSFE"]->additionalHeaderData[] = '<style type="text/css" >
                                                        .googlebox #selectCountry{
                                                            position: absolute;
                                                            top: 5px;
                                                            z-index: 1;
                                                            right: 117px;
                                                        }
                                                        .googlebox {
                                                            position: relative;

                                                        }
                                                        .googlebox, .googlebox #map {
                                                            width:'.$myWidth.'px;
                                                            height:'.$myHeight.'px;
                                                        }
                                                     </style>';
        return '<div class="googlebox">'.$selectCountry.'<div id="map"></div></div><script type="text/javascript" src="typo3temp/gmap.js?v='.time().'" ></script>';
    }

    function init(){
        $this->pi_initPIflexForm(); // Init and get the flexform data of the plugin
        $this->lConf = array(); // Setup our storage array...
        // Assign the flexform data to a local variable for easier access
        $piFlexForm = $this->cObj->data['pi_flexform'];
        // Traverse the entire array based on the language...
        // and assign each configuration option to $this->lConf array...
        foreach ( $piFlexForm['data'] as $sheet => $data ) {
            foreach ( $data as $lang => $value ) {
                foreach ( $value as $key => $val ) {
                    $this->lConf[$key] = $this->pi_getFFvalue($piFlexForm, $key, $sheet);
                }
            }
        }
    }
}



if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/googlemap_infobox/pi1/class.tx_googlemapinfobox_pi1.php'])	{
    include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/googlemap_infobox/pi1/class.tx_googlemapinfobox_pi1.php']);
}

?>