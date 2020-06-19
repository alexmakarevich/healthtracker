import React from 'react'
import NutritionList from './NutritionList'
import useState from 'react'
import useCRUDwithIds from './useCRUDwithIds'

const startingNutrition: NutritionItem[] = [
    {id: 1, title: 'apple'},
    {id: 2, title: 'orange'}
]

export class NutritionItem {
    id!: number | string;
    title!: string
}
export const NutritionLogic = () => {

}

export function useNutritionCRUD(initialNutrition: NutritionItem[] = startingNutrition) {
    const { items, C, R, U, D } = useCRUDwithIds(initialNutrition)

    return {
        nutrition: items,
        createNutrition: (nutritionItem: NutritionItem) => {
            C(nutritionItem)
        },
        readNutrition: (nutritionItem: NutritionItem) => {
            R(nutritionItem.id)
        },
        updateNutrition: (nutritionItem: NutritionItem) => {
            U(nutritionItem)
        },
        deleteNutrition: (nutritionItem: NutritionItem) => {
            D(nutritionItem)
        },
    };
}

export default (initialNutrition: Array<NutritionItem>) => {
    
}

