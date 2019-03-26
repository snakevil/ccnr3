import * as React from 'react';

import { Bookshelf } from '../../../model';

export default function (props: { [prop: string]: any }) {
    // const chapter = props.data.read();
    const [
            chapter,
            setChapter
        ] = React.useState('paragraphs' in props.data ? props.data : null),
        [
            index,
            setIndex
        ] = React.useState(1),
        [
            total,
            setTotal
        ] = React.useState(0),
        [
            now,
            setNow
        ] = React.useState(new Date()),
        hhmm = React.useCallback(() => {
            let min = '' + now.getMinutes();
            if (2 > min.length)
                min = '0' + min;
            return now.getHours() + ':' + min;
        }, [now]),
        $prev = React.useCallback(() => {
            if (1 < index)
                setIndex(index - 1);
        }, [index]),
        $next = React.useCallback(() => {
            if (index < total)
                setIndex(index + 1);
        }, [index, total]);
    React.useEffect(() => {
        let to = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(to);
    });
    React.useEffect(() => {
        if (!chapter) return;
        document.title = chapter.novel.title + ' ' + chapter.title + ' | CCNR/3';

        const limit = window.innerHeight,
            viewport = document.querySelector('.viewport'),
            trie = viewport.appendChild(document.createElement('div')),
            title = trie.appendChild(document.createElement('h2')),
            inject = (trie: HTMLDivElement, text: string, a?: number, b?: number): string => {
                const p = trie.lastChild;
                if (!b) {
                    p.textContent = text;
                    if (trie.scrollHeight <= limit) return '';
                }
                a = Math.min(text.length, Math.max(0, a || 0));
                b = Math.min(text.length, Math.max(0, b || text.length));
                let c;
                if (a > b) {
                    c = a;
                    a = b;
                    b = c;
                }
                c = (a + b) >> 1;
                p.textContent = text.substr(0, c);
                if (a == c || b == c) return text.substr(c);
                if (trie.scrollHeight > limit)
                    return inject(trie, text, a, c);
                return inject(trie, text, c, b);
            },
            build = () => {
                const children = [];
                while (trie.firstChild) {
                    const element = trie.firstChild as HTMLElement,
                        props: { [key: string]: any } = {
                            key: children.length
                        };
                    if (element.className) props.className = element.className;
                    trie.removeChild(element);
                    children.push(React.createElement(element.tagName.toLowerCase(), props, element.textContent));
                }
                return React.createElement('div', { className: 'page' }, children);
            };
        trie.className = 'trie';
        title.textContent = chapter.title;
        chapter.pages = chapter.paragraphs.reduce((pages: any[], paragraph: string, index: number) => {
            trie.appendChild(document.createElement('p'));
            let left = inject(trie, paragraph);
            while (left) {
                pages.push(build());
                trie.appendChild(document.createElement('p')).className = 'tail';
                left = inject(trie, left);
            }
            return pages;
        }, []);
        chapter.pages.push(build());
        viewport.removeChild(trie);
        setTotal(chapter.pages.length);
    }, [ chapter ]);

    if (!chapter) {
        if ('children' in props.data) {
            const bookshelf = Bookshelf.load(),
                raw = props.data,
                matched = decodeURI(location.href).match(/^(.*\/)([^\/]+)\/(\d+)$/);
            if (!matched) throw '无法找到正确的功能路径。';
            raw.index = + matched[3];
            bookshelf.as(matched[1]).fetch(matched[2]).then(novel => setChapter(novel.import(raw) as any));
        } else (props.data as Promise<any>).then((chapter) => setChapter(chapter));
    }

    return (
        <>
            <div className="viewport">
                {
                    chapter && chapter.pages ? chapter.pages[index - 1]: null
                }
            </div>
            {
                chapter ? null : (
                    <div className="loading" />
                )
            }
            <div className="pad">
                <div>
                    <div onClick={ $prev } />
                    <label>{ chapter ? chapter.novel.title : '？' }</label>
                    <label>{ index + '/' + (total || '?') }</label>
                    <label>{ chapter ? (Math.round(chapter.index * 1000 / chapter.novel.length) / 10 + '%') : '?%' }</label>
                    <label>{ hhmm() }</label>
                    <div onClick={ $next } />
                </div>
            </div>
        </>
    )
}
