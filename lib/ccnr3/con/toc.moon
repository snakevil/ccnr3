(req, resp, next) ->
    with resp
        \set_header 'Last-Modified', ngx.http_time ngx.time!
        \xml req.ctx.toc
