import { INovel } from "./inovel";

/**
 * 章节规范。
 */
export interface IChapter {
    /**
     * 所属书籍。
     */
    readonly parent: INovel;

    /**
     * 是否加载完成。
     *
     * 加载完成值为 `true`，否则为 `Promise`。
     */
    readonly loaded: boolean | Promise<IChapter>;

    /**
     * 名称。
     */
    readonly title: string;

    /**
     * 序号。
     */
    readonly index: number;

    /**
     * 段落列表。
     */
    readonly content: string[];

    /**
     * URL。
     */
    readonly url: string;

    /**
     * 调用远端接口以更新内容。
     */
    load(): Promise<IChapter>;

    /**
     * 设置 URL。
     */
    as(url: string): IChapter;

    /**
     * 标记已读。
     */
    read(): IChapter;

    /**
     * 分页列表。
     */
    pages?: [number, string][][];
}
