// import { ImmutableXClient, ImmutableMethodResults, ImmutableOrderStatus} from '@imtbl/core-sdk';
import { useEffect, useState } from 'react';
require('dotenv').config();

interface CollectionProps {
  wallet: string
}
const Collections = ({wallet}: CollectionProps) => {
  // const [marketplace, setMarketplace] = useState<ImmutableMethodResults.ImmutableGetOrdersResult>(Object);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
    // setMarketplace(await client.getOrders({status: ImmutableOrderStatus.active, user: '0xc120a52ad90bb926bafcdfc9161740dcf4a2cea1'}))
    setCollections(await getCollections());
  };

  async function getCollections() {
    const response = await fetch(`${process.env.REACT_APP_MOONFORGE_BACKEND_API}/collections`);
    const data = await response.json();
    return data;

  }

  async function claimPrize(address: string) {
    console.log('prinz', address);
    console.log('wallet', wallet);
    // call backend mint puzzles
    if (!wallet) {
      alert('Please connect your wallet to get prize');
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionAddress: address,
        receiverAddress: wallet
      })
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_MOONFORGE_BACKEND_API}/claimPrize`, requestOptions);
      const data = await response.json();
      console.log(data);
      alert(`Prize claimed! Got NFT id: ${data.results[0].token_id}`);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <div>
        <br />
        Collections:
        <br />
        <table>
        <tbody>

          {/* {JSON.stringify(collections) } */}
          {collections.map(col => (

            // <img src={col['imageUrl']} alt="ssa" width="200px" height="200pxpx"/>
            <tr key={col['address']}>
              <td><img src={col['imageUrl']} alt="ssa" width="200px" height="200pxpx" /></td>
              <th scope="row">{col['name']}</th>
              <th scope="row">{col['description']}</th>
              <th scope="row">{col['address']}</th>
              <th scope="row"><button onClick={() => claimPrize(col['address'])}>Claim Prize</button></th>
            </tr>
          )) 
              }
        </tbody>
      </table>

      </div>
    </div>
  );
}

export default Collections;
