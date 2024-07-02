<template>
    <div>
        <h2>On Demand Ordering</h2>
        <InputText v-model="maxAmount" placeholder="Max Amount" />
    </div>
    <br>
    <div class="grid">
        <Card class="col">
            <template #title>Order Coretime</template>
            <template #content>
                <div class="m-2">
                    <InputText v-model="paraID" placeholder="ParaID" />
                    <InputText v-model="blocks" placeholder="Amount of Blocks" />
                </div>
                <Extrinsic class="m-2" :call="orderCoretime()" :batch="true" />
            </template>
        </Card>
    </div>
</template>


<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import { ref } from 'vue';
import { roc } from "@polkadot-api/descriptors"
import { store } from '../store';
import Extrinsic from './Extrinsic.vue';
import { Transaction as PolkadotApiTransaction } from 'polkadot-api';
type Transaction = PolkadotApiTransaction<any, any, any, any>;

const maxAmount = BigInt(1000000000000);
const paraID = ref();
const blocks = ref(0);
const typedApi = store.relayClient.getTypedApi(roc);

function orderCoretime() {
    let calls: Transaction[] = [];
    for (let i = 0; i < blocks.value; i++) {
        const call = typedApi.tx.OnDemandAssignmentProvider
            .place_order_keep_alive({ max_amount: maxAmount, para_id: paraID.value });
        calls.push(call)
    }
    return calls;
}

</script>