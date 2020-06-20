import {useState} from 'react';

export default (idProp: string, initialValue: any) => {

    const [items, setItems]: [Array<any>, Function] = useState(initialValue)

    return {
        items,
        C: (newItem: any) => {
            const newId = 1 + items.reduce((prev, current) => (prev[idProp] > current[idProp]) ? prev[idProp]: current[idProp])
            newItem[idProp] = newId
            setItems(...items, newItem)
        },

        R: (id: number | string) => {
            return items.find(item => item[idProp] === id)
        },

        U: (itemToUpdate: any) => {
            const newItems: Array<any> = items.map(item => item[idProp] === itemToUpdate[idProp] ? item = itemToUpdate : item)
            setItems(newItems)
        },

        D: (itemToDelete: any) => {
            const itemsAfterDelete: Array<any> = items.filter(item => item[idProp] !== itemToDelete[idProp]) 
            setItems(itemsAfterDelete)
        }

    }

}