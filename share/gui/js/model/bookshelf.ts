import Novel from './novel';

const KEY = '         ';
let instance: Bookshelf;

export default class Bookshelf {
    /**
     * 根路径。
     */
    private _as: string;

    /**
     * 获取根路径。
     */
    get prefix (): string {
        return this._as;
    }

    /**
     * 追更书籍表。
     */
    private _db: { [title: string]: Novel };

    /**
     * 获取书籍列表。
     */
    get novels (): Novel[] {
        const db = [];
        for (let i in this._db)
            db.push(this._db[i]);
        db.sort((a, b) => - a.time + b.time);
        return db;
    }

    constructor () {
        this._as = '';
        this._db = {};
        try {
            const db = JSON.parse(localStorage.getItem(KEY));
            if (db instanceof Array)
                db.forEach((item) => {
                    const novel = Novel.mock(this, item);
                    this._db[novel.title] = novel;
                });
        } catch (e) {}
    }

    /**
     * 设置根路径。
     */
    as (url: string): Bookshelf {
        if (!this._as)
            this._as = url;
        return this;
    }

    /**
     * 保存。
     */
    save (): Bookshelf {
        const db = [];
        for (let i in this._db)
            db.push(this._db[i].expr());
        localStorage.setItem(KEY, JSON.stringify(db));
        return this;
    }

    /**
     * 拉取书籍。
     */
    fetch (title: string): Promise<Novel> {
        const novel = this._db[title];
        if (novel && novel.chapters.length) return Promise.resolve(novel);
        return Novel.load(this._as + title).then(data => this.import(data));
    }

    /**
     * 导入书籍。
     */
    import (data: { title: string, author: string, children: string[] }): Novel {
        const exists = this._db[data.title],
            novel = exists || new Novel(this, data.title, data.author);
        novel.chapters = data.children;
        if (!exists) {
            this._db[data.title] = novel;
            this.save();
        }
        return novel;
    }

    /**
     * 获取唯一实例。
     */
    static load (): Bookshelf {
        if (!instance)
            instance = new Bookshelf();
        return instance;
    }
}
