// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";

import * as Model from "../../../model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Book } from "./book";

/**
 * @param {Model.IBookshelf} model 书架实例
 * @param {boolean} visible 是否可见
 * @param {(model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void} onClick 切换模型实例方法
 */
export function Bookshelf({
    model,
    visible,
    onClick,
}: {
    model: Model.IBookshelf;
    visible: boolean;
    onClick: (model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void;
}) {
    return (
        <div className={"bookshelf" + (visible ? "" : " hidden")}>
            <h1>书架</h1>
            <ol>
                {model.novels.map((novel, index) => (
                    <Book key={"book_" + index} model={novel} onClick={onClick} />
                ))}
            </ol>
        </div>
    );
}
