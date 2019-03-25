import * as React from 'react';

export default function (props: { [prop: string]: any }) {
    const novel = props.data,
        [
            unread,
            setUnread
        ] = React.useState(novel.length - (novel.read ? novel.read.index : 0)),
        $chapter = React.useCallback((event: React.MouseEvent) => {
            if ('A' == (event.target as HTMLElement).tagName) return;
            novel.fetch(novel.read ? novel.read.index : 1).then((chapter: any) =>
                props.$go(novel.title + '/' + chapter.index, chapter)
            );
        }, []),
        $toc = React.useCallback((event: React.MouseEvent) => {
            event.preventDefault();
            props.$go(novel.title + '/', novel);
        }, []);
    novel.update().then(() => setUnread(novel.length - (novel.read ? novel.read.index : 0)));

    return (
        <li onClick={ $chapter }>
            <h2>{ novel.title }</h2>
            <address>{ novel.author }</address>
            <dl>
                <dt>未读章数</dt>
                <dd className={ unread ? 'unread' : 'none' }>{ unread }</dd>
                <dt>最新章节</dt>
                <dd>
                    <a href={ novel.title + '/' } onClick={ $toc }>{ novel.last.title }</a>
                </dd>
            </dl>
        </li>
    );
}
