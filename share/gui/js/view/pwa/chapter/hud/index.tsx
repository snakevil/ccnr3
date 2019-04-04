// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";

import useHHMM from "./hhmm.hook";

export function HUD({
    size,
    title,
    index,
    length,
    percent,
    onMenu,
    onPrevious,
    onNext,
}: {
    size: [number, number];
    title: string;
    index: number;
    length: number;
    percent: number;
    onMenu: () => void;
    onPrevious: () => void;
    onNext: () => void;
}) {
    const now = useHHMM(),
        $menu = React.useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                const s = size[0] / 3,
                    x = event.clientX;
                if (x < s) onPrevious();
                else if (x < 2 * s) onMenu();
                else onNext();
            },
            [size, onMenu, onPrevious, onNext]
        );

    return (
        <div className="hud" onClick={$menu}>
            <label className="title">{title}</label>
            <label className="percent">{percent + "%"}</label>
            <label className="pages">{index + "/" + length}</label>
            <label className="time">{now}</label>
        </div>
    );
}
