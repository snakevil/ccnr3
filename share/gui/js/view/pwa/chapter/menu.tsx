import * as React from "react";

export function Menu({ onClose, onBack, onTOC }: { onClose: () => void; onBack: () => void; onTOC: () => void }) {
    const $close = React.useCallback(
            (event: React.MouseEvent) => {
                if ("menu" != (event.target as HTMLElement).className) return;
                event.preventDefault();
                onClose();
            },
            [onClose]
        ),
        $bookshelf = React.useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                onBack();
            },
            [onBack]
        ),
        $toc = React.useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                onTOC();
            },
            [onTOC]
        );

    return (
        <div className="menu" onClick={$close}>
            <div className="header">
                <a href="../" onClick={$bookshelf}>
                    <i className="back icon" />
                </a>
            </div>
            <div className="footer">
                <a href="./" onClick={$toc}>
                    <i className="list icon" />
                </a>
            </div>
        </div>
    );
}
