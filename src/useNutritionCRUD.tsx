import useCRUDwithIds from './useCRUDwithIds'
import { NutritionItem } from './NutritionLogic'

export default (initialNutrition: NutritionItem) => {
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