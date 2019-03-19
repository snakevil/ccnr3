Cjson = require'cjson'

import store from require'utility.io'

_table2xml = (data) ->
    tag = data['/']
    data['/'] = nil
    open = '<' .. tag .. table.concat [" #{ k }=\"#{ v }\"" for k, v in pairs data when '' != k]
    return open .. ' />' if not data['']
    content = if 'table' == type data[''] then table.concat [_table2xml i for i in *data['']]
    else "<![CDATA[#{ data[''] }]]>"
    open .. '>' .. content .. '</' .. tag .. '>'

(req, resp, next) ->
    resp\set_header 'Server', 'CCNR/3'
    resp.xml = (data) =>
        headers = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        if 'table' == type data
            if not data['']
                data[''] = {}
            elseif 'table' != type data['']
                data[''] = { data[''] }
        else
            data = {
                '/': 'Error',
                '': Cjson.encode data
            }
        if data['?']
            headers ..= '<?xml-stylesheet type="text/xsl" href="' .. data['?'] .. '"?>\n'
            data['?'] = nil
        @set_header 'Content-Type', 'application/xml; charset=utf-8'
        ngx.say store headers .. _table2xml data
    next!
