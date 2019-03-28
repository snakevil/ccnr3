import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CCNR3 from './react';

const element = document.getElementById('data'),
    data: { [key: string]: any } = {
        children: []
    };
if (element) {
    document.body.removeChild(element);
    for (let i in element.dataset)
        data[i] = element.dataset[i];
    for (let i = 0; i < element.children.length; i++)
        data.children.push(element.children[i].textContent);
}

ReactDOM.render(
    <CCNR3 data={ data } />,
    document.body.firstElementChild
);
