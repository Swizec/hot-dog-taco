import React from "react"
import gql from "graphql-tag"

import { useMutation, useQuery } from "react-apollo-hooks"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const VOTE_MUTATION = gql`
  mutation vote($isHotDog: Boolean!) {
    vote(isHotDog: $isHotDog) {
      voteId
      createdAt
    }
  }
`

const GET_VOTES_QUERY = gql`
  query allVotes {
    allVotes {
      voteId
      isHotDog
    }
  }
`

const VoteButton = ({ isHotDog, children }) => {
  const [vote, { loading }] = useMutation(VOTE_MUTATION, {
    variables: {
      isHotDog,
    },
  })

  return loading ? "Voting ..." : <button onClick={vote}>{children}</button>
}

const Votes = () => {
  const { loading, error, data } = useQuery(GET_VOTES_QUERY)

  const yes = data && data.allVotes.filter(vote => vote.isHotDog).length,
    no = data && data.allVotes.filter(vote => !vote.isHotDog).length

  return loading ? (
    <p>Loading votes ...</p>
  ) : (
    <strong>
      {yes + no} votes, {Math.round((yes / (yes + no)) * 100)}% say hot dog is
      taco
    </strong>
  )
}

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Is hot dog taco?</h1>

    <p>
      <VoteButton isHotDog={true}>Yes 🌭</VoteButton>
      <VoteButton isHotDog={false}>No 🌮</VoteButton>
    </p>

    <div style={{ maxWidth: `600px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Votes />
  </Layout>
)

export default IndexPage
