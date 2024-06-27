import { connectInjectedExtension, getInjectedExtensions } from 'polkadot-api/pjs-signer';
import { reactive } from 'vue'
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec } from "polkadot-api/chains/rococo_v2_2";
import { startFromWorker } from "polkadot-api/smoldot/from-worker";
import SmWorker from "polkadot-api/smoldot/worker?worker";

// Took from here: https://github.com/polkadot-api/polkadot-api/blob/766cd5686b2ec4d07c82015071eddc6f54c98515/examples/vite/src/main.ts#L21C1-L22C50
while (!getInjectedExtensions()?.includes("polkadot-js"))
  await new Promise((res) => setTimeout(res, 50))

const pjs = await connectInjectedExtension("polkadot-js");
const pJsaccounts = pjs.getAccounts();

const smoldot = startFromWorker(new SmWorker());
const chain = await smoldot.addChain({ chainSpec });

const client = createClient(
  getSmProvider(chain)
);

export const store = reactive({
  loading: true,
  client: client,
  pjsAccounts: pJsaccounts,
  selectedAccount: pJsaccounts[0]
})