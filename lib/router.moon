{
    dispatch: -> {
        with require'lor.index'!
            \use require'middleware.setup'
            \use '/n/db/:novel', require'middleware.toc'
            \get '/n/db/:novel/toc.xml', require'controller.toc'
            \get '/n/db/:novel/:index', require'controller.chapter'
            \run!
    }
}
