<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import type { AniItem, AniSubjects } from '@/api';
import { bgmapi } from '@/api';
import { localStore } from '@/utils'

import { storeToRefs } from 'pinia';

import { useAniDataStore } from '@/stores/aniDataStore'
const aniDataStore = useAniDataStore();
const { aniItemList } = storeToRefs(aniDataStore);

import { useTableDataStore } from '@/stores/tableDataStore'
const tableDataStore = useTableDataStore();
const { selectedNum } = storeToRefs(tableDataStore);


const yearRange = ref<[number, number]>([2014, 2024])
localStore.setStore(yearRange, "yearRange")


const numPerYear = ref<number>(10)
localStore.setStore(numPerYear, "numPerYear")


const getDataButtonState = ref<boolean>(true)

function saveTable() {
    const data = {
        aniItemList: aniItemList.value,
    }
    const jsonStr = JSON.stringify(data)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url;
    link.download = 'ani-table-data.json'
    link.click();
    URL.revokeObjectURL(url);
}

</script>



<template>
    <div style="
            display: flex;
            gap: 1rem;
            text-align: center;
            justify-content: center;
            align-items: center;">

        <div>
            <span>年份: </span>
            <input type="number" step="1" v-model="yearRange[0]">
            <span> - </span>
            <input type="number" step="1" v-model="yearRange[1]">
        </div>

        <div>
            <span>每年数量: </span>
            <input type="number" step="1" v-model="numPerYear">
        </div>

        <button @click="async () => {
            getDataButtonState = false;
            aniItemList = []
            yearRange.sort()
            let year

            for (year = yearRange[0]; year <= yearRange[1]; ++year) {
                console.log('year', year)
                const res = await bgmapi.search_subjects(year, numPerYear)
                if (res !== null)
                    res.data.forEach(v => aniItemList.push(v))
            }

            aniItemList.sort((a, b) => {
                const date1 = new Date(a.date), date2 = new Date(b.date)
                return date1.getFullYear() - date2.getFullYear()
            })

            getDataButtonState = true;
        }" :class="{ 'disable-button': !getDataButtonState }">
            获取数据
        </button>

        <button @click="saveTable">
            导出数据
        </button>

        <span>统计: {{ selectedNum }} / {{ aniItemList.length }}</span>


    </div>
</template>



<style scoped>
input {
    width: 4rem;
}

button {
    cursor: pointer;
    padding: 0.3rem 0.4rem;
    border-radius: 0.2rem;
    color: var(--color-green-1);
    background-color: var(--color-green-4);
    border: 0;
}

button:hover {
    background-color: var(--color-green-2);
}

.disable-button {
    pointer-events: none;
    cursor: not-allowed;
    background-color: var(--color-gray-1);
}
</style>
