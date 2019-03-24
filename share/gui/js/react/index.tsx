import * as React from 'react';

import { Bookshelf } from '../model';
import * as view from './view';


export default function (props: { [prop: string]: any }) {
    const bookshelf = Bookshelf.load(),
        url = decodeURI(location.href),
        raw = props.data,
        [
            target,
            setTarget
        ] = React.useState(raw ? (raw.index ? null : bookshelf.import(raw).as(url)) : bookshelf);

    try {
        if (!target) {
            const matched = url.match(/^(.*\/)([^\/]+)\/(\d+)$/);
            if (!matched) throw '无法找到正确的功能路径。';
            raw.index = + matched[3];
            bookshelf.as(matched[1]).fetch(matched[2]).then(novel => setTarget(novel.import(raw) as any));
            return <address>Loading...</address>;
        }
        if ('author' in target) return <view.TOC data={ target } />;
        if ('prefix' in target) return <view.Bookshelf data={ target } />;
        if ('index' in target) return <view.Chapter data={ target } />;
        throw target;
    } catch (error) {
        return (
            <view.Error>{ error }</view.Error>
        );
    }
}
