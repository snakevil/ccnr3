import * as React from 'react';

import Mobile from './mobile';
import Desktop from './desktop';

export default function (props: { [prop: string]: any }) {
    // const chapter = props.data.read();
    const [
        mobile,
        setMobile
    ] = React.useState(window.innerWidth < 1025 && window.innerWidth < window.innerHeight);
    React.useEffect(() => {
        const fn = () => setMobile(window.innerWidth < 1025 && window.innerWidth < window.innerHeight);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    });

    document.body.className = 'page-chapter';

    if (mobile) return (
        <Mobile data={ props.data } />
    );
    return (
        <Desktop data={ props.data } />
    );
}
