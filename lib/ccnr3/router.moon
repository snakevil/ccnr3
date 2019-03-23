{
    dispatch: -> {
        with require'lor.index'!
            \use require'ccnr3.cmw.setup'
            \use '/:novel', require'ccnr3.cmw.toc'
            \get '/-', require'ccnr3.ctr.new'
            \head '/:novel/toc.xml', require'ccnr3.ctr.toc'
            \get '/:novel/toc.xml', require'ccnr3.ctr.toc'
            \get '/:novel/-size.xml', require'ccnr3.ctr.size'
            \head '/:novel/:index', require'ccnr3.ctr.chapter'
            \get '/:novel/:index', require'ccnr3.ctr.chapter'
            \run!
    }
}
