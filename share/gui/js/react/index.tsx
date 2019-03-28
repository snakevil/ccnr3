import * as React from 'react';

import * as Model from '../model';

import Bookshelf from './bookshelf';
import TOC from './toc';
import Chapter from './chapter';

export default function (props: { [prop: string]: any }) {
    const bookshelf = Model.Bookshelf.load(),
        [
            model,
            setModel
        ] = React.useState((): Model.Bookshelf | Model.INovel | Model.IChapter => {
            const data = props.data,
                url = location.href;
            if ('author' in data)
                return bookshelf.set(data.title, data.author, data.children).as(url);
            if ('index' in data)
                return bookshelf.build(location.href, data.title, data.children);
            return bookshelf.as(url);
        }),
        [
            page,
            setPage
        ] = React.useState(0),
        $chapter = React.useCallback((model: Model.Bookshelf | Model.INovel | Model.IChapter, page: number = 0) => {
            setModel(model);
            setPage(page);
        }, []);
    React.useEffect(() => {
        history.replaceState(null, null, model.url);
    }, [ model ]);

    return model instanceof Model.Bookshelf
        ? <Bookshelf model={ model } onClick={ setModel } />
        : ('author' in model
            ? <TOC model={ model } onClick={ setModel } />
            : <Chapter model={ model } page={ page } onClick={ $chapter } />
        )
}
