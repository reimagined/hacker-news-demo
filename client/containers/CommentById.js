import React from 'react'
import { graphql, gql } from 'react-apollo'

import ChildrenComments from '../components/ChildrenComments'
import Comment from '../components/Comment'
import ReplyLink from '../components/ReplyLink'

export const CommentById = ({
  match: { params: { storyId } },
  data: { comment }
}) => {
  if (!comment) {
    return null
  }

  return (
    <Comment storyId={storyId} level={0} {...comment}>
      <ReplyLink commentId={comment.id} level={0} />
      <ChildrenComments
        storyId={storyId}
        comments={comment.replies}
        parentId={comment.id}
      />
    </Comment>
  )
}

export default graphql(
  gql`
    fragment CommentWithReplies on Comment {
      id
      parentId
      text
      createdAt
      createdBy
      createdByName
      replies {
        ...CommentWithReplies
      }
    }

    query($id: ID!) {
      comment(id: $id) {
        ...CommentWithReplies
      }
    }
  `,
  {
    options: ({ match: { params: { commentId } } }) => ({
      variables: {
        id: commentId
      }
    })
  }
)(CommentById)
