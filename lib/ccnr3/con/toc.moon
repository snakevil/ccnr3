(req, resp, next) ->
    resp\xml req.ctx.toc
