import Novel from './novel';

export default class Chapter {
    /**
     * 隶属书籍。
     */
    readonly novel: Novel;

    /**
     * 章节标题。
     */
    readonly title: string;

    /**
     * 序号。
     */
    readonly index: number;

    /**
     * 段落列表。
     */
    readonly paragraphs: string[];

    constructor (novel: Novel, title: string, index: number, paragraphs: string[]) {
        this.novel = novel;
        this.title = title;
        this.index = index;
        this.paragraphs = paragraphs.slice(0);
    }

    /**
     * 标记阅读。
     */
    read (): Chapter {
        this.novel.read = this;
        return this;
    }

    /**
     * 用于重建书架时填充数据。
     */
    static mock (novel: Novel, title: string, index: number): Chapter {
        return new Chapter(novel, title, index, []);
    }

    /**
     * 读取并解析服务端数据。
     */
    static load (url: string): Promise<{ title: string, index: number, children: string[] }> {
        return fetch(url).then((response) => {
            let reason = '';
            switch (response.status) {
                case 200:
                    break;
                case 404:
                    reason = '章节不存在。';
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
                paragraphs = doc.evaluate('//Paragraph', doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0, j = paragraphs.snapshotLength; i < j; i++)
                children.push(paragraphs.snapshotItem(i).textContent);
            return {
                title: doc.evaluate('//Title', doc, null, XPathResult.STRING_TYPE, null).stringValue,
                index: + url.replace(/^.*\/([\d+])$/, '$1'),
                children
            };
        });
    }
}
