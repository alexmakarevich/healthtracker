import useCRUDwithIds from './useCRUDwithIds'

export class NutritionItem {
    id: number | string = 'initial'
    title!: string;

    constructor (id: number | string, title: string) {
        this.id = id
        this.title = title
    }
}


function startingNutrition() {
    const nutrArray: NutritionItem[] = []
    nutrArray.push(new NutritionItem(1, 'apple'))
    nutrArray.push(new NutritionItem(2, 'orange'))
    nutrArray.push(new NutritionItem(3, 'tomato'))
    return nutrArray
}

    // {id: 1, title: 'apple'},
    // {id: 2, title: 'orange'},
    // {id: 3, title: 'tomato'}



export const NutritionLogic = () => {

}

export function useNutritionCRUD(initialNutrition: NutritionItem[] = startingNutrition()) {
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

