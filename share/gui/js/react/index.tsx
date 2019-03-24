import * as React from 'react';

import * as view from './view';

export default function (props: { [prop: string]: any }) {
    const {
            prefix
        } = props,
        [
            uri,
            setUri
        ] = React.useState(location.pathname);

    if (0 > uri.indexOf(prefix)) return (
        <view.Error>路由派发失败！</view.Error>
    );

    const path = uri.substr(prefix.length),
        parts = path.split('/');
    if (!path) return (
        <view.Bookshelf />
    );
    if ('/' == path.substr(-1)) return (
        <view.TOC novel={ parts[0] } />
    );
    return (
        <view.Chapter novel={ parts[0] } index={ parts[1] } />
    );
}
