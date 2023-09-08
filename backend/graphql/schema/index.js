const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}
type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}
type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}
type AuthData{
    userID: ID!
    token: String!
    tokenExpiration: Int!
}
input InputEvent {
    title: String!
    description: String!
    price: Float!
    date: String!
}
input InputUser {
    email: String!
    password: String!
}
input InputBooking {
    title: String!
    password: String!
}

type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!) : AuthData
}
type RootMutation {
    createEvent(inputEvent: InputEvent): Event
    createUser(inputUser: InputUser): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)