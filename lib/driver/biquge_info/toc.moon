Http = require'resty.http'
import trim from require'utility.string'

(url) ->
    -- http = Http.new!
    -- resp, err = http\request_uri url, {
    --     ssl_verify: false,
    --     keepalive: false
    -- }
    -- clob = resp.body
    clob = ''
    with io.open '/tmp/toc.txt'
        clob = \read '*a'
        \close!
    data = {}
    l, r, e = ngx.re.find clob, '<meta property="og:title" content="(.+?)"/>'
    return if e
    data.title = trim clob\sub 35 + l, r - 3
    clob = clob\sub 1 + r
    l, r, e = ngx.re.find clob, '<meta property="og:novel:author" content="(.+?)"/>'
    return if e
    data.author = trim clob\sub 42 + l, r - 3
    clob = clob\sub 1 + r
    _, l = clob\find '<div id="list">'
    return if not l
    l += 1
    r = clob\find '<div class="dahengfu">', l
    return if not r
    clob = clob\sub l, r - 1
    data.chapters = [{ trim(i[1]), trim i[2] } for i in ngx.re.gmatch clob, '<dd><a href="(\\d+\\.html)" title="[^"]+">(.+)</a></dd>']
    data
