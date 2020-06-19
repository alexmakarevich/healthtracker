import React from 'react';

import { NutritionItem, useNutritionCRUD } from './NutritionLogic'


const NutritionList = () => {

    
    const { nutrition, createNutrition, readNutrition, updateNutrition, deleteNutrition } = useNutritionCRUD()


    return (
        <ul>
            {nutrition.map((nutritionItem) => (
                <li key={nutritionItem.id}>
                    {nutritionItem.id} - {nutritionItem.title}
                </li>
            ))}
        </ul>

    )

}

export default NutritionList