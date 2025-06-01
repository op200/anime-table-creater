<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute();

let routers = [
    { path: '/', label: '填表' },
    { path: '/creater', label: '自定义表格' },
    { path: '/setting', label: '设置' },
    { path: '/about', label: '关于' },
]
</script>

<template>
    <div class="container">
        <nav>
            <RouterLink v-for="it in routers" :to="it.path" :class="{ active: route.path === it.path }">
                {{ it.label }}
            </RouterLink>
        </nav>
        <hr>
    </div>
</template>

<style scoped>
.container {
    padding-top: 8px;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: white;
}

nav {
    display: flex;
    flex-wrap: wrap;
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
