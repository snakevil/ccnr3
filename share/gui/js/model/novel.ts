import { IBookshelf } from './ibookshelf';
import { INovel } from './inovel';
import { Chapter } from './chapter';

export class Novel implements INovel {
    readonly parent: IBookshelf;

    /**
     * 是否加载完成。
     *
     * 加载完成值为 `true`，否则为 `Promise`。
     */
    private _l: boolean | Promise<Novel>;

    get loaded (): boolean | Promise<Novel> {
        return this._l;
    }

    readonly title: string;

    /**
     * 作者。
     */
    private _a: string;

    get author (): string {
        return this._a;
    }

    /**
     * 章节列表。
     */
    private _c: Array<string | Chapter>;

    get chapters (): Array<string | Chapter> {
        return this._c;
    }

    get length (): number {
        return this._c
            ? this._c.length
            : 0;
    }

    /**
     * URL。
     */
    private _u: string;

    get url (): string {
        const parts = this.parent.url.match(/^(.*?)(|[\?#].*)$/);
        this._u = parts[1] + this.title + '/' + parts[2];
        return this._u;
    }

    /**
     * 最后阅读时间。
     */
    private _t: number;

    get time (): number {
        return this._t;
    }

    constructor (bookshelf: IBookshelf, title: string, chapters: boolean | string[] = false) {
        this.parent = bookshelf;
        this.title = title;
        this._a = '';
        if (chapters instanceof Array) {
            this._l = true;
            this._c = chapters;
        } else {
            this._l = chapters;
            this._c = [];
            if (chapters)
                this.load();
        }
        this._t = 0;
    }

    load (): Promise<Novel> {
        if (true === this._l)
            return Promise.resolve(this);
        if (!(this._l instanceof Promise))
            this._l = fetch(this.url).then((response) => {
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
                    throw reason;
                return response.text();
            }).then((xml: string) => {
                const doc = new DOMParser().parseFromString(xml, 'text/xml'),
                    chapters = doc.evaluate('//Chapter', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                for (let i = 0, j = chapters.snapshotLength; i < j; i++)
                    if (!this._c[i])
                        this._c[i] = chapters.snapshotItem(i).textContent;
                this._a = doc.evaluate('//Author', doc, null, XPathResult.STRING_TYPE, null).stringValue;
                this._l = true;
                return this;
            });
        return this._l;
    }

    as (url: string): Novel {
        const parts = url.match(/^(.*\/)[^\/]+\/(|[\?#].*)$/);
        this.parent.as(parts[1] + parts[2]);
        return this;
    }

    get (index: number, load: boolean = true): Chapter {
        const chapter = this._c[index - 1];
        if (chapter instanceof Chapter)
            return chapter;
        return this._c[index - 1] = new Chapter(this, chapter as string, index, load);
    }

    set (index: number, title: string, paragraphs: string[]): Chapter {
        const chapter = new Chapter(this, title, index, paragraphs);
        this._c[index - 1] = chapter;
        return chapter;
    }

    /**
     * 读过的最后一个章节。
     */
    private _r: Chapter;

    get last (): Chapter {
        return this._r;
    }

    set last (chapter: Chapter) {
        const last = this._r;
        if (!last || last.index < chapter.index)
            this._r = chapter;
        this._t = Math.floor(+ new Date() / 1000);
        this.parent.save();
    }

    import (meta: [string, number, number, number]): Novel {
        const subs = meta[0].split('\r');
        this._a = subs[0];
        this._c[meta[1] - 1] = new Chapter(this, subs[1], meta[1]);
        if (meta[2])
            this._r = new Chapter(this, subs[2], meta[2]);
        this._t = meta[3];
        return this;
    }

    export (): [string, string, number, number, number] {
        const stats: [string, string, number, number, number] = [
                this.title,
                '',
                0,
                0,
                this._t
            ],
            subs: [string, string, string] = [
                this._a,
                '',
                ''
            ];
        if (this._c) {
            stats[2] = this._c.length;
            const last = this._c[stats[2] - 1];
            subs[1] = last instanceof Chapter
                ? last.title
                : last as string;
        }
        if (this._r) {
            stats[3] = this._r.index;
            subs[2] = this._r.title;
        }
        stats[1] = subs.join('\r');
        return stats;
    }
}
