import * as React from 'react';

import * as Model from '../../../model';

import { Book } from './book';

/**
 * @param {Model.IBookshelf} model 书架实例
 * @param {(model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void} onClick 切换模型实例方法
 * @param {boolean} visible 是否可见
 */
export function Bookshelf ({ model, onClick, visible }: {
    model: Model.IBookshelf,
    onClick: (model: Model.IBookshelf | Model.INovel | Model.IChapter, animate?: boolean) => void,
    visible: boolean
}) {
    return (
        <div className={ 'bookshelf' + (visible ? '' : ' hidden') }>
            <h1>书架</h1>
            <ol>
                {
                    model.novels.map((novel, index) => (
                        <Book key={ 'book_' + index } model={ novel } onClick={ onClick } />
                    ))
                }
            </ol>
        </div>
    );
}
