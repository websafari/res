// Meta tags and other meta information
page {
    meta {
        keywords.data = levelfield:-1, keywords, slide
        description.data = levelfield:-1, description, slide
        abstract.field = levelfield:-1, abstract, slide
        author.field = levelfield:-1, author, slide
    }

    headerData.10 = COA
    headerData.10 {
        10 = TEXT
        10.data = levelfield:-1, title, slide
        10.wrap = <meta property="og:title" content="|"/>

        20 = TEXT
        20.value = //Hier type einfügen: https://developers.facebook.com/docs/opengraphprotocol/#types
        20.wrap = <meta property="og:type" content="|"/>

        30 = TEXT
        30.data = getIndpEnv:TYPO3_REQUEST_URL
        30.wrap = <meta property="og:url" content="|"/>

        50 = IMG_RESOURCE
        50 {
            file {
                width = 250c
                height = 250c
                import {
                    data = levelmedia: -1, slide
                    wrap = uploads/media/|
                    listNum = 0
                }
            }

            wrap = <meta property="og:image" content="|"/>
        }
    }
}