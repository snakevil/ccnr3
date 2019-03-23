(req, resp, next) ->
    resp\set_header 'Server', 'CCNR/3'
    req.ctx = db: ngx.var.lua_db
    resp.store = (path, data) =>
        file, e = io.open path, 'w+'
        return nil, e if not file
        with file
            \write data
            \close!
        data
    resp.xml = (data) =>
        @set_header 'Content-Type', 'application/xml; charset=utf-8'
        ngx.say data
    next!
