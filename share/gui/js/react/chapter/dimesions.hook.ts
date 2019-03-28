import * as React from 'react';

const dimesions = () => {
    const size: [number, number] = [
        window.innerWidth,
        window.innerHeight
    ];
    if (size[0] < 1025 && size[0] < size[1])
        return size;
};

export default function () {
    const [
            value,
            setValue
        ] = React.useState(dimesions),
        fn = () => setValue(dimesions());

    React.useEffect(() => {
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    return value;
}
