import * as React from 'react';

import useHHMM from './hhmm.hook';

export default function ({ title, index, length, percent }: {
    title: string,
    index: number,
    length: number,
    percent: number
}) {
    const now = useHHMM();

    return (
        <div className="hud">
            <label className="title">{ title }</label>
            <label className="percent">{ percent + '%' }</label>
            <label className="pages">{ index + '/' + length }</label>
            <label className="time">{ now }</label>
        </div>
    );
}
