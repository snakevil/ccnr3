import * as React from "react";

import * as Model from "../../../model";

/**
 * @param {Model.INovel} model 书籍实例
 * @param {(model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void} onClick 切换模型实例方法
 */
export function Book({
    model,
    onClick,
}: {
    model: Model.INovel;
    onClick: (model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void;
}) {
    const _unread = React.useCallback(() => {
            // 计算未读章节数量
            return model.length - (model.last ? model.last.index : 0);
        }, [model]),
        [unread, setUnread] = React.useState(_unread), // 记录未读章节数量
        $chapter = React.useCallback(
            (event: React.MouseEvent) => {
                // 阅读章节
                if ("A" == (event.target as HTMLElement).tagName) return;
                onClick(model.get(model.last ? model.last.index : 1), true);
            },
            [model, onClick]
        ),
        $toc = React.useCallback(
            (event: React.MouseEvent) => {
                // 查看目录
                event.preventDefault();
                onClick(model, true);
            },
            [model, onClick]
        );

    React.useEffect(() => {
        // 更新书籍章节目录
        if (true === model.loaded) return;
        model.load().then(() => setUnread(_unread()));
    }, [model, _unread]);

    return (
        <li onClick={$chapter}>
            <h2>{model.title}</h2>
            <address>{model.author}</address>
            <dl>
                <dt>未读章数</dt>
                <dd className={unread ? "unread" : "none"}>{unread}</dd>
                <dt>最新章节</dt>
                <dd>
                    <a href={model.title + "/"} onClick={$toc}>
                        {model.get(model.length, false).title}
                    </a>
                </dd>
            </dl>
        </li>
    );
}
