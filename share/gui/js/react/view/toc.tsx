import * as React from 'react';

export default function (props: { [prop: string]: any }) {
    const toc = props.data,
        onclick = (event: React.MouseEvent) => {
            event.preventDefault();
            const url = (event.target as HTMLAnchorElement).href;
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
