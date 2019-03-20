(req, resp, next) ->
    -- 确保正确读取目录数据。
    path = ngx.re.gsub ngx.var.document_root .. ngx.var.uri, '[^/]+\\.xml$', ''
    file = io.open path .. 'SOURCE'
    return resp\status 404 if not file
    with file
        req.ctx.url = \read!
        \close!
    file = io.open path .. 'toc.xml'
    if file
        with file
            req.ctx.toc = \read '*a'
            \close!
    else
        driver = require'ccnr3.drv'.for req.ctx.url
        return resp\status 501 if not driver
        req.ctx.driver = driver
        req.ctx.toc = driver\toc!
        return resp\status 504 if not req.ctx.toc
        resp\store path .. 'toc.xml', req.ctx.toc
    next!
