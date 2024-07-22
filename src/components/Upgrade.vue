<script setup lang="ts">
import { ref } from 'vue';
import Extrinsic from './Extrinsic.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { edu, roc, testchain } from '@polkadot-api/descriptors';
import { store } from '../store';
import { Binary, FixedSizeBinary } from 'polkadot-api';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import { stringToHex } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';


enum UpgradeProcess {
    AU,
    RCR,
    UA,
}

const typedApi = store.paraClient.getTypedApi(testchain);
const loadedRuntime = ref(false);
const runtime = ref();
const hash = ref("");
const runtimeCode = ref("");
const steps = ref([
    {
        key: UpgradeProcess.AU,
        step: "Authorize Upgrade",
        status: "Pending"
    },
    {
        key: UpgradeProcess.RCR,
        step: "Relay Chain Recognized",
        status: "Pending"
    },
    {
        key: UpgradeProcess.UA,
        step: "Upgrade Applied",
        status: "Pending"
    }
]);

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
                    <FileUpload ref="runtime" :show-upload-button="false" v-on:remove="(_) => loadedRuntime = false">
                        <template #empty>
                            <span>Drag and drop your compressed runtime here.</span>
                        </template>
                    </FileUpload>
                    <Button v-if="!loadedRuntime" label="Process" @click="process" severity="secondary" />
                </div>
                <br>

                <div v-if="loadedRuntime" class="flex justify-content-between">
                    <div class="flex flex-column align-items-start">
                        <Extrinsic :para="true"
                            :call='typedApi.tx.Sudo.sudo({ call: typedApi.tx.System.authorize_upgrade({ code_hash: FixedSizeBinary.fromHex(hash) }).decodedCall })'
                            :batch="false" text="Authorize Upgrade" />
                        <br />
                        <Extrinsic :para="true"
                            :call='typedApi.tx.Sudo.sudo({ call: typedApi.tx.System.apply_authorized_upgrade({ code: Binary.fromHex(runtimeCode) }).decodedCall })'
                            :batch="false" text="Apply Upgrade" />
                    </div>

                    <div class="ml-2 w-7">
                        <Card>
                            <template #content>
                                <DataTable :value="steps" tableStyle="min-width: 50rem">
                                    <Column field="step" header="Step"></Column>
                                    <Column field="status" header="Status"></Column>
                                </DataTable>
                            </template>
                        </Card>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>