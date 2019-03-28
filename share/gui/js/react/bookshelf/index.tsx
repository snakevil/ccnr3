import * as React from 'react';

import * as Model from '../../model';

import Book from './book';

export default function (props: { model: Model.Bookshelf, onClick: (model: Model.Bookshelf | Model.INovel | Model.IChapter) => void }) {
    React.useEffect(() => {
        document.title = '书架 | CCNR/3';
        document.body.className = 'page-bookshelf';
    }, [ props.model ]);

    return (
        <>
            <h1>书架</h1>
            <ol>
                {
                    props.model.novels.map((novel, index) => (
                        <Book key={ 'book_' + index } model={ novel } onClick={ props.onClick } />
                    ))
                }
            </ol>
        </>
    )
}
