
/* zum test zwecke
page.headerData.1123 = TEXT
page.headerData.1123.value (
    <style type="text/css">
        div#left {
            z-index: -1;
        }
    </style>
)
*/

page.includeCSS.file5 = fileadmin/setup/templates/css/login.css
includeLibs.ifconditions = fileadmin/setup/scripts/class.ifconditions.php
config.no_cache = 1
plugin.Tx_Formhandler.settings.predef.contactform {
	name = Submit story long
    langFile = fileadmin/setup/templates/formhandler/lang.xml
    templateFile = fileadmin/setup/templates/formhandler/template_short.html
	debug = 0
	addErrorAnchors = 1  
	formValuesPrefix = formhandler

	loggers {
		1 {
		  class = Tx_Formhandler_Logger_DB
		}
	}
  
	preProcessors {
		1.class = Tx_Formhandler_PreProcessor_LoadDefaultValues

	}
      
	finishers {
		//delete all records you don't need
		//
		//delete from `tx_odlostories_stories` WHERE hidden or deleted
		//SELECT * FROM  `tx_dam` WHERE file_path =  'fileadmin/upload_media/facebook/stories/' LIMIT 500
		//SELECT * FROM  `tx_dam_mm_ref` WHERE tablenames =  'tx_odlostories_stories'and uid_foreign not in (1,2,21,83,84,85,108,203) LIMIT 500

		10.class = Tx_Formhandler_Finisher_DB
		10.config {
			table = tt_address
			fields {
				pid.mapping = hiddenfield
				pid.postProcessing = TEXT
				pid.postProcessing.value = 135

				tstamp.mapping = hiddenfield
				tstamp.postProcessing = USER
                tstamp.postProcessing.userFunc = user_ifconditions->main
                tstamp.postProcessing.field = crdate
				first_name.mapping = firstname
				last_name.mapping = lastname
				name.mapping = firstname
				name.postProcessing = USER
                name.postProcessing.userFunc = user_ifconditions->main
                name.postProcessing.field = name
			}
		}
		20.class = Tx_Formhandler_Finisher_DB
        20.config {
            table = fe_users
            fields {
                pid.mapping = hiddenfield
                pid.postProcessing = TEXT
                pid.postProcessing.value = 135

                crdate.mapping = hiddenfield
                crdate.postProcessing = USER
                crdate.postProcessing.userFunc = user_ifconditions->main
                crdate.postProcessing.field = crdate
                tx_zoatlogin_ttaddress.special = inserted_uid
                tx_zoatlogin_ttaddress.special.table = tt_address
                username.mapping = email
                //brisi u bazi password
                //brisi iz fe usera tca ttadres
                password.mapping = password
                email.mapping = email
                usergroup.mapping = hiddenfield
                usergroup.postProcessing = TEXT
                usergroup.postProcessing.value = 1
                first_name.mapping = firstname
                last_name.mapping = lastname
                name.mapping = firstname
                name.postProcessing = USER
                name.postProcessing.userFunc = user_ifconditions->main
                name.postProcessing.field = name
            }
        }

        25.class = Tx_Formhandler_Finisher_LoginUser

        30.class = Tx_Formhandler_Finisher_Redirect
        30.config.redirectPage = 143
	}    
    
	validators {
		1.class = Tx_Formhandler_Validator_Default
		1.config {       
			fieldConf {
                firstname.errorCheck.1 = containsNone
                firstname.errorCheck.1.words = firstname
                lastname.errorCheck.1 = containsNone
                lastname.errorCheck.1.words = lastname
                email.errorCheck {
                            1 = required
                            2 = email
                            3 = isNotInDBTable
                            3.table = fe_users
                            3.field = email
                }
                password.errorCheck.1 = required
                password.errorCheck.2 = minLength
                password.errorCheck.2.value = 5
			}
		}
	}
}
