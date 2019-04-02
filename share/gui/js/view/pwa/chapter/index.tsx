import * as React from 'react';

import * as Model from '../../../model';

import Page from './page';
import HUD from './HUD';
import Menu from './menu';

/**
 * @param {Model.IChapter} model 章节实例
 * @param {number} page 页号
 * @param {[number, number]} size 窗口尺寸
 * @param {boolean} animate 是否动画显示
 * @param {(model: Model.IBookshelf | Model.INovel | Model.IChapter, page?: number) => void} onClick 切换模型实例方法
 * @param {() => void} rcShowNovel 显示书籍层回调
 * @param {() => void} rcHideNovel 隐藏书籍层回调
 */
export default function ({ model, page, size, animate, onClick, rcShowNovel, rcHideNovel }: {
    model: Model.IChapter,
    page: number,
    size: [number, number],
    animate: boolean,
    onClick: (model: Model.IBookshelf | Model.INovel | Model.IChapter, page?: number) => void,
    rcShowNovel: () => void,
    rcHideNovel: () => void
}) {
    const chapter = React.useRef(), // 绑定主元素
        [
            pages,
            setPages
        ] = React.useState(model.pages || []), // 记录分页数据
        [
            index,
            setIndex
        ] = React.useState(page || 1), // 记录当前分页
        [
            left,
            setLeft
        ] = React.useState(animate ? size[0] : 0), // 记录左边距
        [
            animated,
            setAnimated
        ] = React.useState(!animate), // 记录是否已动画
        [
            menu,
            setMenu
        ] = React.useState(false), // 记录菜单状态
        $click = React.useCallback((event: React.MouseEvent) => {
            // 切换菜单可视状态
            const width = size[0] / 3,
                x = event.clientX;
            if (x < width) {
                // TODO
                if (!pages[0])
                    return;
                if (2 > index) {
                    if (1 < model.index) {
                        setIndex(999);
                        onClick(model.parent.get(model.index - 1), 999);
                    } else
                        console.error('first chapter already');
                } else
                    setIndex(index - 1);
            } else if (x > 2 * width) {
                // TODO
                if (!pages[0])
                    return;
                if (index == pages.length) {
                    if (model.index != model.parent.length) {
                        setIndex(1);
                        onClick(model.parent.get(model.index + 1));
                    } else
                        console.error('last chapter already');
                } else
                    setIndex(index + 1);
            } else
                setMenu(!menu);
        }, [ pages, size, index, menu ]),
        $toc = React.useCallback((event: React.MouseEvent) => {
            // 切换至目录组件实例
            event.preventDefault();
            rcShowNovel();
            setLeft(size[0]);
            _then(() => onClick(model.parent));
        }, [ model, size ]),
        _then = React.useCallback((callback: () => void) => {
            const div = chapter.current as HTMLDivElement,
                fn = (event: TransitionEvent) => {
                    div.removeEventListener('transitionend', fn);
                    div.removeEventListener('webkittransitionend', fn);
                    callback();
                };
            div.addEventListener('transitionend', fn);
            div.addEventListener('webkittransitionend', fn);
        }, []);
    React.useEffect(() => {
        // 分页
        const limit = size[1],
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
                        'H3' == element.tagName
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
                    div: HTMLDivElement = chapter.current,
                    trie: HTMLDivElement = div.appendChild(C('div')),
                    h3: HTMLHeadingElement = trie.appendChild(C('h3'));
                trie.className = 'trie';
                h3.textContent = model.title;
                const pages = model.content.reduce((pages, paragraph, index) => {
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
                div.removeChild(trie);
                setPages(pages);
            };
        if (true === model.loaded)
            return paginate();
        (model.loaded as Promise<any>).then(() => paginate());
    }, [ model, size ]);
    React.useEffect(() => {
        // 修正当前分页
        if (pages[0] && index > pages.length)
            setIndex(pages.length);
    }, [ pages ]);
    React.useEffect(() => {
        // 同步 URL
        location.hash = '#' + index;
    }, [ index ]);
    React.useEffect(() => {
        // 执行动画
        if (!animated) {
            setAnimated(true);
            setLeft(0);
            _then(rcHideNovel);
        }
    }, [ animated ]);

    const novel = model.parent;

    return (
        <div ref={ chapter } className="chapter" style={ { left } } onClick={ $click }>
            <Page data={ pages[index - 1] } />
            <HUD title={ novel.title }
                index={ index }
                length={ pages[0] ? pages.length : 0 }
                percent={ Math.round(model.index * 1000 / novel.length) / 10 }
                />
            {
                menu ? (
                    <Menu onTOC={ $toc } />
                ) : null
            }
        </div>
    );
}
