{
    dispatch: -> {
        with require'lor.index'!
            \use require'ccnr3.cmw.setup'
            \use '/n/db/:novel', require'ccnr3.cmw.toc'
            \get '/n/db/:novel/toc.xml', require'ccnr3.con.toc'
            \get '/n/db/:novel/:index', require'ccnr3.con.chapter'
            \run!
    }
}
