lor = require'lor.index'!

{
    dispatch: -> {
        with require'lor.index'!
            \use require'middleware.polyfill'
            \get '/n/db/:novel/toc.xml', require'controller.toc'
            \get '/n/db/:novel/:chapter.xml', require'controller.chapter'
            \run!
    }
}
