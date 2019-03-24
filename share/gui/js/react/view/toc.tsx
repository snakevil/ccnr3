import * as React from 'react';

export default function (props: { [prop: string]: any }) {
    return (
        <div>
            <p>TODO: TOC</p>
            <dl>
                <dt>Novel:</dt>
                <dd>{ props.novel }</dd>
            </dl>
        </div>
    )
}
