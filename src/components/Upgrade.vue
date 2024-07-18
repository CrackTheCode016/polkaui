<script setup lang="ts">
import { ref } from 'vue';
import Extrinsic from './Extrinsic.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { roc } from '@polkadot-api/descriptors';
import { store } from '../store';
import { Binary, FixedSizeBinary } from 'polkadot-api';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import { stringToHex } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';
const rpCurl = ref("wss://rpc.web3educhain.xyz:443");
const typedApi = store.relayClient.getTypedApi(roc);
const loadedRuntime = ref(false);
const runtime = ref();
const hash = ref("");
const runtimeCode = ref("");

const process = async () => {
    const file: File = runtime.value.files[0];
    const code = await file.text();
    const buffer = await file.arrayBuffer();
    hash.value = blake2AsHex(new Uint8Array(buffer));
    runtimeCode.value = stringToHex(code);
    loadedRuntime.value = true;
};

</script>

<template>
    <div>
        <h2>Upgrade Parachain</h2>
    </div>
    <div class="grid">
        <Card class="col">
            <template #content>
                <div class="flex flex-column">
                    <br>
                    <FileUpload ref="runtime" :show-upload-button="false">
                        <template #empty>
                            <span>Drag and drop your compressed runtime here.</span>
                        </template>
                    </FileUpload>
                    <Button  v-if="!loadedRuntime" label="Process" @click="process" severity="secondary" />
                </div>
                <br>
                <div class="flex justify-content-between w-10rem" v-if="loadedRuntime">
                    <Extrinsic :para="true" :call='typedApi.tx.System.authorize_upgrade({ code_hash: FixedSizeBinary.fromHex(hash) })' :batch="false" text="Authorize Upgrade" />
                    <Extrinsic :para="true" :call='typedApi.tx.System.apply_authorized_upgrade({ code: Binary.fromHex(runtimeCode) })' :batch="false" text="Apply Upgrade" />
                </div>
            </template>
        </Card>
    </div>
</template>