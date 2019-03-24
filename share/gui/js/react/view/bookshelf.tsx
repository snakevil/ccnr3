import * as React from 'react';

import { Bookshelf } from '../../model';

export default function (props: { [prop: string]: any }) {
    return (
        <ol>
            {
                (props.data as Bookshelf).novels.map((novel, index) => (
                    <li key={ index }>
                        <a href={ novel.title + '/' }>{ novel.title }</a>
                    </li>
                ))
            }
        </ol>
    )
}
