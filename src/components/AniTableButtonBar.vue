<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import type { AniItem, UserCollection } from '@/api';
import { bgmapi } from '@/api';
import { localStore } from '@/utils'

import { storeToRefs } from 'pinia';

import { useAniDataStore } from '@/stores/aniDataStore'
const aniDataStore = useAniDataStore();
const { aniItemList } = storeToRefs(aniDataStore);

import { useTableDataStore } from '@/stores/tableDataStore'
const tableDataStore = useTableDataStore();
const { selectedNum, selectors, bgmuid } = storeToRefs(tableDataStore);


const yearRange = ref<[number, number]>([2014, 2024])
localStore.setStore(yearRange, "yearRange")


const numPerYear = ref<number>(10)
localStore.setStore(numPerYear, "numPerYear")


const getDataButtonState = ref<boolean>(true)

function exportTable() {
    const data = {
        aniItemList: aniItemList.value,
        selectors: selectors.value,
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

function importTable() {
    new Promise<{ ok: boolean; json: () => Promise<Object> }>((resolve, reject) => {
        // 创建隐藏的文件输入元素
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';

        // 处理文件选择
        input.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];

            if (!file) {
                reject(new Error('未选择文件'));
                return;
            }

            // 读取文件内容
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const jsonData = JSON.parse(content);
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(jsonData)
                    });
                } catch (error) {
                    reject(new Error('解析JSON文件失败'));
                }
            };
            reader.onerror = () => reject(new Error('读取文件失败'));
            reader.readAsText(file);
        };

        // 触发文件选择对话框
        input.click();
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json(); // 解析JSON数据
        })
        .then(data => {
            console.log('获取的数据:', data);
            if ("aniItemList" in data)
                aniItemList.value = data.aniItemList as AniItem[]
            if ("selectors" in data)
                selectors.value = data.selectors as Record<number, boolean | undefined>
        })
        .catch(err => console.error(err));
}

</script>



<template>
    <div style="
            display: flex;
            flex-wrap: wrap;
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
                console.log('get ani by year', year, numPerYear)
                const res = await bgmapi.search_subjects(year, numPerYear)
                if (res !== null)
                    res.data.forEach(v => aniItemList.push(v))
            }

            aniItemList.sort((a, b) => {
                const date1 = new Date(a.date), date2 = new Date(b.date)
                return date1.getTime() - date2.getTime()
            })

            getDataButtonState = true;
        }" :class="{ 'disable-button': !getDataButtonState }">
            获取数据
        </button>

        <button @click="exportTable">
            导出数据
        </button>

        <button @click="importTable">
            导入数据
        </button>

        <button @click="() => {
            aniItemList.forEach(async it => {
                const userCollection = await bgmapi.search_user_collection(bgmuid as string, it.id)
                selectors[it.id] = userCollection?.type === 2
            })
        }" :class="{ 'disable-button': !bgmuid }" class="tooltip" data-tooltip="自定义提示文本">
            自动填表
        </button>

        <button @click="() => {
            aniItemList.forEach(it => {
                selectors[it.id] = false
            })
        }">
            全不选
        </button>

        <button @click="() => {
            aniItemList.forEach(it => {
                selectors[it.id] = true
            })
        }">
            全选
        </button>

        <span>已看: {{ selectedNum }} / {{ aniItemList.length }}</span>


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

.tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease 1s;
    /* 1秒延迟 */
}

.tooltip:hover::after {
    opacity: 1;
}
</style>
