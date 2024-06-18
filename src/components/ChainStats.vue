<script setup lang="ts">
import { Ref, onBeforeMount, ref } from 'vue';
import Card from 'primevue/card';
import Listbox from 'primevue/listbox';
import { store } from '../store';
import { roc } from "@polkadot-api/descriptors"

interface Item {
    name: string, code: string
}

let blockHeight = ref(0);
let blockHash = ref("");
const selectedBlock = ref();
let blocks: Ref<Item[]> = ref([]);

const typedApi = store.client.getTypedApi(roc);
store.client.finalizedBlock$.subscribe((info) => {
    blockHeight.value = info.number;
    blockHash.value = info.hash;
    blocks.value.push({ name: info.hash, code: info.number.toString() });
})

onBeforeMount(async () => {


});
</script>

<template>
    <div class="grid flex">
        <Card class="col m-2 bg-primary">
            <template #title>{{ blockHeight }}</template>
            <template #content>
                Finalized Block Height
            </template>
        </Card>
        <Card class="col m-2 bg-primary-reverse">
            <template #title>{{ blockHash }}</template>
            <template #content>
                Finalized Block Hash
            </template>
        </Card>
    </div>
    <div class="grid flex">
        <div class="col m-2">
            Blocks
            <Listbox v-model="selectedBlock" :options="blocks" optionLabel="name" class="w-full md:w-56" />
        </div>
    </div>
</template>