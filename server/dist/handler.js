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
        isHotDog: Boolean
    }

    type Query {
        allVotes: [Vote]
    }

    type Mutation {
        vote(isHotDog: Boolean): Vote
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
        vote: async (_, { isHotDog }) => {
            const voteId = v4_1.default();
            const createdAt = new Date().toISOString();
            const result = await dynamodb_1.updateItem({
                Key: { voteId },
                UpdateExpression: "SET createdAt = :createdAt, isHotDog = :isHotDog",
                ExpressionAttributeValues: {
                    ":createdAt": createdAt,
                    ":isHotDog": isHotDog
                },
                ReturnValues: "ALL_NEW"
            });
            return result.Attributes;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0RBQXlEO0FBQ3pELGlEQUE2QjtBQUU3Qix5Q0FBbUQ7QUFFbkQsTUFBTSxRQUFRLEdBQUcsMEJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Q0FjbkIsQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFHO0lBQ2QsS0FBSyxFQUFFO1FBQ0gsUUFBUSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2pCLE1BQU0sTUFBTSxHQUFHLE1BQU0sb0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVuQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDeEIsQ0FBQztLQUNKO0lBRUQsUUFBUSxFQUFFO1FBQ04sSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFNLEVBQUUsRUFBRSxRQUFRLEVBQXlCLEVBQUUsRUFBRTtZQUN4RCxNQUFNLE1BQU0sR0FBRyxZQUFNLEVBQUUsQ0FBQztZQUN4QixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRTNDLE1BQU0sTUFBTSxHQUFHLE1BQU0scUJBQVUsQ0FBQztnQkFDNUIsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFO2dCQUNmLGdCQUFnQixFQUNaLGtEQUFrRDtnQkFDdEQseUJBQXlCLEVBQUU7b0JBQ3ZCLFlBQVksRUFBRSxTQUFTO29CQUN2QixXQUFXLEVBQUUsUUFBUTtpQkFDeEI7Z0JBQ0QsWUFBWSxFQUFFLFNBQVM7YUFDMUIsQ0FBQyxDQUFDO1lBRUgsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQzdCLENBQUM7S0FDSjtDQUNKLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLG1DQUFZLENBQUM7SUFDNUIsUUFBUTtJQUNSLFNBQVM7Q0FDWixDQUFDLENBQUM7QUFFVSxRQUFBLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3hDLElBQUksRUFBRTtRQUNGLE1BQU0sRUFBRSxHQUFHO1FBQ1gsV0FBVyxFQUFFLElBQUk7S0FDcEI7Q0FDSixDQUFDLENBQUMifQ==