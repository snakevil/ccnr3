(req, resp, next) ->
    with resp
        \set_header 'Last-Modified', ngx.http_time ngx.time!
        if 'HEAD' == req.method
            \set_header 'Content-Type', 'application/xml'
            \set_header 'Content-Length', #req.ctx.toc
            \set_header 'Accept-Ranges', 'bytes'
        else
            \xml req.ctx.toc
