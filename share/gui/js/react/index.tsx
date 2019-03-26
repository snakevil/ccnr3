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
        ] = React.useState(raw ? (raw.index ? raw : bookshelf.import(raw).as(url)) : bookshelf.as(url)),
        $go = React.useCallback((url, data) => {
            history.replaceState(null, null, url);
            setTarget(data);
        }, []);

    try {
        if ('author' in target) return (
            <view.TOC data={ target } $go={ $go } />
        );
        if ('prefix' in target) return (
            <view.Bookshelf data={ target } $go={ $go } />
        );
        return (
            <view.Chapter data={ target } $go={ $go } />
        );
    } catch (error) {
        return (
            <view.Error>{ error }</view.Error>
        );
    }
}
