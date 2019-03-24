import * as React from 'react';

import { Chapter } from '../../model';

export default function (props: { [prop: string]: any }) {
    const toc = props.data,
        onclick = (event: React.MouseEvent) => {
            event.preventDefault();
            const url = (event.target as HTMLAnchorElement).href;
            Chapter.from(url).then((chapter: Chapter) => {
                props.$go(url, chapter);
            });
        };
    return (
        <>
            <h1>{ toc.title }</h1>
            <address>{ toc.author }</address>
            <ol>
                { toc.chapters.map((title: string, index: number) => (
                    <li key={ index }>
                        <a href={ '' + (1 + index) } onClick={ onclick }>{ title }</a>
                    </li>
                )) }
            </ol>
        </>
    )
}
