import { ref, computed, watch, type Ref } from 'vue'

export namespace localStore {
    export function setStore(refVar: Ref<any>, name: string) {
        name = "anime-table-creater_" + name
        const jsonStr = localStorage.getItem(name)
        if (jsonStr) {
            const tempVar: Ref<any> = JSON.parse(jsonStr)
            refVar.value = tempVar
        }
        watch(refVar,
            () => {
                localStorage.setItem(name, JSON.stringify(refVar.value))
            },
            { deep: true })
    }
}