import * as React from 'react';

import * as model from '../model';
import * as view from './view';

export default function (props: { [prop: string]: any }) {
    const prefix = props.prefix || '',
        uri = decodeURI(location.pathname),
        [
            state,
            updateState
        ] = React.useState({
            url: location.href,
            data: props.data
        }),
        data = state.data,
        $go = (url: string, data: { title: string, [key: string]: any }) => {
            history.replaceState(data, data.title, url);
            updateState({ url, data });
        };

    try {
        if (-1 < uri.indexOf(prefix)) {
            const meta = uri.substr(prefix.length).match(/^([^\/]+)\/(.*)$/);
            if (meta) {
                if (!state.data)
                    throw "页面关键数据缺失。";
                if (meta[2]) return (
                    <view.Chapter
                        $go={ $go }
                        id={ meta[1] }
                        index={ meta[2] }
                        data={ data.children ? new model.Chapter(data) : data }
                        />
                );
                return (
                    <view.TOC
                        $go={ $go }
                        id={ meta[1] }
                        data={ data.children ? new model.TOC(data) : data }
                        />
                );
            } else if (uri == prefix) return (
                <view.Bookshelf $go={ $go } />
            );
        }
        throw "无法找到正确的功能路径。";
    } catch (error) {
        return (
            <view.Error>{ error }</view.Error>
        );
    }
}
