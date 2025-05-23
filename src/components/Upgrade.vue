<script setup lang="ts">
import { ref } from 'vue';
import Extrinsic from './Extrinsic.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { edu, testchain } from '@polkadot-api/descriptors';
import { store } from '../store';
import { Binary, FixedSizeBinary } from 'polkadot-api';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { stringToHex } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

enum UpgradeProcess {
    AU,
    UA,
}

enum UpgradeStatus {
    PENDING = "Pending",
    FINISHED = "Finished",
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
        status: UpgradeStatus.PENDING
    },
    {
        key: UpgradeProcess.UA,
        step: "Upgrade Applied",
        status: UpgradeStatus.PENDING
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

const updateStatus = (step: UpgradeProcess) => {
    if (step == UpgradeProcess.AU) {
        steps.value[0].status = UpgradeStatus.FINISHED
    } else if (step == UpgradeProcess.UA) {
        steps.value[1].status = UpgradeStatus.FINISHED
    }
}

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
                    <FileUpload ref="runtime" :show-upload-button="false" v-on:remove="(_) => loadedRuntime = false"
                        :show-cancel-button="false">
                        <template #empty>
                            <span>Drag and drop your compressed runtime here.</span>
                        </template>
                    </FileUpload>
                    <Button v-if="!loadedRuntime" label="Process" @click="process"
                        severity="secondary" />
                </div>
                <br>

                <div v-if="loadedRuntime" class="flex justify-content-between">
                    <div class="flex flex-column align-items-start">
                        <Extrinsic :para="true" @finalized="updateStatus(UpgradeProcess.AU)"
                            :call='typedApi.tx.Sudo.sudo({ call: typedApi.tx.System.authorize_upgrade({ code_hash: FixedSizeBinary.fromHex(hash) }).decodedCall })'
                            :batch="false" text="Authorize Upgrade" />
                        <br />
                        <Extrinsic :para="true" @finalized="updateStatus(UpgradeProcess.UA)"
                            :call='typedApi.tx.Sudo.sudo({ call: typedApi.tx.System.apply_authorized_upgrade({ code: Binary.fromHex(runtimeCode) }).decodedCall })'
                            :batch="false" text="Apply Upgrade" />
                    </div>

                    <div class="ml-2 w-7">
                        <p>Hash: {{ hash }}</p>
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