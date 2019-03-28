import * as React from 'react';

import * as Model from '../../../model';

import Page from './page';
import Loading from './loading';
import Pad from './pad';

export default function (props: { model: Model.IChapter, page: number, dimesions: [number, number], onClick: (model: Model.Bookshelf | Model.INovel | Model.IChapter, page?: number) => void }) {
    const {
            model: chapter,
            dimesions
        } = props,
        [
            pages,
            setPages
        ] = React.useState([]),
        [
            index,
            setIndex
        ] = React.useState(0),
        [
            percent,
            setPercent
        ] = React.useState(0),
        viewport = React.useRef(),
        $prev = React.useCallback(() => {
            if (1 > index)
                return;
            if (1 != index) {
                setIndex(index - 1);
            } else if (1 < chapter.index) {
                setPages([]);
                props.onClick(chapter.novel.get(chapter.index - 1), -1);
            } else {
                console.error('TODO: first chapter error');
            }
        }, [ pages, index ]),
        $next = React.useCallback(() => {
            if (!pages)
                return;
            if (pages.length != index)
                setIndex(index + 1);
            else if (chapter.index < chapter.novel.length) {
                setPages([]);
                props.onClick(chapter.novel.get(chapter.index + 1), 0);
            } else {
                console.error('TODO: last chapter error');
            }
        }, [ pages, index ]);
    React.useEffect(() => {
        if (chapter.title)
            document.title = chapter.novel.title + ' ' + chapter.title + ' | CCNR/3';
    }, [ chapter.loaded ]);
    React.useEffect(() => {
        const limit = dimesions[1],
            append = (trie: HTMLDivElement, text: string, left: number = 0, right?: number): string => {
                const M = Math,
                    p = trie.lastChild as HTMLParagraphElement;
                if (!right) {
                    // 整段测试时如果并未超限就直接成功
                    p.textContent = text;
                    if (trie.scrollHeight <= limit)
                        return '';
                }
                left = M.min(text.length, M.max(0, left));
                right = M.min(text.length, M.max(0, right || text.length));
                let middle: number;
                if (left > right) {
                    // 确保左边界在右边界之前
                    middle = left;
                    left = right;
                    right = middle;
                }
                middle = (left + right) >> 1;
                p.textContent = text.substr(0, middle);
                // 无法继续二分则说明已定位成功
                if (left == middle || right == middle)
                    return text.substr(middle);
                // 超限说明合适点在中点左侧
                if (trie.scrollHeight > limit)
                    return append(trie, text, left, middle);
                // 未超限说明合适点在中点右侧
                return append(trie, text, middle, right);
            },
            archive = (trie: HTMLDivElement) => {
                const children: Array<[number, string]> = [];
                while (trie.firstChild) {
                    const element = trie.firstChild as HTMLHeadingElement | HTMLParagraphElement;
                    trie.removeChild(element);
                    children.push([
                        'H2' == element.tagName
                            ? 2
                            : +!!element.className,
                        element.textContent
                    ]);
                }
                return children;
            },
            paginate = () => {
                const D = document,
                    C = D.createElement.bind(D),
                    container: HTMLDivElement = viewport.current,
                    trie: HTMLDivElement = container.appendChild(C('div')),
                    h2: HTMLHeadingElement = trie.appendChild(C('h2'));
                trie.className = 'trie';
                h2.textContent = chapter.title;
                const pages = chapter.content.reduce((pages, paragraph, index) => {
                    // 添加空段落以测试
                    trie.appendChild(C('p'));
                    let left = append(trie, paragraph);
                    while (left) {
                        // 段落超长时说明分页已满需要拆分
                        // 一字未拆则删除无内容的测试段落
                        if (left == paragraph)
                            trie.removeChild(trie.lastChild);
                        pages.push(archive(trie));
                        const p = trie.appendChild(C('p'));
                        // 被拆分需要强调剩余文本并不是完整段落
                        if (left != paragraph)
                            p.className = 'cont';
                        left = append(trie, left);
                    }
                    return pages;
                }, []);
                // 剩余内容为最后一页
                pages.push(archive(trie));
                container.removeChild(trie);
                setPages(pages);
            };
        if (true === chapter.loaded)
            return paginate();
        (chapter.loaded as Promise<any>).then(() => paginate());
    }, [ chapter, dimesions ]);
    React.useEffect(() =>
        setIndex(pages[0] && 0 > props.page ? pages.length : 1),
    [ pages ]);
    React.useEffect(() =>
        setPercent(Math.round(chapter.index * 1000 / chapter.novel.length) / 10),
    [ chapter.novel.loaded, chapter ]);

    return (
        <>
            <div className="mobile" ref={ viewport }>
                {
                    pages[0] ? (
                        <Page data={ pages[index - 1] } />
                    ) : (
                        <Loading />
                    )
                }
            </div>
            <Pad onPrev={ $prev }
                onNext={ $next }
                title={ chapter.novel.title }
                index={ pages[0] ? index : 0 }
                length={ pages.length }
                percent={ percent }
                />
        </>
    );
}
