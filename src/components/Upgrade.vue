<script setup lang="ts">
import { ref } from 'vue';
import Extrinsic from './Extrinsic.vue';
import InputText from 'primevue/inputtext';
import { roc } from '@polkadot-api/descriptors';
import { store } from '../store';
import { Binary } from 'polkadot-api';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
const rpCurl = ref("wss://rpc.web3educhain.xyz:443");
const typedApi = store.client.getTypedApi(roc);
const call = typedApi.tx.System.remark({ remark: Binary.fromText("hi") });
const authorizeExt = typedApi.tx.System.authorize_upgrade({ remark: Binary.fromText("hi") });

function onUpload(event: any) {
    console.log(event)
}
</script>

<template>
    <div>
        <h2>Upgrade Parachain</h2>
    </div>
    <div class="grid">
        <Card class="col">
            <template #title>RPC URL</template>
            <template #content>
                <div class="flex flex-column">
                    <InputText id="username" v-model="rpCurl" />
                    <br>
                    <FileUpload :show-upload-button="false">
                        <template #empty>
                            <span>Drag and drop your compressed runtime here.</span>
                        </template>
                    </FileUpload>
                </div>
                <br>
                <Extrinsic :call="call" :batch="false" />
            </template>
        </Card>
    </div>
</template>