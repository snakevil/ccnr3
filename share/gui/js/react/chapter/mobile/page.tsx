import * as React from 'react';

export default function (props: { data: Array<[number, string]> }) {
    return (
        <div className="page">
            {
                props.data.map((paragraph, index) =>
                    2 == paragraph[0] ? (
                            <h2 key={ 'h2_' + index }>{ paragraph[1] }</h2>
                        ) : (
                            <p key={ 'p_' + index } className={ paragraph[0] ? 'cont': '' }>{ paragraph[1] }</p>
                        )
                )
            }
        </div>
    );
}
