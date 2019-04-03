import * as React from 'react';

import * as Model from '../../model';

import { Bookshelf } from './bookshelf';
import { TOC } from './toc';
import { Chapter } from './chapter';


/**
 * @param {Model.IBookshelf | Model.INovel | Model.IChapter} model 当前模型实例
 * @param {number} page 仅用于章节页分片传参
 * @param {[number, number]} size 用于渲染交互匹配的屏幕尺寸
 * @param {boolean} animate 是否动画交互
 * @param {(model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void} onClick 切换模型实例方法
 */
export function PWA ({ model, page, size, animate, onClick }: {
    model: Model.IBookshelf | Model.INovel | Model.IChapter,
    page: number,
    size: [number, number],
    animate: boolean,
    onClick: (model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void
}) {
    const [
            index,
            setIndex
        ] = React.useState(page), // 翻页状态记录
        [
            visBookshelf,
            setVisBookshelf
        ] = React.useState(-1), // 记录书架渲染预期
        [
            visNovel,
            setVisNovel
        ] = React.useState(-1), // 记录书籍渲染预期
        $pagedGo = React.useCallback((model: Model.IBookshelf | Model.INovel | Model.IChapter, page: number = 1) => {
            setIndex(page);
            onClick(model);
        }, [ onClick ]),
        $showBookshelf = React.useCallback(() => {
            // 显示书架层
            if (1 != visBookshelf) {
                setVisBookshelf(1);
            }
        }, [ visBookshelf ]),
        $hideBookshelf = React.useCallback(() => {
            // 隐藏书架层
            if (0 != visBookshelf) {
                setVisBookshelf(0);
            }
        }, [ visBookshelf ]),
        $showNovel = React.useCallback(() => {
            // 显示书籍层
            if (1 != visNovel) {
                setVisNovel(1);
            }
        }, [ visNovel ]),
        $hideNovel = React.useCallback(() => {
            // 隐藏书籍层
            if (0 != visNovel) {
                setVisNovel(0);
            }
        }, [ visNovel ]);
    React.useEffect(() => {
        // 模型实例变更时重算关系
        setVisBookshelf(-1);
        setVisNovel(-1);
    }, [ model ]);

    let bookshelf: Model.IBookshelf,
        novel: Model.INovel,
        chapter: Model.IChapter;
    if ('index' in model) {
        chapter = model;
        novel = chapter.parent;
    } else if ('author' in model)
        novel = model;
    bookshelf = novel ? novel.parent : model as Model.IBookshelf;

    return (
        <> {
            chapter ? null : (
                <Bookshelf model={ bookshelf }
                    onClick={ onClick }
                    visible={ -1 < visBookshelf ? !!visBookshelf : !novel || animate }
                    />
            )
        } {
            novel ? (
                <TOC model={ novel }
                    size={ size }
                    animate={ animate }
                    onClick={ onClick }
                    visible={ -1 < visNovel ? !!visNovel : !chapter || animate }
                    rcShowBookshelf={ $showBookshelf }
                    rcHideBookshelf={ $hideBookshelf }
                    />
            ) : null
        } {
            chapter ? (
                <Chapter model={ chapter }
                    page={ index }
                    size={ size }
                    animate={ animate }
                    onClick={ $pagedGo }
                    rcShowNovel={ $showNovel }
                    rcHideNovel={ $hideNovel }
                    />
            ) : null
        }
        </>
    );
}
