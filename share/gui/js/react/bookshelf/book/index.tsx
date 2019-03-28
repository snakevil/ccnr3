import * as React from 'react';

import * as Model from '../../../model';

export default function (props: { model: Model.INovel, onClick: (model: Model.Bookshelf | Model.INovel | Model.IChapter) => void }) {
    const novel = props.model,
        [
            unread,
            setUnread
        ] = React.useState(() => novel.length - (novel.last ? novel.last.index : 0)),
        $chapter = React.useCallback((event: React.MouseEvent) => {
            if ('A' == (event.target as HTMLElement).tagName)
                return;
            const chapter = novel.get(novel.last ? novel.last.index : 1);
            props.onClick(chapter);
        }, [ novel ]),
        $toc = React.useCallback((event: React.MouseEvent) => {
            event.preventDefault();
            props.onClick(novel);
        }, [ novel ]);
    React.useEffect(() => {
        if (true === novel.loaded)
            return;
        novel.load().then(() => setUnread(novel.length - (novel.last ? novel.last.index : 0)));
    }, [ novel ]);

    return (
        <li onClick={ $chapter }>
            <h2>{ novel.title }</h2>
            <address>{ novel.author }</address>
            <dl>
                <dt>未读章数</dt>
                <dd className={ unread ? 'unread' : 'none' }>{ unread }</dd>
                <dt>最新章节</dt>
                <dd>
                    <a href={ novel.title + '/' } onClick={ $toc }>{ novel.get(novel.length, false).title }</a>
                </dd>
            </dl>
        </li>
    );
}
