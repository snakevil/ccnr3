import * as React from 'react';

/**
 * @param {(event: React.MouseEvent) => void} onTOC 切换至目录组件实例方法
 */
export function Menu ({ onTOC }: {
    onTOC: (event: React.MouseEvent) => void
}) {
    return (
        <div className="menu">
            <a href="./" onClick={ onTOC }>返回目录</a>
        </div>
    );
}
