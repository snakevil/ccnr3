import * as React from 'react';

export default function (props: { [prop: string]: any }) {
    return (
        <div>
            <p>TODO: Chapter</p>
            <dl>
                <dt>Novel:</dt>
                <dd>{ props.novel }</dd>
                <dt>Index:</dt>
                <dd>{ props.index }</dd>
            </dl>
        </div>
    )
}
