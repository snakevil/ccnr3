import * as React from 'react';

/**
 * @param {Array<[number, string]>} data 分页数据
 */
export default function ({ data }: {
    data: Array<[number, string]>
}) {
    return (
        <div className={ 'page' + (data ? '' : ' loading') }> {
            data ? data.map((item, index) =>
                2 == item[0] ? (
                        <h3 key={ 'h2_' + index }>{ item[1] }</h3>
                    ) : (
                        <p key={ 'p_' + index } className={ item[0] ? 'tail': '' }>{ item[1] }</p>
                    )
            ) : null
        } </div>
    );
}
