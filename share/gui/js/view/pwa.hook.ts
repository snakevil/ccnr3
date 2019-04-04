import * as React from "react";

const size = () => {
    let pwa = false,
        size: [number, number];
    if ("?pwa" == location.search || /\b(Android|iP(hone|ad|od))\b/.test(navigator.userAgent)) {
        size = [window.innerWidth, window.innerHeight];
        pwa = size[0] < 1025 && size[0] < size[1];
    }
    document.documentElement.className = pwa ? "pwa" : "";
    return size;
};

export default function() {
    const [value, setValue] = React.useState(size);

    React.useEffect(() => {
        const update = () => setValue(size());
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return value;
}
