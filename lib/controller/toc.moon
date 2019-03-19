(req, resp, next) ->
    source = require'utility.io'.source!
    toc = require'driver'.for(source).toc source
    if not toc
        resp\status 502
        return next!
    resp\xml {
        '?': '../toc.xslt',
        '/': 'Novel',
        '': {
            {
                '/': 'Title',
                '': toc.title
            }, {
                '/': 'Author',
                '': toc.author
            }, {
                '/': 'Chapters',
                '': [{
                    '/': 'Chapter',
                    ref: i[1],
                    '': i[2]
                } for i in *toc.chapters]
            }
        }
    }
