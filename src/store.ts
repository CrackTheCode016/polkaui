import { connectInjectedExtension, getInjectedExtensions } from 'polkadot-api/pjs-signer';
import { reactive } from 'vue'
import { WebSocketProvider } from 'polkadot-api/ws-provider/web';
import { createClient } from 'polkadot-api';

// Took from here: https://github.com/polkadot-api/polkadot-api/blob/766cd5686b2ec4d07c82015071eddc6f54c98515/examples/vite/src/main.ts#L21C1-L22C50
while (!getInjectedExtensions()?.includes("polkadot-js"))
  await new Promise((res) => setTimeout(res, 50))

const pjs = await connectInjectedExtension("polkadot-js");
const pJsaccounts = pjs.getAccounts();
export const educhainRpc: string = "wss://rpc.web3educhain.xyz:443";
export const paseoRpc: string = "wss://paseo.rpc.amforc.com:443";

export const createOnChainClient = (rpc: string) => {
  const jsonRpcProvider = WebSocketProvider(rpc)
  return createClient(
    jsonRpcProvider
  );
};

export const store = reactive({
  loading: true,
  relayClient: createOnChainClient(paseoRpc),
  paraClient: createOnChainClient(educhainRpc),
  pjsAccounts: pJsaccounts,
  selectedAccount: pJsaccounts[0],
})

export const modifyParaClientInStore = (rpc: string) => {
  store.paraClient.destroy();
  store.paraClient = createOnChainClient(rpc);
}
