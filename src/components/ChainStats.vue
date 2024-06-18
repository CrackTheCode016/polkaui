<script setup lang="ts">
import { Ref, onBeforeMount, ref } from 'vue';
import Card from 'primevue/card';
import { store } from '../store';
import { roc } from "@polkadot-api/descriptors"
import Dialog from 'primevue/dialog';
import DataTable, { DataTableRowClickEvent } from 'primevue/datatable';
import Column from 'primevue/column';

interface Item {
    hash: string, height: string
}

let blockHeight = ref(0);
let blockHash = ref("");
let blocks: Ref<Item[]> = ref([]);

const typedApi = store.client.getTypedApi(roc);
store.client.finalizedBlock$.subscribe((info) => {
    blockHeight.value = info.number;
    blockHash.value = info.hash;
    blocks.value.unshift({ hash: info.hash, height: info.number.toString() });
})

onBeforeMount(async () => {});

function showDialog(block: DataTableRowClickEvent) {
    alert(block.data.hash);
}
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
            <DataTable paginator :rows="5" :rowHover="true"
                @row-click="(event: DataTableRowClickEvent) => showDialog(event)" :value="blocks">
                <Column field="height" header="Height"></Column>
                <Column field="hash" header="Hash"></Column>
            </DataTable>

        </div>
    </div>
</template>