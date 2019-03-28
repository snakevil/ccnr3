import * as React from 'react';

import * as Model from '../../model';

import useDimesions from './dimesions.hook';
import Mobile from './mobile';
// import Desktop from './desktop';

export default function (props: { model: Model.IChapter, page: number, onClick: (model: Model.Bookshelf | Model.INovel | Model.IChapter, page?: number) => void }) {
    const chapter = props.model,
        dimesions = useDimesions();
    React.useEffect(() => {
        chapter.read();
        document.body.className = 'page-chapter';
    }, [ chapter ]);

    return dimesions
        ? <Mobile model={ chapter } page={ props.page } dimesions={ dimesions } onClick={ props.onClick } />
        : null;
}
