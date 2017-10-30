export default `
  type Story {
    id: ID!
    type: String!
    title: String!
    link: String
    text: String
    commentCount: Int!
    comments: [Comment]
    votes: [String]
    createdAt: String!
    createdBy: String!
    createdByName: String!
  }
  type Comment {
    id: ID!
    parentId: ID!
    storyId: ID!
    text: String!
    replies: [Comment]
    createdAt: String!
    createdBy: String!
    createdByName: String
    level: Int
  }
  type User {
    id: ID!
    name: String
    createdAt: String
  }
  type Query {
    comments(first: Int!, offset: Int): [Comment]
    comment(id: ID!): Comment
    stories(type: String, first: Int!, offset: Int): [Story]
    story(id: ID!): Story
    user(id: ID, name: String): User
  }
`
