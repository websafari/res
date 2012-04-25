#FEUser Register
plugin.tx_srfeuserregister_pi1 {
	formFields = email,username, password, name, address, city, zip, telephone, fax, company, www, terms_acknowledged
	requiredFields =email,password,terms_acknowledged
	file {
	    #templateFile = fileadmin/templates/ext_templates/feuser_register.html
	    #termsFile =
	}
	#useEmailAsUsername = 1
	confirmInvitationPID =
	confirmPID =
	editPID =
	loginPID =
	linkToPID =
	registerPID =
	pid =
	enablePreviewRegister = 0
	enablePreviewEdit = 0
	siteName =
	email =
	#enableAutoLoginOnConfirmation = 1
	#salutation = informal
	#pidTitleOverride =
}