import * as React from 'react';

import * as Model from '../model';

import usePwa from './pwa.hook';
import { PWA } from './pwa';
import { Default } from './default';

/**
 * @param {Model.IBookshelf | Model.INovel | Model.IChapter} model 当前模型实例
 * @param {number} page 仅用于 PWA 模式章节页分片传参
 */
export function CCNR3 ({ model, page }: {
    model: Model.IBookshelf | Model.INovel | Model.IChapter,
    page: number
}) {
    const [
            target,
            setTarget
        ] = React.useState(model), // 状态化以内部更新
        pwa = usePwa(), // 确保 PWA 模式渲染交互匹配屏幕
        [
            animate,
            setAnimate
        ] = React.useState(false), // 记录动画预期
        $go = React.useCallback((model: Model.IBookshelf | Model.INovel | Model.IChapter, animate: boolean = false) => {
            // 更新模型实例
            setAnimate(animate);
            setTarget(model);
        }, []);

    React.useEffect(() => {
        // 变更模型实例时同步 URL
        history.replaceState(null, null, target.url);
        // 同步窗口标题
        document.title = (
                'title' in target
                    ? (
                        (
                            'index' in target
                                ? target.parent.title + ' '
                                : ''
                        ) + target.title
                    ) : '书架'
            ) + ' | CCNR/3';
    }, [ target ]);

    return pwa ? (
        <PWA model={ target } page={ page } size={ pwa } animate={ animate } onClick={ $go } />
    ) : (
        <Default model={ target } onClick={ $go } />
    );
};
