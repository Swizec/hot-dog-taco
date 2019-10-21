"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_lambda_1 = require("apollo-server-lambda");
const v4_1 = __importDefault(require("uuid/v4"));
const dynamodb_1 = require("./dynamodb");
const typeDefs = apollo_server_lambda_1.gql `
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
            const result = await dynamodb_1.scanItems({});
            return result.Items;
        }
    },
    Mutation: {
        vote: async (_, { isHotDogTaco }) => {
            const voteId = v4_1.default();
            const createdAt = new Date().toISOString();
            const result = await dynamodb_1.updateItem({
                Key: { voteId },
                UpdateExpression: "SET createdAt = :createdAt, isHotDogTaco = :isHotDogTaco",
                ExpressionAttributeValues: {
                    ":createdAt": createdAt,
                    ":isHotDogTaco": isHotDogTaco
                },
                ReturnValues: "ALL_NEW"
            });
        }
    }
};
const server = new apollo_server_lambda_1.ApolloServer({
    typeDefs,
    resolvers
});
exports.graphql = server.createHandler({
    cors: {
        origin: "*",
        credentials: true
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX19oYWRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvX19oYWRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrREFBeUQ7QUFDekQsaURBQTZCO0FBRTdCLHlDQUFtRDtBQUVuRCxNQUFNLFFBQVEsR0FBRywwQkFBRyxDQUFBOzs7Ozs7Ozs7Ozs7OztDQWNuQixDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUc7SUFDZCxLQUFLLEVBQUU7UUFDSCxRQUFRLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDakIsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRW5DLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QixDQUFDO0tBQ0o7SUFFRCxRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsS0FBSyxFQUFFLENBQU0sRUFBRSxFQUFFLFlBQVksRUFBNkIsRUFBRSxFQUFFO1lBQ2hFLE1BQU0sTUFBTSxHQUFHLFlBQU0sRUFBRSxDQUFDO1lBQ3hCLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFM0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxxQkFBVSxDQUFDO2dCQUM1QixHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUU7Z0JBQ2YsZ0JBQWdCLEVBQ1osMERBQTBEO2dCQUM5RCx5QkFBeUIsRUFBRTtvQkFDdkIsWUFBWSxFQUFFLFNBQVM7b0JBQ3ZCLGVBQWUsRUFBRSxZQUFZO2lCQUNoQztnQkFDRCxZQUFZLEVBQUUsU0FBUzthQUMxQixDQUFDLENBQUM7UUFDUCxDQUFDO0tBQ0o7Q0FDSixDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQ0FBWSxDQUFDO0lBQzVCLFFBQVE7SUFDUixTQUFTO0NBQ1osQ0FBQyxDQUFDO0FBRVUsUUFBQSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUN4QyxJQUFJLEVBQUU7UUFDRixNQUFNLEVBQUUsR0FBRztRQUNYLFdBQVcsRUFBRSxJQUFJO0tBQ3BCO0NBQ0osQ0FBQyxDQUFDIn0=