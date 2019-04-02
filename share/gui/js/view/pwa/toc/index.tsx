import * as React from 'react';

import * as Model from '../../../model';

/**
 * @param {Model.INovel} model 书籍实例
 * @param {[number, number]} size 窗口尺寸
 * @param {boolean} animate 是否动画显示
 * @param {(model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void} onClick 切换模型实例方法
 * @param {boolean} visible 是否可见
 * @param {() => void} rcShowBookshelf 显示书架层回调
 * @param {() => void} rcHideBookshelf 隐藏书架层回调
 */
export default function ({ model, size, animate, onClick, visible, rcShowBookshelf, rcHideBookshelf }: {
    model: Model.INovel,
    size: [number, number],
    animate: boolean,
    onClick: (model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void,
    visible: boolean,
    rcShowBookshelf: () => void,
    rcHideBookshelf: () => void
}) {
    const toc = React.useRef(), // 绑定主元素
        [
            left,
            setLeft
        ] = React.useState(animate ? size[0] : 0), // 记录左边距
        [
            animated,
            setAnimated
        ] = React.useState(!animate), // 记录是否已动画
        [
            grabbing,
            setGrabbing
        ] = React.useState(false), // 记录是否在拖拽
        $chapter = React.useCallback((event: React.MouseEvent) => {
            // 阅读章节
            event.preventDefault();
            onClick(model.get(+ (event.target as HTMLLinkElement).getAttribute('href')), true);
        }, [ model ]),
        _then = React.useCallback((callback: () => void) => {
            const div = toc.current as HTMLDivElement,
                fn = (event: TransitionEvent) => {
                    div.removeEventListener('transitionend', fn);
                    div.removeEventListener('webkittransitionend', fn);
                    callback();
                };
            div.addEventListener('transitionend', fn);
            div.addEventListener('webkittransitionend', fn);
        }, []);
    React.useEffect(() => {
        const div = toc.current as HTMLDivElement,
            get = (event: MouseEvent | TouchEvent) =>
                ('clientX' in event ? event : event.changedTouches[0]).clientX,
            start = (event: MouseEvent | TouchEvent) => {
                const x = get(event);
                // 左两侧 33.33% 为有效区间
                origin = 3 * x < size[0] ? x : 0;
                if (origin)
                    setGrabbing(true);
            },
            move = (event: MouseEvent | TouchEvent) => {
                if (!origin)
                    return;
                const x = Math.max(0, Math.round(get(event) - origin));
                if (0 < x)
                    rcShowBookshelf();
                setLeft(x);
            },
            end = (event: MouseEvent | TouchEvent) => {
                if (!origin)
                    return;
                // 视图拖拽已过半屏则认为意图要滑出视野，否则重置（贴近边）
                setGrabbing(false);
                setAnimated(true);
                setLeft(2 * (get(event) - origin) > size[0] ? size[0] : 0);
                origin = 0;
            };
        let origin: number = 0;
        div.addEventListener('mousedown', start);
        div.addEventListener('mousemove', move);
        div.addEventListener('mouseup', end);
        div.addEventListener('touchstart', start);
        div.addEventListener('touchmove', move);
        div.addEventListener('touchend', end);
        return () => {
            div.removeEventListener('mousedown', start);
            div.removeEventListener('mousemove', move);
            div.removeEventListener('mouseup', end);
            div.removeEventListener('touchstart', start);
            div.removeEventListener('touchmove', move);
            div.removeEventListener('touchend', end);
        };
    }, [ size ]);
    React.useEffect(() => {
        // 执行动画
        if (!animated) {
            setAnimated(true);
            setLeft(0);
            _then(rcHideBookshelf);
        }
    }, [ animated ]);
    React.useEffect(() => {
        // 等待右移出视野后切换至书架
        if (size[0] == left && animated)
            _then(() => onClick(model.parent));
    }, [ model, size, left, animated ]);

    const length = model.length,
        dual = length % 2 || 2,
        tri = length % 3 || 3;

    return (
        <div ref={ toc } className={ 'toc' + (grabbing ? ' grabbing' : '') + (visible ? '' : ' hidden') } style={ { left } }>
            <h2>{ model.title }</h2>
            <address>{ model.author }</address>
            <ol>
                {
                    model.chapters.map((chapter: string | Model.IChapter, index: number) => {
                        const classes = [],
                            title = 'string' == typeof chapter
                                ? chapter
                                : chapter.title;
                        if (index + dual >= length)
                            classes.push('dual');
                        if (index + tri >= length)
                            classes.push('tri');
                        return (
                            <li key={  'li_' + index } className={ classes.join(' ') }>
                                <a href={ '' + (1 + index) } onClick={ $chapter }>{ title }</a>
                            </li>
                        );
                    })
                }
            </ol>
        </div>
    );
}