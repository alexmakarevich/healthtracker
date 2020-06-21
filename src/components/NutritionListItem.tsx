import React from 'react';
import {useState} from 'react';
import { NutritionItem, useNutritionCRUD } from '../NutritionLogic'
import useFormState from '../common/useFormState'
import useObjectState from '../common/useObjectState'
import TextWithEdit from './TextWithEdit'

const NutritionListItem = ({item, U, D}:{item: NutritionItem, U: Function, D: Function}) => {

    const {obj, updateProperty, resetObj } = useObjectState(item)
    const [isEditing, setIsEditing] = useState(false)

    function handleTextChange(propName: string, newValue: any) {
        updateProperty(propName, newValue)
    }

    function toggleEdit() {
       setIsEditing(!isEditing)
    }

    function handleSave() {
        U(obj)
        setIsEditing(!isEditing)
    }

    function handleCancel() {
        resetObj()
        setIsEditing(!isEditing)
    }


    return (
        <li>
            {obj.id} - 
            <TextWithEdit text={obj.title} isEdit={!isEditing} handleChange={(newText: string) => {handleTextChange('title', newText)} } /> 
            {isEditing ?
                <div>
                    <button onClick={() => handleSave()}>save</button>
                    <button onClick={() => handleCancel()}>cancel</button>
                </div>
                :
                <div>
                    <button onClick={toggleEdit}>edit</button>
                    <button onClick={() => D(obj)}>delete</button>
                </div>
            }
        </li>
    )

}

export default NutritionListItem