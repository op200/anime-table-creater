import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { localStore } from '@/utils'


export const useTableDataStore = defineStore('tableData', () => {
    const selectedNum = ref<number>(0)

    const selectors = ref<Record<number, boolean | undefined>>({})
    watch(selectors, () => {
        selectedNum.value = 0
        Object.entries(selectors.value).forEach(([k, v]) => {
            if (v) ++selectedNum.value
        })
    }, { deep: true })
    localStore.setStore(selectors, "selectors")

    return { selectedNum, selectors }
})
