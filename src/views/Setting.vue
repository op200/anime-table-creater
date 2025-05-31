<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useTableDataStore } from '@/stores/tableDataStore'
const tableDataStore = useTableDataStore();
const { bgmuid } = storeToRefs(tableDataStore);

</script>

<template>
    <div class="container">

        <div class="line">
            <span>Bangumi UID:&nbsp;&nbsp;</span>
            <input type="text" v-model="bgmuid">
            <span v-show="bgmuid">
                &nbsp;
                <a :href="`https://bgm.tv/user/${bgmuid}`"
                    target="_blank">{{ `https://bgm.tv/user/${bgmuid}` }}</a>
            </span>
            <span v-show="!bgmuid">&nbsp;&nbsp;需输入 UID 才能使用自动填表等功能</span>
        </div>

    </div>
</template>

<style scoped>
a {
    color: var(--color-green-1);
    padding: 0.3rem 0.4rem;
    border-radius: 0.2rem;
}

a:hover {
    background-color: var(--color-green-4);
}

.container {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 4rem;
}

.line {
    display: inline;
}
</style>
