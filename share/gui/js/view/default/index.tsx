import * as React from 'react';

import * as Model from '../../model';

export default function ({ model, onClick }: {
    model: Model.IBookshelf | Model.INovel | Model.IChapter,
    onClick: (model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void
}) {
    return <p>TODO Default</p>;
}
