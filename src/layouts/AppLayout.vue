<script setup lang="ts">
import NavigationMenu from '../components/NavigationMenu.vue';
</script>

<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans antialiased">
        <NavigationMenu />

        <!-- Page Heading -->
        <header v-if="$slots.header" class="bg-white dark:bg-gray-800 shadow">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <slot name="header" />
            </div>
        </header>

        <!-- Page Content -->
        <main>
            <slot />
        </main>
    </div>
</template>
