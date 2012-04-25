#INDEXED SEARCH
plugin.tx_indexedsearch {
  templateFile = fileadmin/templates/ext_templates/indexed_search.html

  show {
    rules = 0
    resultNumber = 1
    advancedSearchLink = 0
  }

  blind {
    freeIndexUid = 0
    media = 1
    lang = 1
    order = 1
    group = 1
    extResume = 1
    sections = 1
    type = 1
  }

  search {
    defaultFreeIndexUidList = 0
  }

  _DEFAULT_PI_VARS {
    freeIndexUid = -2
    group = flat
    ext = 0
    results = 5
  }

  _LOCAL_LANG.de {
    opt_freeIndexUid_header_0 = Seiten
  }
}