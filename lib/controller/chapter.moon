(req, resp, next) ->
    req.params.index = ngx.re.gsub req.params.index, '\\.xml$', ''
    index = tonumber req.params.index
    chapters = [i[1] for i in ngx.re.gmatch req.ctx.toc, '<Chapter ref="(.*?)"><!\\[CDATA\\[(.*?)\\]\\]></Chapter>']
    return resp\status 404 if #chapters < index
    driver = req.ctx.driver
    driver = require'driver'.for req.ctx.url if not driver
    return resp\status 501 if not driver
    data = driver\chapter chapters[index], novel: req.params.novel
    return resp\status 504 if not data
    resp\store ngx.var.document_root .. ngx.var.uri, data
    resp\xml data
