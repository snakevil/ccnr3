(req, resp, next) ->
    req.params.index = ngx.re.gsub req.params.index, '\\.xml$', ''
    index = tonumber req.params.index
    chapters = [i[1] for i in ngx.re.gmatch req.ctx.toc, '<Chapter ref="(.*?)"><!\\[CDATA\\[(.*?)\\]\\]></Chapter>']
    return resp\status 404 if #chapters < index
    driver = req.ctx.driver
    driver = require'ccnr3.drv'.for req.ctx.url if not driver
    return resp\status 501 if not driver
    data = driver\chapter chapters[index], novel: req.params.novel
    return resp\status 504 if not data
    with resp
        \store ngx.var.document_root .. req.ctx.db .. ngx.var.uri, data
        \set_header 'Last-Modified', ngx.http_time ngx.time!
        \xml data
