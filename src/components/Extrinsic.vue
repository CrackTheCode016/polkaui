<script setup lang="ts">
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { ChainDefinition, Transaction as PolkadotApiTransaction, TxEvent } from 'polkadot-api';
import { edu, roc, testchain } from "@polkadot-api/descriptors"
import { store } from '../store';
import { useToast } from "primevue/usetoast";
import { TypedApi } from 'polkadot-api';
const toast = useToast();

// Any transaction, any!
type Transaction = PolkadotApiTransaction<any, any, any, any>;

const emit = defineEmits(["finalized"])
const props = defineProps<{
    call: Transaction | Transaction[]
    batch: boolean,
    para: boolean,
    text: string,
    rpc?: string
}>()

let typedApi = store.relayClient.getTypedApi(testchain);
if (props.para) {
    console.log("parachain detected")
    typedApi = store.paraClient.getTypedApi(testchain);
}

function handleEvents(event: TxEvent) {
    console.log(event);
    if (event.type == 'broadcasted' || event.type == 'signed' || event.type == 'txBestBlocksState') {
        toast.add({ severity: 'info', summary: event.txHash, detail: event.type, life: 3000 });
    } else if (event.type == 'finalized') {
        toast.add({ severity: 'success', summary: event.txHash, detail: event.type, life: 3000 });
    } else {
        toast.add({ severity: 'info', summary: "Unknown", detail: "Unknown", life: 3000 });
    }
}

function send() {
    if (props.batch) {
        let transactions = props.call as Transaction[];
        const calls = transactions.map((c) => c.decodedCall);
        typedApi.tx.Utility.batch({ calls })
            .signSubmitAndWatch(store.selectedAccount.polkadotSigner)
            .subscribe({
                next: (event: any) => handleEvents(event),
                error: (e: any) => toast.add({ severity: 'error', summary: 'Error', detail: e, life: 3000 }),
            })
    } else {
        const call = props.call as Transaction;
        console.log(call)
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
    <div>
        <Button :label="props.text" @click="send()" />
        <Toast />
    </div>
</template>