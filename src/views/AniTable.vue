<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
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

const isMouseDown = ref<boolean>(false)

const aniTable = ref<HTMLElement>()

const currentlySelectedAniItem = ref<AniItem | undefined>()
const gridTemplateColumns = computed(() => (currentlySelectedAniItem.value === undefined || aniItemList.value.length == 0) ? "1fr" : "3fr 1fr")

</script>



<template>

    <AniTableButtonBar :aniTable="aniTable" />


    <p v-if="aniItemList.length < 1" style="text-align: center;">点击 获取数据 从 Bangumi 获取排名靠前的数据</p>


    <div class="work-space-container" @dblclick="() => currentlySelectedAniItem = undefined">

        <div class="table-container" @mousedown="() => isMouseDown = true" @mouseup="() => isMouseDown = false"
            v-show="aniItemList.length">

            <div ref="aniTable" class="table-content">

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

                    <div class="table-cell" v-for="it in aniYearGroup" @mousedown="() => {
                        selectors[it.id] = selectors[it.id] ? undefined : true
                        currentlySelectedAniItem = it
                    }" @mouseenter="() => {
                        if (isMouseDown)
                            selectors[it.id] = selectors[it.id] ? undefined : true
                    }"
                        :class="{ 'selected': selectors[it.id], 'current-selected': currentlySelectedAniItem !== undefined && it.id === currentlySelectedAniItem.id, 'is-mouse-up': !isMouseDown }">
                        {{ it.name_cn || it.name }}
                    </div>

                </div>

            </div>

        </div>

        <div class="detail-container" v-if="currentlySelectedAniItem"
            @dblclick.self="() => currentlySelectedAniItem = undefined">
            <div class="detail-content">

                <div>

                    <img :src="currentlySelectedAniItem?.images.small" class="background-image">

                    <table>
                        <tbody>
                            <tr>
                                <td>UID</td>
                                <td>
                                    <a :href="`https://bgm.tv/subject/${currentlySelectedAniItem?.id}`" target="_blank">
                                        {{ currentlySelectedAniItem?.id }}
                                    </a>
                                    {{ currentlySelectedAniItem?.platform }}
                                </td>
                            </tr>
                            <tr>
                                <td>名称</td>
                                <td>{{ currentlySelectedAniItem?.name }}</td>
                            </tr>
                            <tr>
                                <td>中文名</td>
                                <td>{{ currentlySelectedAniItem?.name_cn }}</td>
                            </tr>
                            <tr>
                                <td>别名</td>
                                <td>
                                    <div
                                        v-for="name in currentlySelectedAniItem?.infobox.find(it => it.key === '别名')?.value">
                                        {{ name.v }}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>开始时间</td>
                                <td>{{(() => {
                                    let dateStr = currentlySelectedAniItem?.date
                                    let date = dateStr ? new Date(dateStr).toLocaleDateString() : undefined
                                    return date ? date : '未知日期'
                                })()}}</td>
                            </tr>
                            <tr>
                                <td>集数</td>
                                <td>{{ currentlySelectedAniItem?.eps }}</td>
                            </tr>
                            <tr>
                                <td>评分</td>
                                <td>
                                    {{ currentlySelectedAniItem?.rating.score }} 分
                                    {{ currentlySelectedAniItem?.rating.rank }} 名
                                    {{ currentlySelectedAniItem?.rating.total }} 人
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

            </div>
        </div>

    </div>

</template>

<style scoped>
.work-space-container {
    position: relative;

    display: grid;
    grid-template-columns: v-bind(gridTemplateColumns);

    width: 100%;
    margin: 1rem auto;
}

.detail-container {
    position: sticky;
    top: 3rem;

    height: fit-content;
}

.detail-content {
    position: sticky;
    top: 4rem;

    margin: 0.2rem 0.3rem;
    width: calc(100% - 0.6rem);
    height: fit-content;

    overflow-wrap: break-word;
    word-break: break-all;

    border: 1px solid var(--color-green-1);
    border-radius: 3px;

    .background-image {
        z-index: -1;
        position: absolute;
        top: 0;
        right: 0;
        max-height: 100%;

        /* 渐显遮罩（只作用于伪元素） */
        -webkit-mask: linear-gradient(to right,
                transparent 0%,
                rgba(0, 0, 0, 0.3) 60%,
                rgba(0, 0, 0, 0.9) 100%);
        mask: linear-gradient(to right,
                transparent 0%,
                rgba(0, 0, 0, 0.3) 60%,
                rgba(0, 0, 0, 0.9) 100%);
    }

    table {
        width: 100%;
        border-collapse: collapse;

        background-repeat: no-repeat;
        background-position: right top;
        background-size: auto 100%;
    }



    td {
        border: 1px solid var(--color-green-1);
    }

    tr {
        padding: 0.2rem 0.3rem;
        border: 1px solid var(--color-green-2);
    }

    tr:hover {
        background-color: var(--color-green-4);
    }

    tr>td:first-child {
        white-space: nowrap;
        width: 0;

        text-align: center;
        border-width: 0 1px 0 0;
        padding-left: 0.4rem;
        padding-right: 0.4rem;
    }

    tr>td:nth-child(2) {
        border-width: 0 0 0 1px;
        padding-left: 0.4rem;
    }

    a {
        color: var(--color-green-1);
        border-radius: 0.2rem;
        background-color: var(--color-green-4);

        display: inline-block;
        padding: 0.1rem 0.2rem;
        margin: 0.2rem 0;
    }

    a:hover {
        background-color: var(--color-green-2);
    }
}

.table-container {
    position: relative;

    width: 100%;
}

.table-content {
    /* z-index: 10000; */

    display: grid;
    gap: 0.4rem;

    user-select: none;

    width: fit-content;
    margin: auto;
    padding-right: 6px;
}

.table-content>.table-line:first-child {
    padding: 0 0.2rem;

    position: sticky;
    top: 4rem;
    background-color: white;
    border: 1px solid var(--color-green-1);
    border-radius: 3px;
}

.table-line {
    display: flex;
    flex-wrap: wrap;
    width: fit-content;
    gap: 0.4rem;
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
    /* background-color: var(--color-green-2); */
    border-color: var(--color-green-1);
    color: var(--color-green-1);
}

.table-cell.selected {
    background-color: var(--color-green-2);
}

.table-cell.current-selected {
    border-color: var(--color-green-1);
    color: var(--color-green-1);
}

/* .table-cell.selected.is-mouse-up:hover {
    background-color: transparent;
} */

.table-line>.table-cell:first-child {
    background-color: pink;
    font-weight: bold;
}

@media (max-width: 52rem) {
    .work-space-container {
        grid-template-columns: 1fr;
    }

    .detail-container {
        order: 1;

        position: sticky;
        top: 4.6rem;

        max-height: 26vh;

        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;

        padding: 0;
        margin: 0;
    }

    .detail-content {
        background-color: white;
        margin: 0;
    }

    .table-container {
        order: 2;
        margin-top: 0.5rem;
    }

    .table-content>.table-line:first-child {
        position: sticky;
        top: 3.1rem;
        background-color: white;
        border: 1px solid var(--color-green-1);
        border-radius: 3px;
    }
}
</style>
