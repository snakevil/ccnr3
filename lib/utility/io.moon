{
    source: ->
        path = ngx.re.gsub ngx.var.document_root .. ngx.var.uri, '/[^/]+\\.xml$', '/SOURCE'
        file = io.open path
        return nil if not file
        with file
            content = \read!
            \close!
            return content
}
