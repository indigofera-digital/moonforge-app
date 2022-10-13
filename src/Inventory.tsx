import { ethers } from 'ethers';
import { Link, ImmutableXClient, ImmutableMethodResults, ETHTokenType, ERC721TokenType, MintableERC721TokenType, ImmutableAssetStatus } from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
require('dotenv').config();

declare let window: any;

interface InventoryProps {
  client: ImmutableXClient,
  link: Link,
  wallet: string
}

const Inventory = ({client, link, wallet}: InventoryProps) => {
  const [inventory, setInventory] = useState<ImmutableMethodResults.ImmutableGetAssetsResult>(Object);
  // minting
  const [mintTokenId, setMintTokenId] = useState('');
  const [mintBlueprint, setMintBlueprint] = useState('');
  const [mintTokenIdv2, setMintTokenIdv2] = useState('');
  const [mintBlueprintv2, setMintBlueprintv2] = useState('');

  // buying and selling
  const [sellAmount, setSellAmount] = useState('');
  const [sellTokenId, setSellTokenId] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [forgeTokens, setForgeTokens] = useState('');

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
    setInventory(await client.getAssets({user: wallet, status: ImmutableAssetStatus.imx,  collection: '0x189dDFD68D0C1118A8d5eEA4F72f75490F2e8A77'}))
  };

  // sell an asset
  // async function sellNFT() {
  //   await link.sell({
  //     amount: sellAmount,
  //     tokenId: sellTokenId,
  //     tokenAddress: sellTokenAddress
  //   })
  //   setInventory(await client.getAssets({user: wallet, sell_orders: true}))
  // };

  // cancel sell order
  // async function cancelSell() {
  //   await link.cancel({
  //     orderId: sellCancelOrder
  //   })
  //   setInventory(await client.getAssets({user: wallet, sell_orders: true}))
  // };

  // helper function to generate random ids
  function random()
    : number {
    const min = 1;
    const max = 1000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function openPack() {
    // call backend mint puzzles
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionAddress: collectionAddress,
        receiverAddress: wallet
      })
    };
    const response = await fetch(`${process.env.REACT_APP_MOONFORGE_BACKEND_API}/collections/openPack`, requestOptions);
    const data = await response.json();

    setInventory(await client.getAssets({user: wallet, status: ImmutableAssetStatus.imx}))
  };
  
  async function buyPack() {

    const buyResponse = await link.transfer([
      {
        amount: '0.01',
        type: ETHTokenType.ETH,
        toAddress: '0x5A1E629e0B4C82B321bCDb39CDe46F88C0A011d4',
      },
    ])

    console.log(buyResponse)
    
    // call backend mint puzzles
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionAddress: collectionAddress,
        receiverAddress: wallet
      })
    };
    const response = await fetch(`${process.env.REACT_APP_MOONFORGE_BACKEND_API}/collections/openPack`, requestOptions);
    const data = await response.json();
    
    setInventory(await client.getAssets({user: wallet, status: ImmutableAssetStatus.imx}))
  };

  async function forge() {
    console.log(forgeTokens);
    const burnTokens = forgeTokens.split(',').map(tokenId => {
      return {
        type: ERC721TokenType.ERC721,
        tokenId: tokenId,
        tokenAddress: collectionAddress,
        toAddress: '0x0000000000000000000000000000000000000000',
      }
    })
    console.log(burnTokens);
    await link.transfer(burnTokens);

    // call backend forge complete puzzle
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionAddress: collectionAddress,
        receiverAddress: wallet
      })
    };
    const response = await fetch(`${process.env.REACT_APP_MOONFORGE_BACKEND_API}/collections/forge`, requestOptions);
    const data = await response.json();
    setInventory(await client.getAssets({user: wallet, sell_orders: true}))
  };

  return (
    <div>
      <div>
        <label>
          Collection Address:
          <input type="text" value={collectionAddress} onChange={e => setCollectionAddress(e.target.value)} />
        </label>
        <br/>
        
        <button onClick={openPack}>Open Free Pack</button>
        <button onClick={buyPack}>Buy Pack</button>
      </div>
      <br/>
      <div>
        Forging:
        <br/>
        <label>
          Puzzle pieces:
          <input type="text" value={forgeTokens} onChange={e => setForgeTokens(e.target.value)} />
        </label>
        <button onClick={forge}>Forge</button>
      </div>
      <br/><br/><br/>
      <div>
        Inventory:
        {JSON.stringify(inventory.result)}
      </div>
    </div>
  );
}

export default Inventory;
