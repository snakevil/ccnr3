import * as React from 'react';

export default function () {
    const [
            value,
            setValue
        ] = React.useState(new Date()),
        hhmm = React.useMemo(() => {
            let min = '' + value.getMinutes();
            if (2 > min.length)
                min = '0' + min;
            return value.getHours() + ':' + min;
        }, [ value ]);

    React.useEffect(() => {
        let to = setInterval(() => setValue(new Date()), 1000);
        return () => clearInterval(to);
    }, []);

    return hhmm;
}
