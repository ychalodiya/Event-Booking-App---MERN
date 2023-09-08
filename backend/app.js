const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/isAuth')
const mongoose = require('mongoose');
const { header } = require('express/lib/request');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method == 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphqlHTTP
({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));

// Connecting with database
mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster0.plm5ef9.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err); 
    });

