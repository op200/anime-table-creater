import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { localStore } from '@/utils'


export const useTableDataStore = defineStore('tableData', () => {
    const selectedNum = ref<number>(0)

    const selectors = ref<Map<number, boolean | undefined>>(new Map<number, boolean | undefined>())
    watch(selectors, () => {
        selectedNum.value = 0
        selectors.value.forEach(v => {
            if (v) ++selectedNum.value
        })
    }, { deep: true })
    localStore.setStore(selectors, "selectors")

    return { selectedNum, selectors }
})
