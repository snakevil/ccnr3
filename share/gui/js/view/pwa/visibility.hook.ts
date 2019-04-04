import * as React from "react";

export default function(visibility: boolean = false): [boolean, () => void, () => void] {
    const [value, setValue] = React.useState(visibility),
        show = React.useCallback(() => setValue(true), []),
        hide = React.useCallback(() => setValue(false), []);

    return [value, show, hide];
}
