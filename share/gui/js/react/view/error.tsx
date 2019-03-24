import * as React from 'react';

export default function (props: { [prop: string]: any }) {
    return (
        <p>{ props.children }</p>
    )
}
