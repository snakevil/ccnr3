(req, resp, next) ->
    resp\xml {
        '?': '../toc.xslt',
        '/': 'Novel',
        '': {
            {
                '/': 'Title',
                '': '???'
            }, {
                '/': 'Author',
                '': '???'
            }, {
                '/': 'Chapters',
                '': {}
            }
        }
    }
