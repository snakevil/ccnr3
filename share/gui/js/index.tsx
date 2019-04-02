import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as Model from './model';
import CCNR3 from './view';

document.addEventListener('readystatechange', () => {
    if ('complete' != document.readyState)
        return;

    const url = location.href.replace(/#.*$/, ''),
        element = document.getElementsByClassName('embed')[0] as HTMLElement,
        data: string[] = [],
        bookshelf = Model.Bookshelf.load();
    let model: Model.IBookshelf | Model.INovel | Model.IChapter;
    if (element) {
        document.body.removeChild(element);
        for (let i = 0; i < element.children.length; i++)
            data.push(element.children[i].textContent);
        if (/\btoc\b/.test(element.className)) {
            model = bookshelf.set(element.dataset.title, element.dataset.author, data).as(url);
        } else
            model = bookshelf.build(url, element.dataset.title, data);
    } else
        model = bookshelf.as(url);

    ReactDOM.render((
            <CCNR3 model={ model } page={ + location.hash.substr(1) || 0 } />
        ),
        document.body.firstElementChild
    );
});
