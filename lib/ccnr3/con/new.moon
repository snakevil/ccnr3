Lfs = require'lfs'

(req, resp, next) ->
    prefix = ngx.re.gsub req.uri, 'https?:/.*$', ''
    url = ngx.re.gsub req.query['-'], ':/', '://'
    driver = require'ccnr3.drv'.for url
    return resp\status 406 if not driver
    toc = driver\toc!
    return resp\status 504 if not toc
    matched = ngx.re.match toc, '<Title><!\\[CDATA\\[(.*)\\]\\]></Title>'
    return resp\status 504 if not matched
    title = matched[1]
    path = ngx.var.document_root .. req.ctx.db .. '/' .. title
    if not Lfs.attributes path
        return resp\status 503 if not Lfs.mkdir path
        file = io.open path .. '/SOURCE', 'w+'
        return resp\status 503 if not file
        with file
            \write url
            \close!
        file = io.open path .. '/toc.xml', 'w+'
        if file
            with file
                \write toc
                \close!
    resp\redirect prefix .. title .. '/'
