import * as React from 'react';

import { Bookshelf } from '../../../model';
import Book from './book';

export default function (props: { [prop: string]: any }) {
    document.title = '书架 | CCNR/3';
    document.body.className = 'page-bookshelf';

    return (
        <>
            <h1>书架</h1>
            <ol>
                {
                    (props.data as Bookshelf).novels.map((novel, index) => (
                        <Book key={ index } data={ novel } $go={ props.$go } />
                    ))
                }
            </ol>
        </>
    )
}
