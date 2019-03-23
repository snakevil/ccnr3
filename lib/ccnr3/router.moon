{
    dispatch: -> {
        with require'lor.index'!
            \use require'ccnr3.cmw.setup'
            \use '/:novel', require'ccnr3.cmw.toc'
            \get '/-', require'ccnr3.con.new'
            \head '/:novel/toc.xml', require'ccnr3.con.toc'
            \get '/:novel/toc.xml', require'ccnr3.con.toc'
            \get '/:novel/-size.xml', require'ccnr3.con.size'
            \head '/:novel/:index', require'ccnr3.con.chapter'
            \get '/:novel/:index', require'ccnr3.con.chapter'
            \run!
    }
}
