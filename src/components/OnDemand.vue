<template>
    <InputText v-model="value" placeholder="Recipient" />
    <Button label="Submit" @click="transferFunds" />
</template>


<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import { MultiAddress, roc } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec } from "polkadot-api/chains/rococo_v2_2";
import { startFromWorker } from "polkadot-api/smoldot/from-worker";
import SmWorker from "polkadot-api/smoldot/worker?worker";
import { store } from '../store';

const smoldot = startFromWorker(new SmWorker());
const chain = await smoldot.addChain({ chainSpec });

const value = ref();

console.log(store.selectedAccount);

// Connect to the polkadot relay chain.
const client = createClient(
    getSmProvider(chain)
);

const typedApi = client.getTypedApi(roc);

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