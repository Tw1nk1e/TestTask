import React, { useState, Fragment } from 'react';
import {Button, TextField, Select, MenuItem, InputLabel} from '@material-ui/core';

import './App.css';

type Item = {
  name: string;
  quantity: number;
  currency: string;
  price: number;
};

type Currency = 'RUB' | 'USD' | 'EUR';

function renderItem(i: Item) {
  return (
    <div className='item'>
      <p>Name: {i.name}</p>
      <p>Quantity: {i.quantity}</p>
      <p>Price: {i.price}</p>
      <p>Currency: {i.currency}</p>
    </div>
  )
}

function App() {
  const [isAddMode, setMode] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  const [cart, setCart] = useState<Item[]>([]);

  const [name, setName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [currency, setCurrency] = useState<Currency>('RUB');
  const [price, setPrice] = useState<number>(1);

  const validateCart = () => {
    const isValid = name && quantity && currency && price;

    if (!isValid) {
      setError(true)
    }

    return isValid;
  };

  const resetInputForm = () => {
    setName('');
    setQuantity(0);
    setCurrency('RUB');
    setPrice(0);
    setError(false);
  };

  const onCancel = () => {
    setMode(false);
    resetInputForm();
  };

  const prepairItem = (): Item => {
    return {
      name,
      currency,
      quantity,
      price
    }
  };

  const addCartItem = () => {
    if (validateCart()) {
      setCart([...cart, prepairItem()]);
      setError(false);
      resetInputForm();
    }
  };

  const onChangeNumber = (type: string, value: number) => {
    if (value > 0) {
      type === 'price' ? setPrice(value) : setQuantity(value);
    }
  };

  return (
    <div className='app'>

      <div className="control-container">
        <Button color="primary" variant="contained" disabled={isAddMode} onClick={() => setMode(true)}>
          Add product
        </Button>

        {isAddMode && (
          <Fragment>

            <div className="input-container">
              <InputLabel>Name</InputLabel>
              <TextField
                value={name}
                className='custom-input'
                onChange={(e) => setName(e.target.value)}
              />
              <InputLabel>Quantity</InputLabel>
              <TextField
                type='number'
                value={quantity}
                className='custom-input'
                onChange={(e) => onChangeNumber('quantity', Number(e.target.value))}
              />
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                className='custom-input'
                onChange={(e) => setCurrency(e.target.value as Currency)}
              >
                <MenuItem value="RUB">RUB</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </Select>
              <InputLabel>Price</InputLabel>
              <TextField
                type='number'
                value={price}
                onChange={(e) => onChangeNumber('price', Number(e.target.value))}
              />
            </div>

            <Button variant="contained" color="primary" onClick={addCartItem}>
              Add
            </Button>

            <Button color="secondary" variant="contained" onClick={onCancel}>
              Cancel
            </Button>

            {isError && <p className='error'>Check that all fields are entered correctly</p>}

          </Fragment>
        )}
      </div>

      <div className="cart-container">
        {cart.map((i: Item) => {
          return renderItem(i)
        })}
      </div>

    </div>
  );
}

export default App;
