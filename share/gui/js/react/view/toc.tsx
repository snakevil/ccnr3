import * as React from 'react';

export default function (props: { [prop: string]: any }) {
    const novel = props.data,
        size = novel.length,
        dual = size % 2 || 2,
        tri = size % 3 || 3,
        $chapter = React.useCallback((event: React.MouseEvent) => {
            event.preventDefault();
            novel.fetch(+ (event.target as HTMLAnchorElement).getAttribute('href')).then((chapter: any) =>
                props.$go(chapter.index, chapter)
            );
        }, []);

    document.body.className = 'page-toc';

    return (
        <>
            <h1>{ novel.title }</h1>
            <address>{ novel.author }</address>
            <ol>
                { novel.chapters.map((title: string, index: number) => {
                    const classes = [];
                    if (index + dual >= size)
                        classes.push('dual');
                    if (index + tri >= size)
                        classes.push('tri');
                    return (
                        <li key={ index } className={ classes.join(' ') }>
                            <a href={ '' + (1 + index) } onClick={ $chapter }>{ title }</a>
                        </li>
                    );
                }) }
            </ol>
        </>
    )
}
