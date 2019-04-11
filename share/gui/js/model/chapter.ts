import { INovel } from "./inovel";
import { IChapter } from "./ichapter";

export class Chapter implements IChapter {
    public readonly parent: INovel;

    /**
     * 是否加载完成。
     *
     * 加载完成值为 `true`，否则为 `Promise`。
     */
    private _l: boolean | Promise<Chapter>;

    public get loaded(): boolean | Promise<Chapter> {
        return this._l;
    }

    public readonly title: string;

    public readonly index: number;

    /**
     * 段落内容。
     */
    private _c: string[];

    public get content(): string[] {
        return this._c;
    }

    /**
     * URL。
     */
    private _u: string;

    public get url(): string {
        const parts = this.parent.url.match(/^(.*?)(|[\?#].*)$/);
        this._u = parts[1] + this.index + parts[2];
        return this._u;
    }

    public constructor(novel: INovel, title: string, index: number, content: boolean | string[] = false) {
        this.parent = novel;
        this.title = title.replace(/&nbsp;/g, " ");
        this.index = index;
        if (content instanceof Array) {
            this._l = true;
            this._c = content.map(paragraph => paragraph.replace(/&nbsp;/g, " "));
        } else {
            // 默认不加载段落内容。
            this._l = content;
            if (content) this.load();
        }
    }

    public load(): Promise<Chapter> {
        if (this._c) return Promise.resolve(this);
        if (!(this._l instanceof Promise))
            this._l = fetch(this.url)
                .then(response => {
                    let reason = "";
                    switch (response.status) {
                        case 200:
                            break;
                        case 404:
                            reason = "书籍不存在。";
                            break;
                        case 501:
                            reason = "数据源已被移除。";
                            break;
                        case 504:
                            reason = "源数据解析失败。";
                            break;
                        default:
                            reason = "未知错误。";
                            break;
                    }
                    if (reason) throw reason;
                    return response.text();
                })
                .then((xml: string) => {
                    const doc = new DOMParser().parseFromString(xml, "text/xml"),
                        paragraphs = doc.evaluate(
                            "//Paragraph",
                            doc,
                            null,
                            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                            null
                        );
                    this._c = [];
                    for (let i = 0, j = paragraphs.snapshotLength; i < j; i++)
                        this._c.push(paragraphs.snapshotItem(i).textContent.replace(/&nbsp;/g, " "));
                    this._l = true;
                    return this;
                });
        return this._l;
    }

    public as(url: string): Chapter {
        const parts = url.match(/^(.*\/)\d+(|[\?#].*)$/);
        this.parent.as(parts[1] + parts[2]);
        return this;
    }

    public read(): Chapter {
        this.parent.last = this;
        return this;
    }

    public pages?: [number, string][][];
}
