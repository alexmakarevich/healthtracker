import {useState} from 'react';

export default (initialValue: any) => {

    const [obj, setObj]: [any, Function] = useState(initialValue)

    return {
        obj,
        updateProperty: (propName: string, propValue: any) => {
            setObj({...obj, [propName]: propValue})
        },
        resetObj: () => {
            setObj(initialValue)
        }

    }

}