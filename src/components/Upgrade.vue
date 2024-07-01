<script setup lang="ts">
import { ref } from 'vue';
import Extrinsic from './Extrinsic.vue';
import InputText from 'primevue/inputtext';
import { roc } from '@polkadot-api/descriptors';
import { store } from '../store';
import { Binary } from 'polkadot-api';
const rpCurl = ref("wss://rpc.web3educhain.xyz:443");
const typedApi = store.client.getTypedApi(roc);
const call = typedApi.tx.System.remark({ remark: Binary.fromText("hi") });

</script>

<template>
    <div>
        <h2>Upgrade Parachain</h2>
    </div>
    <div class="col">
        <label for="username">RPC URL</label>
        <InputText id="username" v-model="rpCurl" />
    </div>
    <div class="col">
        <Extrinsic :call="call" :batch="false" />
    </div>
</template>