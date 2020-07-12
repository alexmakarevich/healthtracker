import {useState} from 'react';
import React from 'react';
import { render } from '@testing-library/react';

const TextWithEdit = ({text, isEdit = false, handleChange}:{text: string, isEdit: boolean, handleChange: Function}) => {
    // const [textState, setTextState]: [any, Function] = useState(text)

    return (
        <div>
            { isEdit ?
                <div>
                    {text}
                </div>
            :
                <input value={text} onChange={(event) => handleChange(event.target.value)} />
            }
        </div>
    )
}

export default TextWithEdit