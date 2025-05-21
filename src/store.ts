import { connectInjectedExtension, getInjectedExtensions } from 'polkadot-api/pjs-signer';
import { reactive } from 'vue'
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec as rococo } from "polkadot-api/chains/rococo_v2_2";
import { startFromWorker } from "polkadot-api/smoldot/from-worker";
import SmWorker from "polkadot-api/smoldot/worker?worker";
import { WebSocketProvider } from 'polkadot-api/ws-provider/web';
import { useToast } from "primevue/usetoast";

// Took from here: https://github.com/polkadot-api/polkadot-api/blob/766cd5686b2ec4d07c82015071eddc6f54c98515/examples/vite/src/main.ts#L21C1-L22C50
while (!getInjectedExtensions()?.includes("polkadot-js"))
  await new Promise((res) => setTimeout(res, 50))

const pjs = await connectInjectedExtension("polkadot-js");
const pJsaccounts = pjs.getAccounts();
export const educhainRpc: string = "wss://rpc.web3educhain.xyz:443";

const smoldot = startFromWorker(new SmWorker());
const relay = await smoldot.addChain({ chainSpec: rococo });
const relayClient = createClient(
  getSmProvider(relay)
);

export const createParaClient = (rpc: string) => {
  const jsonRpcProvider = WebSocketProvider(rpc)
  return createClient(
    jsonRpcProvider
  );
};

export const store = reactive({
  loading: true,
  relayClient,
  paraClient: createParaClient(educhainRpc),
  pjsAccounts: pJsaccounts,
  selectedAccount: pJsaccounts[0],
})

export const modifyParaClientInStore = (rpc: string) => {
  store.paraClient.destroy();
  store.paraClient = createParaClient(rpc);
}
