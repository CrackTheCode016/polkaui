import { connectInjectedExtension } from 'polkadot-api/pjs-signer';
import { reactive } from 'vue'

const pjs = await connectInjectedExtension("polkadot-js");
const pJsaccounts = pjs.getAccounts();

export const store = reactive({
  pjsAccounts: pJsaccounts,
  selectedAccount: pJsaccounts[0]
})