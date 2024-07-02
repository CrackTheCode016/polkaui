<script setup lang="ts">
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { Transaction as PolkadotApiTransaction, TxEvent } from 'polkadot-api';
import { roc } from "@polkadot-api/descriptors"
import { store } from '../store';
import { useToast } from "primevue/usetoast";
const toast = useToast();

// Any transaction, any!
type Transaction = PolkadotApiTransaction<any, any, any, any>;

const props = defineProps<{
    call: Transaction | Transaction[]
    batch: boolean,
    rpc?: string
}>()

const typedApi = store.client.getTypedApi(roc);

function handleEvents(event: TxEvent) {
    console.log(event);
    if (event.type == 'broadcasted' || event.type == 'signed' || event.type == 'txBestBlocksState') {
        toast.add({ severity: 'info', summary: event.txHash, detail: event.type, life: 3000 });
    } else {
        toast.add({ severity: 'success', summary: event.txHash, detail: event.type, life: 3000 });
    }
}

function send() {
    if (props.batch) {
        let transactions = props.call as Transaction[];
        const calls = transactions.map((c) => c.decodedCall);
        typedApi.tx.Utility.batch({ calls })
            .signSubmitAndWatch(store.selectedAccount.polkadotSigner)
            .subscribe({
                next: (event) => handleEvents(event),
                error: (e) => toast.add({ severity: 'error', summary: 'Error', detail: e, life: 3000 }),
            })
    } else {
        const call = props.call as Transaction;
        call
            .signSubmitAndWatch(store.selectedAccount.polkadotSigner)
            .subscribe({
                next: (event) => handleEvents(event),
                error: (e) => toast.add({ severity: 'error', summary: 'Error', detail: e, life: 3000 }),
            })
    }
}
</script>

<template>
    <Button label="Submit" @click="send()" />
    <Toast />
</template>