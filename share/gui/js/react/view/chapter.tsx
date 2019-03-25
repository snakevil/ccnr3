import * as React from 'react';

export default function (props: { [prop: string]: any }) {
    const chapter = props.data.read();

    document.body.className = 'page-chapter';

    return (
        <>
            <h2>{ chapter.title }</h2>
            { chapter.paragraphs.map((text: string, index: number) => (
                <p key={ index }>{ text }</p>
            )) }
        </>
    )
}
