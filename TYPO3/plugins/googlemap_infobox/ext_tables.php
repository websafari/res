<?php
if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

t3lib_div::loadTCA('tt_content');
$TCA['tt_content']['types']['list']['subtypes_excludelist'][$_EXTKEY.'_pi1']='layout,select_key,pages';


t3lib_extMgm::addPlugin(array(
	'LLL:EXT:googlemap_infobox/locallang_db.xml:tt_content.list_type_pi1',
	$_EXTKEY . '_pi1',
	t3lib_extMgm::extRelPath($_EXTKEY) . 'ext_icon.gif'
),'list_type');

$TCA['tt_content']['types']['list']['subtypes_addlist'][$_EXTKEY.'_pi1']='pi_flexform';                  
  
 // now, add your flexform xml-file
t3lib_extMgm::addPiFlexFormValue($_EXTKEY.'_pi1', 'FILE:EXT:'.$_EXTKEY.'/flexform.xml');

t3lib_extMgm::addStaticFile($_EXTKEY,'static/', 'google_map');

$confArr = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf'][$_EXTKEY]);

$tempColumns = array (

    'tx_googlemapinfobox_googlemapsPositioner' => array (
        'exclude' => 1,
        'label' => 'LLL:EXT:googlemap_infobox/locallang_db.xml:tt_address.tx_googlemapinfobox_googlemapsPositioner',
        'config' => array (
            'type' => 'user',
            'userFunc' => 'EXT:googlemap_infobox/classes/class.user_googlemapsPositioner.php:user_googlemapsPositioner->user_googlemapsPositioner',
            'noTableWrapping' => false,
            'readOnly' => true,
            'googleMapKey' => $confArr['googleMapKey'],
        )
    ),
    'tx_googlemapinfobox_longitude' => array (
        'exclude' => 0,
        'label' => 'LLL:EXT:googlemap_infobox/locallang_db.xml:tt_address.tx_googlemapinfobox_longitude',
        'config' => array (
            'type' => 'input',
            'size' => '30',
        )
    ),
    'tx_googlemapinfobox_latitude' => array (
        'exclude' => 0,
        'label' => 'LLL:EXT:googlemap_infobox/locallang_db.xml:tt_address.tx_googlemapinfobox_latitude',
        'config' => array (
            'type' => 'input',
            'size' => '30',
        )
    ),
);


t3lib_div::loadTCA('tt_address');
t3lib_extMgm::addTCAcolumns('tt_address',$tempColumns,1);
t3lib_extMgm::addToAllTCAtypes('tt_address','tx_googlemapinfobox_latitude, tx_googlemapinfobox_longitude, tx_googlemapinfobox_googlemapsPositioner');

?>