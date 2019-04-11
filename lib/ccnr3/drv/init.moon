Http = require'resty.http'

_fetch = (url) ->
    httpc = Http.new!
    resp, err = httpc\request_uri url, {
        headers: {
            ['User-Agent']: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15'
        },
        ssl_verify: false,
        keepalive: false
    }
    return if err
    resp.body

_format = (str) ->
    str = ngx.re.gsub str, '^\\s*(\\S.*?)\\s*$', '$1'
    str = ngx.re.gsub str, ' ', '&nbsp;'
    str = ngx.re.gsub str, '\\p{C}', '', 'u'
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
        data = @_.toc _fetch @url
        file, e = io.open '/tmp/toc.json', 'w+'
        return nil, e if not file
        with file
            \write require'cjson'.encode data
            \close!
        return if not data
        (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' ..
            '<?xml-stylesheet type="text/xsl" href="../toc.xslt"?>\n' ..
            _table2xml {
                '/': 'Novel',
                '': {
                    {
                        '/': 'Title',
                        '': _format data.title
                    }, {
                        '/': 'Author',
                        '': _format data.author
                    }, {
                        '/': 'Chapters',
                        '': [{
                            '/': 'Chapter',
                            ref: _format i[1],
                            '': _format i[2]
                        } for i in *data.chapters]
                    }
                }
            }
        )

    chapter: (ref, metas) =>
        data = @_.chapter _fetch @url .. ref
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
                        '': _format data.title
                    }, {
                        '/': 'Paragraphs',
                        '': [{
                            '/': 'Paragraph',
                            '': _format i
                        } for i in *data.paragraphs when 0 < #(_format i)]
                    }
                }
            }
        )

{
    for: (url) ->
        ok, parser = pcall =>
            httpc = require'resty.http'.new!
            parts = [i[0] for i in ngx.re.gmatch httpc\parse_uri(url)[2], '[^\\.]+']
            require 'ccnr3.drv.' .. parts[#parts - 1] .. '_' .. parts[#parts]
        return if not ok
        builder = Builder parser
        builder.url = url
        builder
}
