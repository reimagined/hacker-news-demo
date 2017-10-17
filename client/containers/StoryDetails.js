import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'
import { graphql, gql } from 'react-apollo'
import styled from 'styled-components'

import Story from '../containers/Story'
import actions from '../actions/storiesActions'
import ChildrenComments from '../components/ChildrenComments'
import '../styles/storyDetails.css'

const Wrapper = styled.div`
  padding: 1em 1.25em 0 1.75em;
  margin-bottom: 1em;
`

const Reply = styled.div`
  padding: 1em 1.25em 0 1.25em;
  margin-bottom: 1em;
`

export class StoryDetails extends React.PureComponent {
  state = {
    text: ''
  }

  saveComment = () => {
    this.props.createComment({
      text: this.state.text,
      parentId: this.props.data.story.id,
      userId: this.props.userId
    })
    this.setState({ text: '' })
  }

  onChangeText = event =>
    this.setState({
      text: event.target.value
    })

  componentDidUpdate = () => {
    const { refetchStory, onRefetched, data: { refetch } } = this.props

    if (refetchStory) {
      refetch()
      onRefetched()
    }
  }

  render() {
    const { data: { story }, loggedIn } = this.props

    if (!story) {
      return null
    }

    return (
      <Wrapper>
        <Story story={story} />
        {loggedIn ? (
          <Reply>
            <textarea
              name="text"
              rows="6"
              cols="70"
              value={this.state.text}
              onChange={this.onChangeText}
            />
            <div>
              <button onClick={this.saveComment}>add comment</button>
            </div>
          </Reply>
        ) : null}
        <ChildrenComments
          storyId={story.id}
          comments={story.comments}
          parentId={story.id}
        />
      </Wrapper>
    )
  }
}

export const mapStateToProps = ({ user, ui: { refetchStory } }) => ({
  userId: user.id,
  loggedIn: !!user.id,
  refetchStory
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createComment: ({ parentId, text, userId }) =>
        actions.createComment(parentId, {
          text,
          parentId,
          userId,
          commentId: uuid.v4()
        }),
      onRefetched: () => ({
        type: 'STORY_REFETCHED'
      })
    },
    dispatch
  )

export default graphql(
  gql`
    query($id: ID!) {
      story(id: $id) {
        id
        type
        title
        text
        link
        comments {
          id
          parentId
          text
          createdAt
          createdBy
          createdByName
        }
        votes
        createdAt
        createdBy
        createdByName
      }
    }
  `,
  {
    options: ({ match: { params: { storyId } } }) => ({
      variables: {
        id: storyId
      }
    })
  }
)(connect(mapStateToProps, mapDispatchToProps)(StoryDetails))
