includeLibs.ifconditions = fileadmin/setup/scripts/class.ifconditions.php
config.no_cache = 1
plugin.Tx_Formhandler.settings.predef.contactform {
	name = Submit story long
	langFile = fileadmin/setup/facebook-templates/formhandler/lang.xml
	templateFile = fileadmin/setup/facebook-templates/formhandler/template.html
	debug = 0
	addErrorAnchors = 1  
	formValuesPrefix = formhandler

    markers {
        countries = COA
        countries {
			10 = TEXT
			10.value = <option value="">Please Select</option>
			
			20 = CONTENT
			20 {
				table = static_countries
				select {
					pidInList = 0
					selectFields = uid, cn_short_en
				}

				renderObj = COA
				renderObj {
					10 = TEXT
					10.field = uid
					10.wrap = <option value="|"
					
					15 = TEXT
					15.field = uid
					15.noTrimWrap = | ###selected_country_|###>|
					
					20 = TEXT
					20.field = cn_short_en
					20.wrap = |</option>
				}
		   }
        }
		discipline = COA
		discipline {
			10 = TEXT
			10.value = <option value="">Please Select</option>
			
			20 = CONTENT
			20 {
				table = tx_odlostories_categories
				select {
					pidInList = 55
					selectFields = uid, name
				}

				renderObj = COA
				renderObj {
					10 = TEXT
					10.field = uid
					10.wrap = <option value="|"
					
					15 = TEXT
					15.field = uid
					15.noTrimWrap = | ###selected_discipline_|###>|
					
					20 = TEXT
					20.field = name
					20.wrap = |</option>
				}
			}	
        }
    }
	

	loggers {
		1 {
		  class = Tx_Formhandler_Logger_DB
		}
	}
  
	preProcessors {
		1.class = Tx_Formhandler_PreProcessor_LoadDefaultValues
		1.config {
			1 {
				firstname.defaultValue = TEXT
				firstname.defaultValue.data = register:fbfirstname
				lastname.defaultValue = TEXT
				lastname.defaultValue.data = register:fblastname
				email.defaultValue = TEXT
				email.defaultValue.data = register:fbemail
				title.defaultValue = TEXT
				title.defaultValue.data = register:fbgender
				facebookid.defaultValue = TEXT
				facebookid.defaultValue.data = register:fbfacebookid
				street.defaultValue = TEXT
				street.defaultValue.data = register:street
				zip.defaultValue = TEXT
				zip.defaultValue.data = register:zip
				city.defaultValue = TEXT
				city.defaultValue.data = register:city
				phone.defaultValue = TEXT
				phone.defaultValue.data = register:telephone
				country.defaultValue = TEXT
				country.defaultValue.data = register:country
				birthday.defaultValue = TEXT
				birthday.defaultValue.data = register:age	
				newsletter.defaultValue = TEXT
				newsletter.defaultValue.data = register:newsletter
			}
		}
	}
      
	finishers {
		
		10.class = Tx_Formhandler_Finisher_Mail
		10.config {
			admin {
				to_email =  claudia.camenisch@odlo.com
				to_name =   Claudia Camenisch
				cc_email =  astrid.berger@zooom.at
				cc_name =   Astrid Berger
				sender_email = info@odlo.com
				sender_name =  Odlo Running 
				subject = Tell Your Story Einreichung
			}
		}
		
		

			
		
		15.class = Tx_Formhandler_Finisher_StoreUploadedFiles
		15.config {		
			finishedUploadFolder = fileadmin/upload_media/facebook/stories/
			renameScheme = [filename]_[md5]
		}	
		#//delete all records you don't need
		#//bgZe6En$
		#//delete from `tx_odlostories_stories` WHERE hidden or deleted
		#//SELECT * FROM  `tx_dam` WHERE file_path =  'fileadmin/upload_media/facebook/stories/' LIMIT 500
		#//SELECT * FROM  `tx_dam_mm_ref` WHERE tablenames =  'tx_odlostories_stories'and uid_foreign not in (1,2,21,83,84,85,108,203) LIMIT 500
		30.class = Tx_Formhandler_Finisher_DB
		30.config {
			table = tx_odlostories_stories
			fields {
				pid.mapping = hiddenfield
				pid.postProcessing = TEXT
				pid.postProcessing.value = 52	
				
				facebookid.mapping = facebookid
				headline.mapping = headline
				storytext.mapping = story
				category.mapping = discipline
				title.mapping = title
				firstname.mapping = firstname
				lastname.mapping = lastname
				street.mapping = street
				zip.mapping = zip
				city.mapping = city
				email.mapping = email
				telephone.mapping = phone
				country.mapping = country
				location_user.mapping = location_user
				
				crdate.mapping = hiddenfield
				crdate.postProcessing = USER
				crdate.postProcessing.userFunc = user_ifconditions->main
				crdate.postProcessing.field = crdate
				
				crdatesorting.mapping = USER
				crdatesorting.mapping.userFunc = user_ifconditions->main
				crdatesorting.mapping.field = crdate

				
				age.mapping = birthday
				age.postProcessing = USER
				age.postProcessing.userFunc = user_ifconditions->main
				age.postProcessing.field = age
				
				avatar.mapping = avatar
				avatar.postProcessing = USER
				avatar.postProcessing.userFunc = user_ifconditions->main
				avatar.postProcessing.field = avatar
				avatar.postProcessing.field.uploadFolder = fileadmin/upload_media/facebook/avatar/
				
				terms.mapping = terms
				terms.postProcessing = TEXT
				terms.postProcessing.value = 1
				terms.postProcessing.if.isTrue.data = GP:formhandler|terms
				
				newsletter.mapping = newsletter
				newsletter.postProcessing = TEXT
				newsletter.postProcessing.value = 1
				newsletter.postProcessing.if.isTrue.data = GP:formhandler|newsletter
				
				media1.mapping = photo1				
				media1.postProcessing = USER
				media1.postProcessing.userFunc = user_ifconditions->main
				media1.postProcessing.field = media1
								
				media1_type < .media1
				media1_type.postProcessing.field = media1_type
				
				media2 < .media1
				media2.mapping = photo2
				media2.postProcessing.field = media2
				
				media2_type < .media1
				media2_type.postProcessing.field = media2_type
				
				media3 < .media1
				media3.mapping = photo3
				media3.postProcessing.field = media3
				
				media3_type < .media1
				media3_type.postProcessing.field = media3_type
				
				videolink2 < .media1
				videolink2.mapping = youtube
				videolink2.postProcessing.field = videolink2
				
				videolink3 < .media1
				videolink3.mapping = youtube
				videolink3.postProcessing.field = videolink3
				
				hidden.mapping = hiddenfield
				hidden.postProcessing = TEXT
				hidden.postProcessing.value = 1
			}
		}
		
		40.class = Tx_Formhandler_Finisher_DB
		40.config {
			condition = photo1
			table = tx_dam
			fields {
				


				file_path.mapping = photo1			
				file_path.postProcessing = TEXT
				file_path.postProcessing.value = fileadmin/upload_media/facebook/stories/
				
				file_name.mapping = photo1
				file_name.postProcessing = USER
				file_name.postProcessing.userFunc = user_ifconditions->main
				file_name.postProcessing.field = photo1
				file_name.postProcessing.file_name = 1
				
				file_size.mapping = photo1			
				file_size.postProcessing = USER
				file_size.postProcessing.userFunc = user_ifconditions->main
				file_size.postProcessing.field = photo1
				file_size.postProcessing.file_size = 1
				
				file_type.mapping = photo1			
				file_type.postProcessing = USER
				file_type.postProcessing.userFunc = user_ifconditions->main
				file_type.postProcessing.field = photo1
				file_type.postProcessing.file_type = 1
				
				hpixels.mapping = photo1			
				hpixels.postProcessing = USER
				hpixels.postProcessing.userFunc = user_ifconditions->main
				hpixels.postProcessing.field = photo1
				hpixels.postProcessing.hpixels = 1
				
				vpixels.mapping = photo1			
				vpixels.postProcessing = USER
				vpixels.postProcessing.userFunc = user_ifconditions->main
				vpixels.postProcessing.field = photo1
				vpixels.postProcessing.vpixels = 1
			}
		}
		
		50.class = Tx_Formhandler_Finisher_DB
		50.config {
			condition = photo1
			table = tx_dam_mm_ref
			fields {
				uid_local.special = inserted_uid
				uid_local.special.table = tx_dam
				uid_foreign.special = inserted_uid
				uid_foreign.special.table = tx_odlostories_stories
				tablenames.mapping = hiddenfield			
				tablenames.postProcessing = TEXT
				tablenames.postProcessing.value = tx_odlostories_stories
				ident.postProcessing = USER
				ident.postProcessing.userFunc = user_ifconditions->main
				ident.postProcessing.field = photo
			}
		}
		 
		60 < .40
		60.config.condition = photo2
		60.config.fields.file_name.mapping = photo2
		60.config.fields.file_name.postProcessing.field = photo2
		
		70 < .50
		70.config.condition = photo2
		
		80 < .40
		80.config.condition = photo3
		80.config.fields.file_name.mapping = photo3
		80.config.fields.file_name.postProcessing.field = photo3
		
		90 < .50
		90.config.condition = photo3
		
		100.class = Tx_Formhandler_Finisher_DB
		100.config {
			condition = facebookid
			table = tx_dam
			fields {
				file_path.mapping = avatar			
				file_path.postProcessing = TEXT
				file_path.postProcessing.value = fileadmin/upload_media/facebook/avatar/
				
				file_name.mapping = avatar
				file_name.postProcessing = TEXT
				file_name.postProcessing.data = GP:formhandler|facebookid
				file_name.postProcessing.wrap = |.jpg
				
				file_size.mapping = avatar			
				file_size.postProcessing = USER
				file_size.postProcessing.userFunc = user_ifconditions->main
				file_size.postProcessing.avatar_file_size = 1
				file_size.postProcessing.uploadFolder < .file_path.postProcessing.value
								
				file_type.mapping = avatar			
				file_type.postProcessing = TEXT
				file_type.postProcessing.value = jpg			
			}
		}
		
		110.class = Tx_Formhandler_Finisher_DB
		110.config {
			condition = facebookid
			table = tx_dam_mm_ref
			fields {
				uid_local.special = inserted_uid
				uid_local.special.table = tx_dam
				uid_foreign.special = inserted_uid
				uid_foreign.special.table = tx_odlostories_stories
				tablenames.mapping = hiddenfield			
				tablenames.postProcessing = TEXT
				tablenames.postProcessing.value = tx_odlostories_stories
				ident.postProcessing = TEXT
				ident.postProcessing.value = avatar
			}
		}
		
		120.class = Tx_Formhandler_Finisher_Redirect
		120.config.redirectPage = 45	
	}    
    
	validators {
		1.class = Tx_Formhandler_Validator_Default
		1.config {       
			fieldConf {				
				photo1.errorCheck.2 = fileAllowedTypes
				photo1.errorCheck.2.allowedTypes = jpg,png,gif	
				photo2 < .photo1
				photo3 < .photo1
			    headline.errorCheck.1 = required				
			    discipline.errorCheck.1 = required
                title.errorCheck.1 = required
                birthday.errorCheck.1 = required				
                firstname.errorCheck.1 = required
                lastname.errorCheck.1 = required
                street.errorCheck.1 = required
                zip.errorCheck.1 = required
                city.errorCheck.1 = required
                email.errorCheck.1 = required
                country.errorCheck.1 = required
				terms.errorCheck.1 = required
			}
		}
	}
}

plugin.Tx_Formhandler.settings.predef.contactform2 < plugin.Tx_Formhandler.settings.predef.contactform
plugin.Tx_Formhandler.settings.predef.contactform2 {
	name = Submit story short
	templateFile = fileadmin/setup/facebook-templates/formhandler/template_short.html
	validators {
		1.class = Tx_Formhandler_Validator_Default
		1.config {       
			fieldConf {				
				photo1.errorCheck.2 = fileAllowedTypes
				photo1.errorCheck.2.allowedTypes = jpg,png,gif	
				photo2 < .photo1
				photo3 < .photo1
			    headline.errorCheck.1 = required				
			    discipline.errorCheck.1 = required
                title >
                birthday >
                firstname >
                lastname >
                street >
                zip >
                city >
                email >
                country >
				terms.errorCheck.1 = required
			}
		}
	}
}