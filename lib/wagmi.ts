import { createConfig, http } from 'wagmi';

import { sagaNetwork } from './privy';

export const wagmiConfig = createConfig({
    chains: [sagaNetwork],
    transports: {
        [sagaNetwork.id]: http(sagaNetwork.rpcUrls.default.http[0]),
    },
});
