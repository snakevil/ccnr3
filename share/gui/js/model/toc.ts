export default class TOC {
    /**
     * 标题。
     */
    readonly title: string;

    /**
     * 作者名称。
     */
    readonly author: string;

    /**
     * 章节标题列表。
     */
    readonly chapters: string[];

    constructor (data: { title: string, author: string, children: string[] });
    constructor (title: string, author: string, chapters: string[]);
    constructor (title: any, author?: string, chapters?: string[]) {
        if ('object' == typeof title) {
            author = title.author;
            chapters = title.children;
            title = title.title;
        }
        this.title = title;
        this.author = author;
        this.chapters = chapters.slice(0);
    }

    /**
     * 加载。
     */
    static from (url: string): Promise<TOC> {
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
            return new TOC(
                doc.evaluate('//Title', doc, null, XPathResult.STRING_TYPE, null).stringValue,
                doc.evaluate('//Author', doc, null, XPathResult.STRING_TYPE, null).stringValue,
                children
            );
        });
    }
}
