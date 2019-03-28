import { INovel } from './inovel';
import { IChapter } from './ichapter';

/**
 * 书架规范。
 */
export interface IBookshelf {
    /**
     * 书籍列表。
     */
    readonly novels: INovel[];

    /**
     * URL。
     */
    readonly url: string;

    /**
     * 保存数据。
     */
    save (): IBookshelf;

    /**
     * 设置 URL。
     */
    as (url: string): IBookshelf;

    /**
     * 获取指定名称的书籍。
     *
     * 对于不在书架中的书籍也可以获取，但其内容需要在调用服务端接口后才能访问。
     */
    get (title: string): INovel;

    /**
     * 设置书籍。
     *
     * 用于在书籍目录页直接导入页面内嵌数据。
     */
    set (title: string, author: string, chapters: string[]): INovel;

    /**
     * 构建章节。
     *
     * 用于在书籍章节页直接导入页面内嵌数据。
     */
    build (url: string, title: string, paragraphs: string[]): IChapter;
}
