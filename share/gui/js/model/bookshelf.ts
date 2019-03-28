import { IBookshelf } from './ibookshelf';
import { Novel } from './novel';
import { Chapter } from './chapter';

export class Bookshelf implements IBookshelf {
    /**
     * 书籍列表。
     */
    private _d: Novel[];

    get novels (): Novel[] {
        return this._d.sort((a, b) => b.time - a.time);
    }

    /**
     * URL。
     */
    private _u: string;

    get url (): string {
        return this._u;
    }

    /**
     * localStorage 键名称。
     */
    private _k: string;

    constructor (key: string) {
        this._u = '';
        this._k = key;
        try {
            const db = JSON.parse(localStorage.getItem(key));
            this._d = db instanceof Array
                ? db.map((item) => new Novel(this, item.shift()).import(item))
                : [];
        } catch (e) {
            this._d = [];
        }
    }

    save (): Bookshelf {
        localStorage.setItem(this._k, JSON.stringify(this._d.map((novel) => novel.export())));
        return this;
    }

    /**
     * 单例。
     */
    static $: Bookshelf;

    /**
     * 获取书架单例。
     */
    static load (): Bookshelf {
        if (!Bookshelf.$)
            Bookshelf.$ = new Bookshelf('       ');
        return Bookshelf.$;
    }

    as (url: string): Bookshelf {
        this._u = url;
        return this;
    }

    get (title: string): Novel {
        let novel = this._d.find((novel) => novel.title == title);
        if (!novel) {
            novel = new Novel(this, title, true);
            this._d.push(novel);
        } else
            novel.load();
        return novel;
    };

    set (title: string, author: string, chapters: string[]): Novel {
        const novel = new Novel(this, title, chapters),
            old = this._d.findIndex((novel) => novel.title == title);
        if (-1 < old) {
            novel.import(this._d[old].export().slice(1) as [string, number, number, number]);
            this._d[old] = novel;
        } else
            this._d.push(novel);
        return novel;
    }

    build (url: string, title: string, paragraphs: string[]): Chapter {
        const matched = url.match(/^(.*\/)([^\/]+)\/(\d+)$/);
        this._u = matched[1];
        return this.get(decodeURI(matched[2])).set(+ matched[3], title, paragraphs);
    }
}
