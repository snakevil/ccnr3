import * as React from 'react';

const size = () => {
    if ('?pwa' == location.search || /\b(Android|iP(hone|ad|od))\b/.test(navigator.userAgent)) {
        const size: [number, number] = [
            window.innerWidth,
            window.innerHeight
        ];
        if (size[0] < 1025 && size[0] < size[1])
            return size;
    }
};

export default function () {
    const [
            value,
            setValue
        ] = React.useState(size),
        update = () => setValue(size());

    React.useEffect(() => {
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return value;
}
