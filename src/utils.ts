import { ref, computed, watch, type Ref } from 'vue'

export namespace localStore {
    export function setStore(refVar: Ref<any>, name: string) {
        name = "anime-table-creater_" + name
        const jsonStr = localStorage.getItem(name)
        if (jsonStr) {
            const tempVar: any = JSON.parse(jsonStr)
            refVar.value = tempVar
        }
        watch(refVar,
            () => {
                console.log(name, refVar.value, JSON.stringify(refVar.value))
                localStorage.setItem(name, JSON.stringify(refVar.value))
            },
            { deep: true })
    }
}