import React from 'react';
import {useState} from 'react';
import { NutritionItem, useNutritionCRUD } from '../NutritionLogic'
import useFormState from '../common/useFormState'
import NutritionListItem from './NutritionListItem';

const NutritionList = () => {

    const { nutrition, createNutrition, updateNutrition, deleteNutrition }:
    {nutrition: NutritionItem[], createNutrition: Function, readNutrition: Function, updateNutrition: Function, deleteNutrition: Function} 
    = useNutritionCRUD()

    const { formObject, updateProperty, resetForm } = useFormState( {id:'temp', title: ''})

    function handleTitleChange(title: string) {
        updateProperty('title', title)
    }

    function handleCreate() {
        createNutrition(formObject)
        resetForm()
    }

    function handleItemUpdate(nutritionItem: NutritionItem) {
        updateNutrition(nutritionItem)
    }
    
    function handleItemDelete(nutritionItem: NutritionItem) {
        deleteNutrition(nutritionItem)
    }

    return (
        <ul>
            {nutrition.map((nutritionItem) => (
                <NutritionListItem key={nutritionItem.id} item={nutritionItem} U={handleItemUpdate} D={handleItemDelete} />
            ))}
                <li>
                    <input value={formObject.title} placeholder='title'  onChange={(event) => handleTitleChange(event.target.value)}/> 
                    <button 
                        onClick={() => {handleCreate()}}
                    >
                        create
                    </button>
                </li>
        </ul>
    )

}

export default NutritionList