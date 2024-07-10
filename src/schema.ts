export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String
    content: String!
    author: User
    createdAt: String! 
    published: Boolean!
  }

  type Profile {
    id: ID!
    bio: String
    createdAt: String! 
    user: User
  }

  type AuthResponse {
    user: User
    token: String
    message: String
  }

  type Query {
    user(userId: String): User
    users: [User]
    posts: [Post]
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthResponse
    login(email: String!, password: String!): AuthResponse 
  }
`;
