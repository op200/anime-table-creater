<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute();

let routers = [
    { path: '/', label: '填表' },
    { path: '/creater', label: '自定义表格' }
]
</script>

<template>
    <nav>
        <RouterLink v-for="it in routers" :to="it.path" :class="{ active: route.path === it.path }">
            {{ it.label }}
        </RouterLink>
    </nav>
    <hr>
</template>

<style scoped>
nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    user-select: none;

    a {
        padding: 0.3rem 0.4rem;
        border-radius: 0.2rem;
        color: var(--color-green-1);
    }

    a:hover {
        background-color: var(--color-green-2);
    }

    .active {
        background-color: var(--color-green-4);
    }
}

hr {
    color: var(--color-green-1);
    border: 1px solid var(--color-green-1);
}
</style>
