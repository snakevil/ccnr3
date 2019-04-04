import { IBookshelf } from "./ibookshelf";
import { IChapter } from "./ichapter";

/**
 * 书籍规范。
 */
export interface INovel {
    /**
     * 所属书架。
     */
    readonly parent: IBookshelf;

    /**
     * 是否加载完成。
     *
     * 加载完成值为 `true`，否则为 `Promise`。
     */
    readonly loaded: boolean | Promise<INovel>;

    /**
     * 名称。
     */
    readonly title: string;

    /**
     * 作者。
     */
    readonly author: string;

    /**
     * 章节列表。
     */
    readonly chapters: (string | IChapter)[];

    /**
     * 章节数量。
     */
    readonly length: number;

    /**
     * URL。
     */
    readonly url: string;

    /**
     * 最后阅读时间。
     */
    readonly time: number;

    /**
     * 调用远端接口以更新内容。
     */
    load(): Promise<INovel>;

    /**
     * 设置 URL。
     */
    as(url: string): INovel;

    /**
     * 获取指定序号的章节。
     *
     * 对于未载入的章节，其内容需要在调用服务端接口后才能访问。
     */
    get(index: number, load?: boolean): IChapter;

    /**
     * 设置章节。
     *
     * 用于在书籍章节页直接导入页面内嵌数据。
     */
    set(index: number, title: string, paragraphs: string[]): IChapter;

    /**
     * 读过的最后一个章节。
     */
    last: IChapter;

    /**
     * 导入追更信息。
     *
     * 字段依次为：
     *
     * - `\r` 字符拼接列表
     *     * 作者
     *     * 最新章节标题
     *     * 读过的最后一个章节标题
     * - 章节数量
     * - 读过的最后一个章节序号
     * - 最后阅读时间
     */
    import(meta: [string, number, number, number]): INovel;

    /**
     * 导出追更信息。
     *
     * 字段依次为：
     *
     * - 标题
     * - `\r` 字符拼接列表
     *     * 作者
     *     * 最新章节标题
     *     * 读过的最后一个章节标题
     * - 章节数量
     * - 读过的最后一个章节序号
     * - 最后阅读时间
     */
    export(): [string, string, number, number, number];
}
