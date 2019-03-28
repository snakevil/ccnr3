import * as React from 'react';

import * as Model from '../../model';

export default function (props: { model: Model.INovel, onClick: (model: Model.Bookshelf | Model.INovel | Model.IChapter) => void }) {
    const novel = props.model,
        size = novel.length,
        dual = size % 2 || 2,
        tri = size % 3 || 3,
        $chapter = React.useCallback((event: React.MouseEvent) => {
            event.preventDefault();
            const chapter = novel.get(+ (event.target as HTMLAnchorElement).getAttribute('href'));
            props.onClick(chapter);
        }, [ novel ]);
    React.useEffect(() => {
        document.title = novel.title + ' | CCNR/3';
        document.body.className = 'page-toc';
    }, [ novel ]);

    return (
        <>
            <h1>{ novel.title }</h1>
            <address>{ novel.author }</address>
            <ol>
                { novel.chapters.map((chapter: string | Model.IChapter, index: number) => {
                    const classes = [],
                        title = 'string' == typeof chapter
                            ? chapter
                            : chapter.title;
                    if (index + dual >= size)
                        classes.push('dual');
                    if (index + tri >= size)
                        classes.push('tri');
                    return (
                        <li key={  'li_' + index } className={ classes.join(' ') }>
                            <a href={ '' + (1 + index) } onClick={ $chapter }>{ title }</a>
                        </li>
                    );
                }) }
            </ol>
        </>
    )
}
