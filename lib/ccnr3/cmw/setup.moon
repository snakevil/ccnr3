(req, resp, next) ->
    resp\set_header 'Server', 'CCNR/3'
    req.ctx = {}
    resp.store = (path, data) =>
        file, e = io.open path, 'w+'
        return nil, e if not file
        with file
            \write data
            \flush!
            \close!
        data
    resp.xml = (data) =>
        @set_header 'Content-Type', 'application/xml; charset=utf-8'
        ngx.say data
    next!