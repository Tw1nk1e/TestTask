const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');

const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const url = 'https://www.cbr-xml-daily.ru/daily_json.js';

const getData = async url => {
    let data;

    try {
        const response = await axios.get(url);
        data = response.data;
    } catch (error) {
        console.log(error);
        return error;
    }

    return data;
};

function getCalculate(cart, usdValue, eurValue) {
    let sumRUB = 0;

    const getSum = (item) => {
        return item.quantity * item.price
    };

    cart.forEach(i => {
        if (i.currency === "RUB") {
            sumRUB += getSum(i);
        } else if(i.currency === "EUR") {
            sumRUB += getSum(i) * eurValue;
        } else if(i.currency === "USD") {
            sumRUB += getSum(i) * usdValue;
        }
    });

    return {
        RUB: sumRUB,
        USD: sumRUB / usdValue,
        EUR: sumRUB / eurValue,
    };
}

app.post('/cart-calculate', (req, res) => {
    const cart = req.body.cart;

    getData(url).then(d => {
        const usdValue = d.Valute.USD.Value;
        const eurValue = d.Valute.EUR.Value;

        res.send(getCalculate(cart, usdValue, eurValue));
    }).catch(() => {
            res.sendStatus(404);
        });

});

app.listen(port, function() {
    console.log("Runnning on " + port);
});

module.exports = app;
