{
    source: ->
        path = ngx.re.gsub ngx.var.document_root .. ngx.var.uri, '/[^/]+\\.xml$', '/SOURCE'
        file = io.open path
        return if not file
        with file
            content = \read!
            \close!
            return content
    store: (data) ->
        file, e = io.open ngx.var.document_root .. ngx.var.uri, 'w+'
        return if not file
        with file
            \write data
            \flush!
            \close!
        data
}
