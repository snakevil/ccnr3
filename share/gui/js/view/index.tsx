// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";

import * as Model from "../model";

import usePwa from "./pwa.hook";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PWA } from "./pwa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Default } from "./default";

/**
 * @param {Model.IBookshelf | Model.INovel | Model.IChapter} model 当前模型实例
 * @param {number} page 仅用于 PWA 模式章节页分片传参
 */
export function CCNR3({ model, page }: { model: Model.IBookshelf | Model.INovel | Model.IChapter; page: number }) {
    const pwa = usePwa(); // 确保 PWA 模式渲染交互匹配屏幕

    return pwa ? <PWA model={model} page={page} size={pwa} /> : <Default model={model} />;
}
