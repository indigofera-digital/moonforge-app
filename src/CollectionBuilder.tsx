// import { Link, ImmutableXClient, ImmutableMethodResults, ImmutableOrderStatus} from '@imtbl/imx-sdk';
import { useEffect, useState, useReducer, ChangeEvent } from 'react';
import { v4 as uuidv4 } from "uuid";

require('dotenv').config();

const CollectionBuilder = () => {
  // const [marketplace, setMarketplace] = useState<ImmutableMethodResults.ImmutableGetOrdersResult>(Object);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [symbol, setSymbol] = useState('');
  const [brand, setBrand] = useState('Test Company');

  const [nftList, setnftList] = useState([
		{
			name: "Voucher 10%",
			description: "Some bullshit discount",
			image: "",
			attributes: [],
			quantity: 10,
			id: uuidv4(),
		},
	])

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
    // setMarketplace(await client.getOrders({status: ImmutableOrderStatus.active, user: '0xc120a52ad90bb926bafcdfc9161740dcf4a2cea1'}))
  };

//handle email row change
  const handleMemberChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    //find the index to be changed
    const index = nftList.findIndex((m) => m.id === id)

    let _nftList = [...nftList] as any
    if (event.target.name === "quantity") {
      _nftList[index][event.target.name] = Number(event.target.value)
    } else {
      _nftList[index][event.target.name] = event.target.value
    }
    setnftList(_nftList)
  }

  //handle invitation for members
  async function createCollection() {
    const collectionPayload = {
      name: collectionName,
      description: collectionDescription,
      symbol: symbol,
      clientName: brand,
      prizes: nftList
    };
    
    console.log(collectionPayload);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectionPayload)
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_MOONFORGE_BACKEND_API}/collections`, requestOptions);
      const data = await response.json();
      console.log(data);
      alert('Collection created');
    }
    catch (e) {
      console.log(e);
    }
	}

  //add new form field for adding member
	const addMemberRow = () => {
		//Todo generate random id

		let _nftList = [...nftList]
		_nftList.push({
			name: "",
			description: "",
			image: "",
			attributes: [],
			quantity: 1,
			id: uuidv4(),
		})
		setnftList(_nftList)
  }
  
  const removeMemberRow = (id: string) => {
		//Todo generate random id

		let _nftList = [...nftList]
		_nftList = _nftList.filter((member) => member.id !== id)
		setnftList(_nftList)
	}

  return (
    <div>
      Collection wizard:
      <br/><input type="text" placeholder='Collection Name' value={collectionName} onChange={e => setCollectionName(e.target.value)} />
      <br/><input type="text" placeholder='Description' value={collectionDescription} onChange={e => setCollectionDescription(e.target.value)} />
      <br/><input type="text" placeholder='Symbol' value={symbol} onChange={e => setSymbol(e.target.value)} />
      <br/><input type="text" disabled value={brand} onChange={e => setBrand(e.target.value)} />
      <br /><br />
      NFT Prizes:
      <div className="invite-member">
        { JSON.stringify(nftList)   }
          {nftList.map((member) => (
            <div className="form-row" key={member.id}>
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  name="name"
                  type="text"
                  onChange={(e) => handleMemberChange(member.id, e)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="description">Description</label>
                <input
                  name="description"
                  type="text"
                  onChange={(e) => handleMemberChange(member.id, e)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  onChange={(e) => handleMemberChange(member.id, e)}
                />
              </div>
              {nftList.length > 1 && (
                <button onClick={() => removeMemberRow(member.id)}>-</button>
              )}

              <button onClick={addMemberRow}>+</button>
            </div>
          ))}

          <button className="btn-primary" onClick={createCollection}>
            {" "}
            Create Collection
          </button>
        </div>
      </div>
  );
}

export default CollectionBuilder;
