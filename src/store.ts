import { connectInjectedExtension } from 'polkadot-api/pjs-signer';
import { reactive } from 'vue'
import { createClient, PolkadotClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec } from "polkadot-api/chains/rococo_v2_2";
import { startFromWorker } from "polkadot-api/smoldot/from-worker";
import SmWorker from "polkadot-api/smoldot/worker?worker";

const pjs = await connectInjectedExtension("polkadot-js");
const pJsaccounts = pjs.getAccounts();

const smoldot = startFromWorker(new SmWorker());
const chain = await smoldot.addChain({ chainSpec });
const client = createClient(
  getSmProvider(chain)
);

export const store = reactive({
  client: client,
  pjsAccounts: pJsaccounts,
  selectedAccount: pJsaccounts[0]
})