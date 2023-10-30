const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {  } = require('graphql');

const app = express();

app.listen(5000, () => {
    console.log('Server Running');
});
