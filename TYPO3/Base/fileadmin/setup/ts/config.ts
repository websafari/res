config{
    headerComment (
       ###################################
       #                                 #
       #     Powered by websafari.eu     #
       #                                 #
       #         www.websafari.eu        #
       #                                 #
       ###################################
    )

    #For development
    #no_cache = 1
    #debug = 1
    #admPanel = 1

    disablePrefixComment = 1
    spamProtectEmailAdresses = -4

    minifyJS = 1
    doctype = xhtml_trans
    xhtml_cleaning = all
    sendCacheHeaders = 1
    sendCacheHeaders_onlyWhenLoginDeniedInBranch = 1
    language = de
    locale_all = de_DE
    htmlTag_langKey = de
    sys_language_mode = content_fallback
    linkVars = type, L
    uniqueLinkVars = 1
    baseURL =

    #Extensions
    #index_enable = 1
    #tx_cooluri_enable = 1
    #tx_loginusertrack_enable = 1
}

[globalVar = GP:L=1]
    config {
        language = en
        locale_all = en_EN
        htmlTag_langKey = en
        sys_language_uid = 1
    }
[global]

[browser = msie] && [version= <7]
    config.doctypeSwitch = 1
[global]