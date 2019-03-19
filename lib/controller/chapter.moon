(req, resp, next) ->
    resp\xml {
        '?': '../chapter.xslt',
        '/': 'Chapter',
        toc: "/n/#{req.params.novel}/",
        ref: '???',
        '': {
            {
                '/': 'Title',
                '': '???'
            }, {
                '/': 'Paragraphs',
                '': {}
            }
        }
    }
