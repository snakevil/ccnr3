{
    dispatch: -> {
        with require'lor.index'!
            \use require'ccnr3.cmw.setup'
            \use '/:novel', require'ccnr3.cmw.toc'
            \get '/-', require'ccnr3.con.new'
            \get '/:novel/toc.xml', require'ccnr3.con.toc'
            \get '/:novel/:index', require'ccnr3.con.chapter'
            \run!
    }
}
