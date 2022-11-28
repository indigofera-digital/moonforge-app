import './App.css';
import { Link, ImmutableXClient, ImmutableMethodResults, ProviderPreference} from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
import Marketplace from './Marketplace';
import Inventory from './Inventory';
import Bridging from './Bridging';
import Collections from './Collections';
import CollectionBuilder from './CollectionBuilder';
import { ethers } from 'ethers';
import { ImmutableX, Config, BalancesApiGetBalanceRequest, Balance } from '@imtbl/core-sdk';

require('dotenv').config();

const App = () => {
  // initialise Immutable X Link SDK
  const link = new Link(process.env.REACT_APP_SANDBOX_LINK_URL)
  
  // general
  // const [tab, setTab] = useState('marketplace');
  const [tab, setTab] = useState('collections');
  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState<Balance>(Object);
  // const [balance, setBalance] = useState('');
  // const [client, setClient] = useState<ImmutableXClient>(Object);
  const [client, setClient] = useState<ImmutableX>(Object);

  const [custodyUser, setCustodyUser] = useState('');

  useEffect(() => {
    buildIMX()
  }, [])

  // initialise an Immutable X Client to interact with apis more easily
  async function buildIMX() {
    // const publicApiUrl: string = process.env.REACT_APP_SANDBOX_ENV_URL ?? '';
    // setClient(await ImmutableXClient.build({ publicApiUrl }))
    
    const config = Config.SANDBOX; // Or PRODUCTION or ROPSTEN
    const client = new ImmutableX(config);
    setClient(client);

  }

  // register and/or setup a user
  async function linkSetup(): Promise<void> {
    const res = await link.setup({ providerPreference: ProviderPreference.NONE });
    setWallet(res.address)
    // setBalance(await client.getBalance({user: res.address, tokenAddress: 'eth'}))
    // setBalance(await client.getBalance({ user: res.address, tokenAddress: 'eth' }));
    
    const balance = await client.getBalance({ owner: res.address, address: 'eth' });
    setBalance(balance);
  };
  
  async function custodyLogin() {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({login: custodyUser})
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_MOONFORGE_WALLET_API}/account`, requestOptions);
      const data = await response.json();
      setWallet(data.publicAddress);

      const balance = await client.getBalance({ owner: data.publicAddress, address: 'eth' });
      setBalance(balance);
    }
    catch (e) {
      console.log(e);
    }
  }

  function handleTabs() {
    if (client) {
      switch (tab) {
        case 'collections':
          // if (wallet === 'undefined') return <div>Connect wallet</div>
          return <Collections
            // client={client}
            // link={link}
            wallet={wallet}
          />
        case 'collectionBuilder':
          // if (wallet === 'undefined') return <div>Connect wallet</div>
          return <CollectionBuilder
            // client={client}
            // link={link}
            // wallet={wallet}
          />
        case 'inventory':
          if (wallet === 'undefined') return <div>Connect wallet</div>
          return <Inventory
            client={client}
            link={link}
            wallet={wallet}
          />
        // case 'bridging':
        //   if (wallet === 'undefined') return <div>Connect wallet</div>
        //   return <Bridging
        //     client={client}
        //     link={link}
        //     wallet={wallet}
        //   />
        // default:
        //   return <Marketplace
        //     client={client}
        //     link={link}
        //   />
      }
    }
    return null
  }

  return (
    <div className="App">
      <button onClick={linkSetup}>Non-Custody</button>
      <button onClick={custodyLogin}>Custody Login</button>
      <input type="text" placeholder='username/email/phone' value={custodyUser} onChange={e => setCustodyUser(e.target.value)} />
      <div>
        Active wallet: {wallet}
      </div>
      <div>
        ETH balance (in wei): {balance?.balance?.toString()}
      </div>
      <button onClick={() => setTab('collections')}>Collections</button>
      <button onClick={() => setTab('collectionBuilder')}>Collection Builder</button>
      {/* <button onClick={() => setTab('marketplace')}>Marketplace</button> */}
      <button onClick={() => setTab('inventory')}>Inventory</button>
      {/* <button onClick={() => setTab('bridging')}>Deposit and withdrawal</button> */}
      <br/><br/><br/>
      {handleTabs()}
    </div>
  );
}

export default App;
