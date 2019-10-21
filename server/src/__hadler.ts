import { ApolloServer, gql } from "apollo-server-lambda";
import uuidv4 from "uuid/v4";

import { scanItems, updateItem } from "./dynamodb";

const typeDefs = gql`
    type Vote {
        voteId: String!
        createdAt: String
        isHotDogTaco: Boolean
    }

    type Query {
        allVotes: [Vote]
    }

    type Mutation {
        vote(isHotDogTaco: Boolean!): Vote
    }
`;

const resolvers = {
    Query: {
        allVotes: async () => {
            const result = await scanItems({});

            return result.Items;
        }
    },

    Mutation: {
        vote: async (_: any, { isHotDogTaco }: { isHotDogTaco: boolean }) => {
            const voteId = uuidv4();
            const createdAt = new Date().toISOString();

            const result = await updateItem({
                Key: { voteId },
                UpdateExpression:
                    "SET createdAt = :createdAt, isHotDogTaco = :isHotDogTaco",
                ExpressionAttributeValues: {
                    ":createdAt": createdAt,
                    ":isHotDogTaco": isHotDogTaco
                },
                ReturnValues: "ALL_NEW"
            });
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

export const graphql = server.createHandler({
    cors: {
        origin: "*",
        credentials: true
    }
});
