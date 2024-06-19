<template>
    <div class="grid">
        <Card class="col">
            <template #title>Order Coretime</template>
            <template #content>
                <InputText v-model="paraID" placeholder="ParaID" />
                <InputText v-model="blocks" placeholder="Amount of Blocks" />
                <Button label="Submit" @click="orderCoretime" />
            </template>
        </Card>
        <Card class="col">
            <template #title>Order Statues</template>
            <template #content>
                <DataTable paginator :rows="5" :rowHover="true" :value="orders">
                    <Column field="orderNum" header="Order #"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="hash" header="Hash"></Column>
                </DataTable>
            </template>
        </Card>
    </div>

</template>


<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import { Ref, ref } from 'vue';
import { roc } from "@polkadot-api/descriptors"
import { store } from '../store';
import DataTable, { DataTableRowClickEvent } from 'primevue/datatable';
import Column from 'primevue/column';

interface Order {
    orderNum: number,
    hash: string,
    status: string
}

const paraID = ref();
const blocks = ref(0);
const orders: Ref<Order[]> = ref([]);
const typedApi = store.client.getTypedApi(roc);

function orderCoretime() {
    orders.value = [];
    let calls = [];
    let orderNum = 0;
    for (let i = 0; i < blocks.value; i++) {
        const call = typedApi.tx.OnDemandAssignmentProvider
            .place_order_keep_alive({ max_amount: BigInt(1000000000000), para_id: paraID.value });
        orders.value.unshift({ orderNum: i + 1, status: "Preparing...", hash: "" })
        calls.push(call.decodedCall)


    }
    console.log(calls);
    typedApi.tx.Utility.batch({ calls })
        .signSubmitAndWatch(store.selectedAccount.polkadotSigner)
        .subscribe({
            next: (event) => {
                if (event.type == "finalized") {
                    orderNum++;
                    orders.value.push({ orderNum, status: event.type, hash: event.txHash })
                }
            },
            error: console.error,
        })
}

</script>