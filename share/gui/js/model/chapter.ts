export default class Chapter {
    /**
     * 章节标题。
     */
    readonly title: string;

    /**
     * 源 URI。
     */
    readonly ref: string;

    /**
     * 段落列表。
     */
    readonly paragraphs: string[];

    constructor (data: { title: string, ref: string, children: string[] });
    constructor (title: string, ref: string, paragraphs: string[]);
    constructor (title: any, ref?: string, paragraphs?: string[]) {
        if ('object' == typeof title) {
            ref = title.ref;
            paragraphs = title.children;
            title = title.title;
        }
        this.title = title;
        this.ref = ref;
        this.paragraphs = paragraphs.slice(0);
    }

    /**
     * 加载。
     */
    static from (url: string): Promise<Chapter> {
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
            return new Chapter(
                doc.evaluate('//Title', doc, null, XPathResult.STRING_TYPE, null).stringValue,
                doc.evaluate('/Chapter/@ref', doc, null, XPathResult.STRING_TYPE, null).stringValue,
                children
            );
        });
    }
}
