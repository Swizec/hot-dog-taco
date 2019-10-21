import React from "react"
import { Link } from "gatsby"
import gql from "graphql-tag"

import { useMutation, useQuery } from "react-apollo-hooks"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const VOTE_QUERY = gql`
  mutation vote($isHotDogTaco: Boolean!) {
    vote(isHotDogTaco: $isHotDogTaco) {
      voteId
      createdAt
    }
  }
`

const GET_VOTES_QUERY = gql`
  query {
    allVotes {
      voteId
      createdAt
      isHotDogTaco
    }
  }
`

const VoteButton = ({ isHotDogTaco, children }) => {
  const [vote, { data, loading }] = useMutation(VOTE_QUERY, {
    variables: {
      isHotDogTaco,
    },
  })

  console.log(data)

  return loading ? "Voting ..." : <button onClick={vote}>{children}</button>
}

const Votes = () => {
  const { loading, error, data } = useQuery(GET_VOTES_QUERY)

  const yes = data && data.allVotes.filter(vote => vote.isHotDogTaco).length,
    no = data && data.allVotes.filter(vote => !vote.isHotDogTaco).length

  return loading ? (
    <p>Loading votes ...</p>
  ) : (
    <strong>
      {yes + no} votes, {Math.round((yes / (yes + no)) * 100)}% say hot dog is
      taco
    </strong>
  )
}

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <h1 style={{ marginTop: "2rem" }}>Is hot dog a taco?</h1>
      <p>
        <VoteButton isHotDogTaco={true}>Yes 🌭</VoteButton>
        <VoteButton isHotDogTaco={false}>No 🌮</VoteButton>
      </p>
      <div style={{ maxWidth: `600px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <Votes />
    </Layout>
  )
}

export default IndexPage
