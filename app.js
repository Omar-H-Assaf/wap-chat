const express = require('express');
const app = express();

app.listen(80, () => {
    console.log('Your Server is running on 80');
})

//Read the parameters from post request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
