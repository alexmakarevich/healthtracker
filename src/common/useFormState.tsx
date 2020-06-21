import {useState} from 'react';

export default (initialValue: any) => {

    const [formObject, setFormObject]: [any, Function] = useState(initialValue)

    return {
        formObject,
        updateProperty: (propName: string, propValue: any) => {
            // const newFormObject: any = {...formObject}
            // newFormObject[propName] = propValue
            setFormObject({...formObject, [propName]: propValue})
        },
        resetForm: () => {
            setFormObject(initialValue)
        }

    }

}