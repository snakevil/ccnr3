(req, resp, next) ->
    chapters = [1 for i in ngx.re.gmatch req.ctx.toc, '<Chapter ref="(.*?)"><!\\[CDATA\\[(.*?)\\]\\]></Chapter>']
    resp\send #chapters
