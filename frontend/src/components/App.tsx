import React, { useState, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  IconButton
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';

import './App.css';
import text from "../constants";

type CartSum = {
  RUB: number;
  USD: number;
  EUR: number;
}

type Item = {
  id: string;
  name: string;
  quantity: number;
  currency: string;
  price: number;
};

type Currency = 'RUB' | 'USD' | 'EUR';

const initialCartSum = {
  RUB: 0,
  USD: 0,
  EUR: 0,
};

const url = 'http://localhost:3001/cart-calculate';

function App() {
  const [isAddMode, setMode] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [isNetworkError, setNetworkError] = useState<boolean>(false);

  const [isLoading, setLoading] = useState<boolean>(false);

  const [cart, setCart] = useState<Item[]>([]);
  const [cartSum, setCartSum] = useState<CartSum>(initialCartSum);

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
    setQuantity(1);
    setCurrency('RUB');
    setPrice(1);
    setError(false);
  };

  const onCancel = () => {
    setMode(false);
    resetInputForm();
  };

  const prepareItem = (): Item => {
    return {
      id: uuidv4(),
      name,
      currency,
      quantity,
      price
    }
  };

  const onAddItem = () => {
    if (validateCart()) {
      setCart([...cart, prepareItem()]);
      setError(false);
      resetInputForm();
    }
  };

  const onClearCart = () => {
    setCart([]);
    setCartSum(initialCartSum);
  };

  const onDeleteItem = (id: string) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart([...newCart]);
  };

  const onCalculate = () => {
    if (!!cart.length) {
      setLoading(true);
      setNetworkError(false);

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart
        })
      };

      fetch(url, requestOptions)
        .then(res => res.json())
        .then(data => {
          setCartSum(data);
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
          setNetworkError(true);
        })
    }
  };

  const onChangeNumber = (type: string, value: string) => {
    const numbers = Number(value);

    if (numbers > 0) {
      type === 'price'
        ? setPrice(numbers)
        : setQuantity(Number(value.replace(/[^\d]/g, "")));
    }
  };

  return (
    <div className='app'>

      <div className="control-container">
        <Button color="primary" variant="contained" disabled={isAddMode} onClick={() => setMode(true)}>
          {text.addItem}
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
                onChange={(e) => onChangeNumber('quantity', e.target.value)}
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
                onChange={(e) => onChangeNumber('price', e.target.value)}
              />
            </div>

            <Button variant="contained" color="primary" onClick={onAddItem}>
              {text.add}
            </Button>

            <Button color="secondary" variant="contained" onClick={onCancel}>
              {text.cancel}
            </Button>

            {isError && <Typography className="error" variant="h5">{text.notValidForm}</Typography>}
            {isNetworkError && <Typography className="error"  variant="h5">{text.networkError}</Typography>}

          </Fragment>
        )}
      </div>

      <div className="cart-container">
        {!!cart.length ? (
          <Fragment>
            <div className="cart-sum-container">
              <div>
                <Typography variant="h6">Total cost</Typography>
                <Typography variant="subtitle1">RUB: {cartSum.RUB.toFixed(2)}</Typography>
                <Typography variant="subtitle1">USD: {cartSum.USD.toFixed(2)}</Typography>
                <Typography variant="subtitle1">EUR: {cartSum.EUR.toFixed(2)}</Typography>
              </div>
              <div className="cart-sum-controls">
                <Button disabled={isLoading} variant="contained" color="primary" onClick={onCalculate}>
                  {text.calc}
                </Button>
                <Button disabled={isLoading} variant="contained" color="secondary" onClick={onClearCart}>
                  {text.clear}
                </Button>
              </div>
            </div>

            <div className="cart-grid">
              {cart.map((i: Item) => {
                return (
                  <div key={i.id} className='item'>
                    <IconButton
                      className="delete-button"
                      aria-label="upload picture"
                      component="span"
                      onClick={() => onDeleteItem(i.id)}
                    >
                      <Delete />
                    </IconButton>
                    <Typography variant="subtitle1">Name: {i.name}</Typography>
                    <Typography variant="subtitle1">Quantity: {i.quantity}</Typography>
                    <Typography variant="subtitle1">Price: {i.price}</Typography>
                    <Typography variant="subtitle1">Currency: {i.currency}</Typography>
                  </div>
                )
              })}
            </div>
          </Fragment>
        ) : (
            <Typography variant="h2" className="empty-card">
              {text.emptyCard}
            </Typography>
        )}
      </div>

    </div>
  );
}

export default App;
