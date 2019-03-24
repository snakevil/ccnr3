import Bookshelf from './bookshelf';
import Chapter from './chapter';

export default class Novel {
    /**
     * 书架。
     */
    readonly bookshelf: Bookshelf;

    /**
     * 书名。
     */
    readonly title: string;

    /**
     * 作者。
     */
    readonly author: string;

    /**
     * 章节标题列表。
     */
    chapters: string[];

    /**
     * 记录的章节数量摘要。
     */
    private _s: number;

    /**
     * 获取章节数量。
     */
    get size (): number {
        return this.chapters.length || this._s;
    }

    /**
     * 最后抓取时间。
     */
    private _t: number;

    /**
     * 最后阅读章节。
     */
    private _c: Chapter;

    /**
     * 设置最后阅读章节。
     */
    set last (chapter: Chapter) {
        if ((this._c && this._c.index || 0) < chapter.index)
            this._c = chapter;
        this._r = + new Date();
        this.bookshelf.save();
    }

    /**
     * 最后阅读时间。
     */
    private _r: number;

    /**
     * 获取最后阅读时间。
     */
    get readTime (): number {
        return this._r;
    }

    constructor (bookshelf: Bookshelf, title: string, author: string) {
        this.bookshelf = bookshelf;
        this.title = title;
        this.author = author;
        this.chapters = [];
        this._s = 0;
        this._t = + new Date();
        this._r = 0;
    }

    /**
     * 指明对应 URL。
     */
    as (url: string): Novel {
        this.bookshelf.as(url.substr(0, url.length - this.title.length - 1));
        return this;
    }

    /**
     * 用于保存书架时书籍状态。
     */
    expr (): [string, string, number, string, number, number] {
        return [
            this.title,
            this.author,
            this.size,
            this._c ? this._c.title : '',
            this._c ? this._c.index : 0,
            this._r
        ];
    }

    /**
     * 用于重建书架时填充数据。
     */
    static mock (bookshelf: Bookshelf, stats: [string, string, number, string, number, number]): Novel {
        const novel = new Novel(bookshelf, stats[0], stats[1]);
        novel._s = stats[2];
        if (stats[4])
            novel._c = Chapter.mock(novel, stats[3], stats[4]);
        novel._r = stats[5];
        return novel;
    }

    /**
     * 从服务端抓取指定章节。
     */
    fetch (index: number): Promise<Chapter> {
        return Chapter.load(this.bookshelf.prefix + this.title + '/' + index).then(data => this.import(data));
    }

    /**
     * 导入章节。
     */
    import (data: {title: string, index: number, children: string[]}): Chapter {
        return new Chapter(this, data.title, data.index, data.children);
    }

    /**
     * 读取并解析服务端数据。
     */
    static load (url: string): Promise<{ title: string, author: string, children: string[] }> {
        return fetch(url).then((response) => {
            let reason = '';
            switch (response.status) {
                case 200:
                    break;
                case 404:
                    reason = '书籍不存在。';
                    break;
                case 501:
                    reason = '数据源已被移除。';
                    break;
                case 504:
                    reason = '源数据解析失败。';
                    break;
                default:
                    reason = '未知错误。';
                    break;
            }
            if (reason)
                throw new Error(reason);
            return response.text();
        }).then((xml: string) => {
            const doc = new DOMParser().parseFromString(xml, 'text/xml'),
                children = [],
                chapters = doc.evaluate('//Chapter', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0, j = chapters.snapshotLength; i < j; i++)
                children.push(chapters.snapshotItem(i).textContent);
            return {
                title: doc.evaluate('//Title', doc, null, XPathResult.STRING_TYPE, null).stringValue,
                author: doc.evaluate('//Author', doc, null, XPathResult.STRING_TYPE, null).stringValue,
                children
            };
        });
    }
}
