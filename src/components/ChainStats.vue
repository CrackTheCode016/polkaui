<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Card from 'primevue/card';
import { store } from '../store';
import { MultiAddress, roc } from "@polkadot-api/descriptors"

let blockHeight = ref(0);
const typedApi = store.client.getTypedApi(roc);
store.client.finalizedBlock$.subscribe((info) => {
    blockHeight.value = info.number;
})

onBeforeMount(async () => {
});
</script>

<template>
    <div class="flex p-6">
        <Card class="col m-2 bg-primary">
            <template #title>{{ blockHeight }}</template>
            <template #content>
                Finalized Block Height
            </template>
        </Card>
    </div>
</template>