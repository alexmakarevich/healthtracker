import useCRUDwithIds from './useCRUDwithIds'

export class NutritionItem {
    id: number | string = 'initial'
    title!: string;
    ingredientIds: number[] | string[] = []

    constructor (id: number | string, title: string, ingredientIds?: number[] | string[]) {
        this.id = id
        this.title = title
        ingredientIds !== undefined ? this.ingredientIds = ingredientIds : this.ingredientIds = []
    }
}


function startingNutrition() {
    const nutrArray: NutritionItem[] = []
    nutrArray.push(new NutritionItem(1, 'apple'))
    nutrArray.push(new NutritionItem(2, 'orange'))
    nutrArray.push(new NutritionItem(3, 'tomato'))
    nutrArray.push(new NutritionItem(4, 'pizza', [5, 6, 7]))
    nutrArray.push(new NutritionItem(5, 'dough'))
    nutrArray.push(new NutritionItem(6, 'cheese'))
    nutrArray.push(new NutritionItem(7, 'salami'))
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
        readNutrition: (id: string | number) => {
            return R(id)
        },
        updateNutrition: (nutritionItem: NutritionItem) => {
            U(nutritionItem)
        },
        deleteNutrition: (nutritionItem: NutritionItem) => {
            D(nutritionItem)
        },
    };
}

