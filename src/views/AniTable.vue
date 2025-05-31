<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { AniItem, AniSubjects } from '@/api.ts';
import { bgmapi } from '@/api.ts';


import AniTableButtonBar from '@/components/AniTableButtonBar.vue'


import { storeToRefs } from 'pinia';

import { useAniDataStore } from '@/stores/aniDataStore'
const aniDataStore = useAniDataStore();
const { aniItemList, aniYearGroups } = storeToRefs(aniDataStore);

import { useTableDataStore } from '@/stores/tableDataStore'
const tableDataStore = useTableDataStore();
const { selectedNum, selectors } = storeToRefs(tableDataStore);


onMounted(() => {
    if (aniItemList.value.length)
        aniItemList.value[0] = { ...aniItemList.value[0] } // 触发 watch
})

const mouseState = ref<boolean>(false)

</script>

<template>

    <AniTableButtonBar />

    <div class="table-container" @mousedown="() => mouseState = true" @mouseup="() => mouseState = false">
        <div class="table-line" v-for="aniYearGroup in aniYearGroups">
            <div class="table-cell">
                {{ aniYearGroup[0].date.substring(0, 4) }}
            </div>
            <div class="table-cell" v-for="it in aniYearGroup"
                @click="() => selectors.set(it.id, !selectors.get(it.id))" @mouseenter="() => {
                    if (mouseState)
                        selectors.set(it.id, !selectors.get(it.id))

                }" :class="{ 'table-cell-selected': selectors.get(it.id), 'is-mouse-up': !mouseState }">
                {{ it.name_cn || it.name }}
            </div>
        </div>
    </div>

</template>

<style scoped>
.table-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 1rem auto;
    border-collapse: collapse;
    user-select: none;
}

.table-line {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 0;
    padding: 0;
}

.table-cell {
    display: inline-flex;
    text-align: center;
    justify-content: center;
    align-items: center;

    font-size: 0.8rem;
    max-height: 4rem;
    min-width: 4rem;
    max-width: 8rem;
    padding: 1rem;
    border: 1.5px solid black;
    border-radius: 2%;
    cursor: pointer;

    white-space: inherit;
    word-wrap: normal;
    word-break: normal;
    white-space: normal;
}

.table-cell.is-mouse-up:hover {
    background-color: var(--color-green-3);
}

.table-cell-selected {
    background-color: var(--color-green-2);
}

.table-line>.table-cell:nth-child(1) {
    background-color: pink;
    font-weight: bold;
}
</style>
