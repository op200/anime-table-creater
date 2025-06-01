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

const aniTable = ref<HTMLElement>()

</script>

<template>

    <AniTableButtonBar :aniTable="aniTable" />


    <div ref="aniTable" class="table-container" @mousedown="() => mouseState = true"
        @mouseup="() => mouseState = false">

        <div class="table-line">
            <span>已看: {{ selectedNum }} / {{ aniItemList.length }}</span>
        </div>

        <div class="table-line" v-for="aniYearGroup in aniYearGroups">
            <div class="table-cell" @click="() => {
                aniYearGroup.forEach(v =>
                    selectors[v.id] = selectors[v.id] ? undefined : true
                )
            }">
                {{ aniYearGroup[0].date.substring(0, 4) }}
            </div>
            <div class="table-cell" v-for="it in aniYearGroup"
                @mousedown="() => selectors[it.id] = selectors[it.id] ? undefined : true" @mouseenter="() => {
                    if (mouseState)
                        selectors[it.id] = selectors[it.id] ? undefined : true
                }" :class="{ 'selected': selectors[it.id], 'is-mouse-up': !mouseState }">
                {{ it.name_cn || it.name }}
            </div>
        </div>
    </div>

</template>

<style scoped>
.table-container {
    display: grid;

    gap: 0.4rem;
    margin: 1rem auto;
    width: fit-content;
    /* max-width: 100%; */
    border-collapse: collapse;
    user-select: none;
}

.table-line {
    display: flex;
    flex-wrap: wrap;
    width: fit-content;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.table-cell {
    display: inline-flex;
    text-align: center;
    justify-content: center;
    align-items: center;

    max-height: 4rem;
    width: min-content;
    min-width: 4rem;

    font-size: 0.8rem;
    padding: 1rem;
    border: 1.5px solid black;
    border-radius: 3px;
    cursor: pointer;

    overflow-wrap: break-word;
    word-break: keep-all;
    white-space: normal;
}

.table-cell.is-mouse-up:hover {
    background-color: var(--color-green-2);
}

.table-cell.selected {
    background-color: var(--color-green-2);
}

.table-cell.selected.is-mouse-up:hover {
    background-color: transparent;
}

.table-line>.table-cell:first-child {
    background-color: pink;
    font-weight: bold;
}
</style>
