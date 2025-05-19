import { defineStore } from 'pinia'
import { getC1List, getC2List, getC3List } from '@/api/project/attr';
import type { CategoryResponseData } from "@/api/project/attr/type"
import type { CategoryState } from './types/type';

let useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            c1Id: '',
            c2Id: '',
            c3Id: '',
            c1List: [],
            c2List: [],
            c3List: [],
        }
    },
    actions: {
        async getC1List() {
            let result: CategoryResponseData = await getC1List()
            if (result.code === 200) {
                this.c1List = result.data;
            }
        },
        async getC2List() {
            let result: CategoryResponseData = await getC2List(this.c1Id)
            if (result.code === 200) {
                this.c2List = result.data;
            }
        },
        async getC3List() {
            let result: CategoryResponseData = await getC3List(this.c2Id)
            if (result.code === 200) {
                this.c3List = result.data;
            }
        }
    },
    getters: {

    }
})

export default useCategoryStore;