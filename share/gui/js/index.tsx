import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CCNR3 from './react';

const el = document.getElementById('data'),
    data: { [key: string]: any } = {
        children: []
    };
if (el) {
    document.body.removeChild(el);
    for (let i in el.dataset)
        data[i] = el.dataset[i];
    for (let i = 0; i < el.children.length; i++)
        data.children.push(el.children[i].textContent);
}

ReactDOM.render(
    <CCNR3 prefix='/n/' data={ data.title ? data : null } />,
    document.body.firstElementChild
);
