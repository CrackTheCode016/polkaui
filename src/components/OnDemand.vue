<template>
    <InputText v-model="value" placeholder="Recipient" />
    <Button label="Submit" @click="transferFunds" />
</template>


<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { MultiAddress, roc } from "@polkadot-api/descriptors"
import { store } from '../store';

const value = ref();
const typedApi = store.client.getTypedApi(roc);

function transferFunds() {
    typedApi.tx.Balances.transfer_keep_alive({
        dest: MultiAddress.Id(value.value),
        value: BigInt(100000),
    })
        .signSubmitAndWatch(store.selectedAccount.polkadotSigner)
        .subscribe({
            next: (event) => {
                console.log(event)
            },
            error: console.error,
        })
}

</script>