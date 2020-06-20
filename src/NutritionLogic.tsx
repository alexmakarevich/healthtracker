import useCRUDwithIds from './useCRUDwithIds'

const startingNutrition: NutritionItem[] = [
    {id: 1, title: 'apple'},
    {id: 2, title: 'orange'},
    {id: 3, title: 'tomato'}
]

export class NutritionItem {
    id!: number | string;
    title!: string
}
export const NutritionLogic = () => {

}

export function useNutritionCRUD(initialNutrition: NutritionItem[] = startingNutrition) {
    const { items, C, R, U, D } = useCRUDwithIds('id', initialNutrition)

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

