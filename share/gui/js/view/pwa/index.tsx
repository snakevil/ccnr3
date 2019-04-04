import * as React from "react";

import * as Model from "../../model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Bookshelf } from "./bookshelf";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TOC } from "./toc";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Chapter } from "./chapter";

import useVisibility from "./visibility.hook";

/**
 *
 * @param {Model.IBookshelf | Model.INovel | Model.IChapter} model 当前模型实例
 * @param {number} page 仅用于 PWA 模式章节页分片传参
 * @param {[number, number]} size PWA 模式屏幕尺寸
 */
export function PWA({
    model,
    page,
    size,
}: {
    model: Model.IBookshelf | Model.INovel | Model.IChapter;
    page: number;
    size: [number, number];
}) {
    const [target, setTarget] = React.useState(model), // 状态化以内部更新
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [index, setIndex] = React.useState(page), // 状态化以内部更新
        [previous, setPrevious] = React.useState(null), // 上一模型实例
        [animate, setAnimate] = React.useState(false), // 是否需要动画效果
        [visBookshelf, showBookshelf, hideBookshelf] = useVisibility(), // 是否强制显示书架
        [visNovel, showNovel, hideNovel] = useVisibility(), // 是否强制显示目录
        $go = React.useCallback(
            (model: Model.IBookshelf | Model.INovel | Model.IChapter, animate: boolean = false) => {
                setPrevious(target);
                setTarget(model);
                setAnimate(animate);
                hideBookshelf();
                hideNovel();
            },
            [target, hideBookshelf, hideNovel]
        );

    React.useEffect(() => {
        // 变更模型实例时同步 URL
        history.replaceState(null, null, target.url + ("index" in target ? location.hash : ""));

        // 同步窗口标题
        document.title =
            ("title" in target ? ("index" in target ? target.parent.title + " " : "") + target.title : "书架") +
            " | CCNR/3";
    }, [target]);

    let bookshelf: Model.IBookshelf, novel: Model.INovel, chapter: Model.IChapter;
    if ("index" in target) {
        chapter = target;
        novel = chapter.parent;
    } else if ("author" in target) novel = target;
    bookshelf = novel ? novel.parent : (target as Model.IBookshelf);

    // | previous         | target           | animate | Bookshelf vis. | Novel anim. | Novel vis. | Chapter anim. |
    // | Model.IBookshelf | Model.INovel     | true    | true           | true        | true       |               |
    // | Model.IBookshelf | Model.IChapter   | true    | true           | false       | false      | true          |
    // | Model.INovel     | Model.IBookshelf | false   | true           |             |            |               |
    // | Model.INovel     | Model.IChapter   | true    | false          | false       | true       | true          |
    // | Model.IChapter   | Model.IBookshelf | false   | true           |             |            |               |
    // | Model.IChapter   | Model.INovel     | false   | false          | false       | true       |               |
    return (
        <>
            <Bookshelf
                model={bookshelf}
                visible={previous == bookshelf || target == bookshelf || visBookshelf}
                onClick={$go}
            />
            {novel ? (
                <TOC
                    model={novel}
                    size={size}
                    animate={target == novel ? animate : false}
                    visible={(target == novel ? true : previous == novel) || visNovel}
                    fnShowBookshelf={showBookshelf}
                    onClick={$go}
                />
            ) : null}
            {chapter ? (
                <Chapter
                    model={chapter}
                    page={index}
                    size={size}
                    animate={animate}
                    fnShowBookshelf={showBookshelf}
                    fnShowNovel={showNovel}
                    onClick={$go}
                />
            ) : null}
        </>
    );
}
