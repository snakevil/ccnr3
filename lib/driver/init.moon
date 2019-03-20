_trim = (str) ->
    str = ngx.re.gsub str, '^\\s*(\\S.*?)\\s*$', '$1'
    str

_table2xml = (data) ->
    tag = data['/']
    data['/'] = nil
    open = '<' .. tag .. table.concat [" #{ k }=\"#{ v }\"" for k, v in pairs data when '' != k]
    return open .. ' />' if not data['']
    content = if 'table' == type data[''] then table.concat [_table2xml i for i in *data['']]
    else "<![CDATA[#{ data[''] }]]>"
    open .. '>' .. content .. '</' .. tag .. '>'

class Builder
    new: (parser) =>
        @_ = parser
        @domain = parser.domain

    toc: =>
        data = @_.toc @url
        return if not data
        (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' ..
            '<?xml-stylesheet type="text/xsl" href="../toc.xslt"?>\n' ..
            _table2xml {
                '/': 'Novel',
                '': {
                    {
                        '/': 'Title',
                        '': _trim data.title
                    }, {
                        '/': 'Author',
                        '': _trim data.author
                    }, {
                        '/': 'Chapters',
                        '': [{
                            '/': 'Chapter',
                            ref: _trim i[1],
                            '': _trim i[2]
                        } for i in *data.chapters]
                    }
                }
            }
        )

    chapter: (ref, metas) =>
        data = @_.chapter @url .. ref
        return if not data
        (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' ..
            '<?xml-stylesheet type="text/xsl" href="../chapter.xslt"?>\n' ..
            _table2xml {
                '/': 'Chapter',
                toc: "/n/#{ metas.novel }/",
                ref: ref,
                '': {
                    {
                        '/': 'Title',
                        '': _trim data.title
                    }, {
                        '/': 'Paragraphs',
                        '': [{
                            '/': 'Paragraph',
                            '': _trim i
                        } for i in *data.paragraphs when 0 < #(_trim i)]
                    }
                }
            }
        )

{
    for: (url) ->
        ok, parser = pcall =>
            httpc = require'resty.http'.new!
            parts = [i[0] for i in ngx.re.gmatch httpc\parse_uri(url)[2], '[^\\.]+']
            require 'driver.' .. parts[#parts - 1] .. '_' .. parts[#parts]
        return if not ok
        builder = Builder parser
        builder.url = url
        builder
}
