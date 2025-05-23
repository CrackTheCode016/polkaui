<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import Chip from 'primevue/chip';
import SelectButton from 'primevue/selectbutton';
import { onBeforeMount, ref } from "vue";
import { educhainRpc, modifyParaClientInStore, store } from '../store';
import { edu, paseo } from "@polkadot-api/descriptors"
import { formatBalance } from "@polkadot/util";

const items = ref([
    {
        label: 'Stats',
        route: '/',
    },
    {
        label: 'Upgrade',
        route: '/upgrade',

    },
    {
        label: 'Produce Blocks',
        route: '/ondemand',
    }
]);

const chain = ref('EduChain');
const options = ref(['EduChain', 'Local']);

const accounts = ref(store.pjsAccounts);
const relayTypedApi = store.relayClient.getTypedApi(paseo);
const paraTypedApi =  store.paraClient.getTypedApi(edu);
const ticker = ref("PAS");
const paraTicker = ref("EDU");
const balanceFormatOptions = { withUnit: false, withZeros: false, decimals: 12 };
let balance = ref("");
let paraBalance = ref("");

onBeforeMount(async () => {
    await assignBalance();
    store.loading = false;
});

async function assignBalance() {
    const paraAccountInfo = await paraTypedApi.query.System.Account.getValue(store.selectedAccount.address);
    const accountInfo = await relayTypedApi.query.System.Account.getValue(store.selectedAccount.address);
    balance.value = formatBalance(accountInfo.data.free, balanceFormatOptions).replace(' ', '');
    paraBalance.value = formatBalance(paraAccountInfo.data.free, balanceFormatOptions).replace(' ', '');
}

function switchNetworks() {
    if (chain.value == 'EduChain') {
        modifyParaClientInStore(educhainRpc);
    } else if (chain.value == 'Local') {
        modifyParaClientInStore("ws://127.0.0.1:8833");
    } else {
        // Default to EduChain for now
        modifyParaClientInStore(educhainRpc);
    }
}

</script>

<template>
    <Menubar :model="items">
        <template #start>
            <h3 class="logo">PolkaUI</h3>
        </template>
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </router-link>
        </template>
        <template #end>
            <div class="flex">
                <div>
                    <SelectButton v-on:change="switchNetworks()" v-model="chain" :options="options" />
                </div>
                <div class="flex ml-2">
                    <Chip class="mr-2">
                        <i v-if="store.loading" class="pi pi-spin pi-spinner"
                            style="font-size: 1rem; color: 'var(--p-primary-color)'"></i>
                        <div class="flex" v-else>
                            <span class="mr-2 ml-2 font-small">{{ balance == "" ? "Loading" : balance }}</span>
                            <Badge :value="ticker"></Badge>
                        </div>
                    </Chip>
                    <Chip class="mr-2">
                        <i v-if="store.loading" class="pi pi-spin pi-spinner"
                            style="font-size: 1rem; color: 'var(--p-primary-color)'"></i>
                        <div class="flex" v-else>
                            <span class="mr-2 ml-2 font-small">{{ paraBalance == "" ? "Loading" : paraBalance }}</span>
                            <Badge severity="success" :value="paraTicker"></Badge>
                        </div>
                    </Chip>
                    <Dropdown v-model="store.selectedAccount" :options="accounts" optionLabel="name"
                        @change="() => assignBalance()" placeholder="Select account" class="w-full md:w-[14rem]" />
                </div>
            </div>
        </template>
    </Menubar>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap');

h3 {
    font-family: 'Unbounded', Inter, system-ui;
}
</style>