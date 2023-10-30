const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');

const app = express();

// sample data
let usersList = [
    {id: "1", name: "John", email: "john@example.com"},
    {id: "2", name: "James", email: "james@example.com"},
    {id: "3", name: "Michael", email: "michael@example.com"},
]

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        // to get all users
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return usersList;
            }
        },
        // to get user by id
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return usersList.find(user => user.id === args.id);
            }
        }
    }
});

const schema = new GraphQLSchema({query: RootQuery});

app.use('/graphql', graphqlHTTP({schema, graphiql: true}));

app.listen(5000, () => {
    console.log('Server Running');
});
