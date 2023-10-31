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

const mutations = new GraphQLObjectType({
    name: "mutations",
    fields: {
        // adding a user
        addUser: {
            type: UserType,
            args: {
                name: {type: GraphQLString},
                email: {type: GraphQLString},
            },
            resolve(parent, {name, email}) {
                const newUser = {
                    name,
                    email,
                    id: Date.now().toString()
                }
                usersList.push(newUser);
                return newUser;
            }
        },
        // update a user
        updateUser: {
            type: UserType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
            },
            resolve(parent, {id, name, email}) {
                const user = usersList.find(user => user.id === id);
                user.name = name;
                user.email = email;
                return user;
            }
        },
        // delete a user
        deleteUser: {
            type: UserType,
            args: {
                id: {type: GraphQLID},
            },
            resolve(parent, {id}) {
                const user = usersList.find(user => user.id === id);
                usersList = usersList.filter(user => user.id !== id)
                return user;
            }
        }
});

const schema = new GraphQLSchema({query: RootQuery, mutation: mutations});

app.use('/graphql', graphqlHTTP({schema, graphiql: true}));

app.listen(5000, () => {
    console.log('Server Running');
});
