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
    private _c: string[];

    get chapters (): string [] {
        return this._c;
    }

    set chapters (list: string[]) {
        this._c = list;
        const length = list.length;
        this._l = Chapter.mock(this, this._c[length - 1], length);
    }

    /**
     * 最新章节。
     */
    private _l: Chapter;

    /**
     * 获取最新章节。
     */
    get last (): Chapter {
        return this._l;
    }

    /**
     * 获取章节数量。
     */
    get length (): number {
        return this.chapters.length || (this._l ? this._l.index : 0);
    }

    /**
     * 最后阅读章节。
     */
    private _r: Chapter;

    /**
     * 获取最后阅读章节。
     */
    get read (): Chapter {
        return this._r;
    }

    /**
     * 设置最后阅读章节。
     */
    set read (chapter: Chapter) {
        if ((this._r && this._r.index || 0) < chapter.index)
            this._r = chapter;
        this._t = + new Date();
        this.bookshelf.save();
    }

    /**
     * 最后阅读时间。
     */
    private _t: number;

    /**
     * 获取最后阅读时间。
     */
    get time (): number {
        return this._t;
    }

    constructor (bookshelf: Bookshelf, title: string, author: string) {
        this.bookshelf = bookshelf;
        this.title = title;
        this.author = author;
        this._c = [];
        this._t = 0;
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
    expr (): [string, string, number, string, number, string, number] {
        return [
            this.title,
            this.author,
            this.length,
            this._l ? this._l.title : '',
            this._r ? this._r.index : 0,
            this._r ? this._r.title : '',
            this._t
        ];
    }

    /**
     * 用于重建书架时填充数据。
     */
    static mock (bookshelf: Bookshelf, stats: [string, string, number, string, number, string, number]): Novel {
        const novel = new Novel(bookshelf, stats[0], stats[1]);
        if (stats[2])
            novel._l = Chapter.mock(novel, stats[3], stats[2]);
        if (stats[4])
            novel._r = Chapter.mock(novel, stats[5], stats[4]);
        novel._t = stats[6];
        return novel;
    }

    update (): Promise<Novel> {
        if (this._c.length) return Promise.resolve(this);
        return Novel.load(this.bookshelf.prefix + this.title).then((data) => {
            this.chapters = data.children;
            return this;
        });
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
