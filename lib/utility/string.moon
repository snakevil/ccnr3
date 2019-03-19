{
    trim: (str) ->
        str = ngx.re.gsub str, '^\\s*(\\S.*?)\\s*$', '$1'
        str
}
