Cjson = require'cjson'

_table2xml = (data) ->
    tag = data['/']
    data['/'] = nil
    open = '<' .. tag .. table.concat [" #{ k }=\"#{ v }\"" for k, v in pairs data when '' != k]
    return open .. ' />' if not data['']
    content = if 'table' == type data[''] then table.concat [_table2xml i for i in *data['']]
    else "<![CDATA[#{ data[''] }]]>"
    open .. '>' .. content .. '</' .. tag .. '>'

(req, resp, next) ->
    resp\set_header 'X-Powered-By', 'CCNR/3'
    resp.xml = (data) =>
        headers = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        if 'table' == type data
            if not data['']
                data[''] = {}
            elseif 'table' != type data['']
                data[''] = { data[''] }
            table.insert data[''], {
                '/': 'Storage',
                '': ngx.var.document_root .. ngx.var.uri
            }
        else
            data = {
                '/': 'Error',
                '': Cjson.encode data
            }
        if data['?']
            headers ..= '<?xml-stylesheet type="text/xsl" href="' .. data['?'] .. '"?>\n'
            data['?'] = nil
        @set_header 'Content-Type', 'application/xml; charset=utf-8'
        ngx.say headers .. _table2xml data
    next!
