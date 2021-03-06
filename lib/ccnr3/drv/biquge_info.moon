{
    domain: 'biquge.info',
    toc: (clob) ->
        return if not clob
        data = {}
        l, r = ngx.re.find clob, '<meta property="og:title" content="(.+?)"/>'
        return if not l
        data.title = clob\sub 35 + l, r - 3
        clob = clob\sub 1 + r
        l, r = ngx.re.find clob, '<meta property="og:novel:author" content="(.+?)"/>'
        return if not l
        data.author = clob\sub 42 + l, r - 3
        clob = clob\sub 1 + r
        _, l = clob\find '<div id="list">'
        return if not l
        l += 1
        r = clob\find '<div class="dahengfu">', l
        return if not r
        clob = clob\sub l, r - 1
        data.chapters = [{ i[1], i[2] } for i in ngx.re.gmatch clob, '<dd><a href="(\\d+\\.html)" title="[^"]+">(.+)</a></dd>']
        data

    chapter: (clob) ->
        return if not clob
        data = {}
        l, r = ngx.re.find clob, '<h1>(.+?)</h1>'
        return if not l
        data.title = clob\sub 4 + l, r - 5
        clob = clob\sub 1 + r
        r = clob\find '<div class="bottem">'
        return if not r
        clob = clob\sub 1 , r - 1
        data.paragraphs = [i[1] for i in ngx.re.gmatch clob, '(?:&nbsp;){4}(.+?)(?:<br/>|\\n</div>)']
        data
}
