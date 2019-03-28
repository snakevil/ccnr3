do
    prefix = ngx.var.document_root .. '/n'
    path = ';' .. package.path .. ';'
    if path\find ';%./%?%.lua;'
        extended = table.concat {
            '',
            prefix .. '/lib/?.ljbc',
            prefix .. '/lib/?/init.ljbc',
            prefix .. '/lib/?.lua',
            prefix .. '/lib/?/init.lua',
            ''
        }, ';'
        package.path = path\gsub(';%./%?%.lua;', extended)\sub 2, -2

require'ccnr3.router'\dispatch!
