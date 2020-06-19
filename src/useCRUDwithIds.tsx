import {useState, useEffect} from 'react';

export default (initialValue: any) => {

    const [items, setItems]: [Array<any>, Function] = useState(initialValue)

    return {
        items,
        C: (newItem: any) => {
            const newId = 1 + items.reduce((prev, current) => (prev.id > current.id) ? prev.id : current.id)
            newItem.id = newId
            setItems(...items, newItem)
        },

        R: (id: number | string) => {
            return items.find(item => item.id === id)
        },

        U: (itemToUpdate: any) => {
            const newItems: Array<any> = items.map(item => item.id === itemToUpdate.id ? item = itemToUpdate : item)
            setItems(newItems)
        },

        D: (itemToDelete: any) => {
            const itemsAfterDelete: Array<any> = items.filter(item => item.id != itemToDelete.id) 
            setItems(itemsAfterDelete)
        }

    }

}