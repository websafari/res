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
 * Plugin 'dynamic tt news' for the 'tt_news_dynamic' extension.
 *
 * @author	Miladin Bojic <miladin.beg@gmail.com>
 * @package	TYPO3
 * @subpackage	tx_ttnewsdynamic
 */
class tx_ttnewsdynamic_pi1 extends tslib_pibase {
	var $prefixId      = 'tx_ttnewsdynamic_pi1';		// Same as class name
	var $scriptRelPath = 'pi1/class.tx_ttnewsdynamic_pi1.php';	// Path to this script relative to the extension dir.
	var $extKey        = 'tt_news_dynamic';	// The extension key.
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
		// Loading TypoScript array into object variable:
		$this->conf = $conf;
		// Loading language-labels
		$this->pi_loadLL();
		// Make the plugin not cachable
		$this->pi_USER_INT_obj = 1;
		// Initialise the return variable
		$content = '';
		$sForm = '';
		$sFormResult = '';
		
		require_once (t3lib_extMgm::extPath('xajax') . 'class.tx_xajax.php');
		// Make the instance
		$this->xajax = t3lib_div::makeInstance('tx_xajax');
		// nothing to set, we send to the same URI
		# $this->xajax->setRequestURI('xxx');
		// Decode form vars from utf8 ???
		$this->xajax->decodeUTF8InputOn();
		// Encode of the response to utf-8 ???
		$this->xajax->setCharEncoding('utf-8');
		// To prevent conflicts, prepend the extension prefix
		$this->xajax->setWrapperPrefix($this->prefixId);
		// Do you wnat messages in the status bar?
		$this->xajax->statusMessagesOn();
		// Turn only on during testing
		#$this->xajax->debugOn();
		// Register the names of the PHP functions you want to be able to call through xajax
		// $xajax->registerFunction(array('functionNameInJavascript', &$object, 'methodName'));
		$this->xajax->registerFunction(array('getCode', &$this, 'getCode'));
		// If this is an xajax request, call our registered function, send output and exit
		$this->xajax->processRequests();
		// Else create javascript and add it to the header output
		$GLOBALS['TSFE']->additionalHeaderData[$this->prefixId] = $this->xajax->getJavascript(t3lib_extMgm::siteRelPath('xajax'));
		// The form goes here
		$content .= $this->sGetForm();
		
		// The result box goes here
		if (!t3lib_div::_GP('xajax')) {			
			$pidList = $this->getOptions(FALSE);
			$content .= '<div id="formResult">';
			$content .= $this->getMoreTtnews($pidList);
			$content .= '</div>';
		} 

		return $this->pi_wrapInBaseClass($content);
	} 
	
	function sGetForm()	{
		$sReturn = '<div class="chooseoption"><h2>'.$this->lConf['header'].'</h2>
					<select onChange="' . $this->prefixId . 'getCode(this.value);">
						 '.$this->getOptions().'
					</select></div>';		
		return $sReturn;
	} 
		
	function getOptions($data=TRUE)	{
		$fields = 'uid,title';
		$table = 'pages';
		$where = 'pid='.$this->lConf['pages'].' and not hidden and not deleted';
		$orderby = null;
		$groupby = null;
		
		if($data) {
			$limit = 100;		
			$res=$GLOBALS['TYPO3_DB']->exec_SELECTquery($fields, $table, $where, $orderby, $groupby, $limit);			
			$options = '';
			while ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res)) {
				$options .= '<option value="'.$row['uid'].'">'.$row['title'].'</option>';
			}			
			return $options;
		} else {
			$limit = 1;		
			$res=$GLOBALS['TYPO3_DB']->exec_SELECTquery($fields, $table, $where, $orderby, $groupby, $limit);
			while ($row = $GLOBALS['TYPO3_DB']->sql_fetch_assoc($res)) {
				$options = $row['uid'];
			}			
			return $options;
		}
	} 
	 
	function getCode($data)	{
		$content = '';		
		$content .= $this->getMoreTtnews($data);
		// Once having prepared the content we still need to send it to the browser ...
		// Instantiate the tx_xajax_response object
		$objResponse = new tx_xajax_response();
		// Add the content to or result box
		$objResponse->addAssign('formResult', 'innerHTML', $content);
		//return the XML response
		return $objResponse->getXML();		
	} 
	
	function getMoreTtnews($pidList) {
		$content = '';
		if($this->lConf['flightclass']) {
				$content = '';
				$content .= '<div class="businessheader"><h2>Economy</h2></div>';
				$content .= '<div class="distance"></div>';	
				$content .= '<div class="businessheader"><h2>Business</h2></div>';
				$content .= $this->getTtnews($pidList, 0);	
				$content .= '<div class="distance"></div>';	
				$content .= $this->getTtnews($pidList, 1);		
			} else {
				$content .= $this->getTtnews($pidList);	
		}	
		return $content;	
	}
	
	function getTtnews($pidList, $flightClass=NULL) {
			$content = '';
			$veryLocal_cObj = t3lib_div::makeInstance('tslib_cObj');
			$GLOBALS['TSFE']->tmpl->setup['plugin.']['tt_news.']['code'] = 'LIST';
			$GLOBALS['TSFE']->tmpl->setup['plugin.']['tt_news.']['pid_list'] = $pidList;
			if(!is_null($flightClass)) {
				$GLOBALS['TSFE']->tmpl->setup['plugin.']['tt_news.']['displayListAddWhere'] = ' AND tx_ttnewsextender_flightclass='.$flightClass;
			}
			$GLOBALS['TSFE']->tmpl->setup['plugin.']['tt_news.']['templateFile'] = $this->lConf['templateFile'];
			$content .= $veryLocal_cObj->cObjGetSingle('USER',	$GLOBALS['TSFE']->tmpl->setup['plugin.']['tt_news.']);
			return $content;
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



if (defined('TYPO3_MODE') && $TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/tt_news_dynamic/pi1/class.tx_ttnewsdynamic_pi1.php'])	{
	include_once($TYPO3_CONF_VARS[TYPO3_MODE]['XCLASS']['ext/tt_news_dynamic/pi1/class.tx_ttnewsdynamic_pi1.php']);
}

?>