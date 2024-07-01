<script setup lang="ts">
import Button from 'primevue/button';
import { Enum, Transaction as PolkadotApiTransaction, TxEntry } from 'polkadot-api';
import { roc } from "@polkadot-api/descriptors"
import { store } from '../store';

// Any transaction, any!
type Transaction = PolkadotApiTransaction<any, any, any, any>;

const props = defineProps<{
    call: Transaction | Transaction[]
    batch: boolean,
    rpc?: string
}>()

const typedApi = store.client.getTypedApi(roc);
function send() {
    if (props.batch) {
        let transactions = props.call as Transaction[];
        const calls = transactions.map((c) => c.decodedCall);
        typedApi.tx.Utility.batch({ calls })
            .signSubmitAndWatch(store.selectedAccount.polkadotSigner)
            .subscribe({
                next: (event) => {
                    console.log(event);
                },
                error: console.error,
            })
    } else {
        const call = props.call as Transaction;
        call
            .signSubmitAndWatch(store.selectedAccount.polkadotSigner)
            .subscribe({
                next: (event) => {
                    console.log(event);
                    store.hashes.set(event.txHash, event.type);
                },
                error: console.error,
            })
    }
}
</script>

<template>
    <Button label="Submit" @click="send()" />
</template>