import React from 'react';
import {useState} from 'react';
import { NutritionItem, useNutritionCRUD } from '../NutritionLogic'
import useFormState from '../common/useFormState'
import useObjectState from '../common/useObjectState'
import TextWithEdit from './TextWithEdit'

interface Props {
    item: NutritionItem,
    U: Function,
    D: Function
}

const NutritionListItem = ({item, U, D}:Props) => {

    const {obj, updateProperty, resetObj } = useObjectState(item)
    const [isEditing, setIsEditing] = useState(false)
    const { nutrition, createNutrition, readNutrition, updateNutrition, deleteNutrition }:
    {nutrition: NutritionItem[], createNutrition: Function, readNutrition: Function, updateNutrition: Function, deleteNutrition: Function} 
    = useNutritionCRUD()

    const itemState: NutritionItem = obj

    function handleTextChange(propName: string, newValue: any) {
        updateProperty(propName, newValue)
    }

    function toggleEdit() {
       setIsEditing(!isEditing)
    }

    function handleSave() {
        U(itemState)
        setIsEditing(!isEditing)
    }

    function handleCancel() {
        resetObj()
        setIsEditing(!isEditing)
    }

    function handleRemoveIngredient() {

    }


    return (
        <div>
            {obj.id} 
            - 
            <TextWithEdit text={itemState.title} isEdit={!isEditing} handleChange={(newText: string) => {handleTextChange('title', newText)} } /> 

            {isEditing ?
                <div>
                    <button onClick={() => handleSave()}>save</button>
                    <button onClick={() => handleCancel()}>cancel</button>
                </div>
                :
                <div>
                    <button onClick={toggleEdit}>edit</button>
                    <button onClick={() => D(itemState)}>delete</button>
                </div>
            }

            {itemState.ingredientIds.length > 0 ?
                <div id="ingredients">
                    ingredients:
                    {
                        obj.ingredientIds.map((id: string | number) => (
                            <div key={id}>
                                <NutritionListItem item={readNutrition(id)} U={() => console.log('U')} D={() => console.log('D')} />
                                <button onClick={() => {handleRemoveIngredient()}} >
                                    remove nutrition
                                </button>
                            </div>
                        ))
                    }
                    {/* <NutritionListItem item={new NutritionItem(7, 'salami')} U={() => console.log('U')} D={() => console.log('D')} /> */}
                </div>
                :
                <div></div>

            }

        </div>
    )

}

export default NutritionListItem