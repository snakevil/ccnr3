import * as React from 'react';

import useNow from './now.hook';

export default function (props: { onPrev: () => void, onNext: () => void, title: string, index: number, length?: number, percent?: number}) {
    const hhmm = useNow();

    return (
        <div className="pad">
            <div>
                <div onClick={ props.onPrev } />
                <label>{ props.title }</label>
                <label>{ (0 < props.index ? '' + props.index : '?') + '/' + (props.length || '?') }</label>
                <label>{ (props.percent || '??.?') + '%' }</label>
                <label>{ hhmm }</label>
                <div onClick={ props.onNext } />
            </div>
        </div>
    );
}
