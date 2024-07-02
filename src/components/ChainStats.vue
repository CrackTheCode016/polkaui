<script setup lang="ts">
import { Ref, onBeforeMount, ref } from 'vue';
import Card from 'primevue/card';
import { store } from '../store';
import Dialog from 'primevue/dialog';
import DataTable, { DataTableRowClickEvent } from 'primevue/datatable';
import Column from 'primevue/column';

interface Block {
    hash: string, height: string
}

let blockHeight = ref(0);
const visible = ref(false);
let blockHash = ref("");
let blocks: Ref<Block[]> = ref([]);
let selectedBlock: Ref<Block | null> = ref(null);

store.relayClient.finalizedBlock$.subscribe((info) => {
    blockHeight.value = info.number;
    blockHash.value = info.hash;
    // limits to 10 max pages of data
    if (blocks.value.length >= 70) {
        blocks.value = [];
    }
    blocks.value.unshift({ hash: info.hash, height: info.number.toString() });
})

async function showDialog(block: DataTableRowClickEvent) {
    console.log(block);
    visible.value = true;
    selectedBlock.value = { hash: block.data.hash, height: block.data.height };
}

</script>

<template>
    <div class="grid flex">
        <Dialog v-model:visible="visible" modal header="Block Information">
            <div>
                <b>Block Height: {{ selectedBlock?.height }}</b>
                <hr>
                <b>Block Hash: {{ selectedBlock?.hash }}</b>
            </div>
        </Dialog>
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
            <DataTable paginator :rows="7" :rowHover="true"
                @row-click="(event: DataTableRowClickEvent) => showDialog(event)" :value="blocks">
                <Column field="height" header="Height"></Column>
                <Column field="hash" header="Hash"></Column>
            </DataTable>
        </div>
    </div>
</template>