import React from 'react'
import { connect } from 'react-redux'

import ChildrenComments from '../components/ChildrenComments'
import Comment from '../components/Comment'
import subscribe from '../decorators/subscribe'
import storyDetails from '../../common/read-models/storyDetails'

export const CommentById = ({ aggregateId, comments, comment }) => {
  if (!comment) {
    return null
  }

  return (
    <Comment {...comment} showReply>
      <ChildrenComments
        storyId={aggregateId}
        comments={comments}
        parentId={comment.id}
      />
    </Comment>
  )
}

export const mapStateToProps = (
  { storyDetails },
  { match: { params: { commentId } } }
) => ({
  comments: storyDetails,
  comment: storyDetails.find(({ id }) => id === commentId)
})

export default subscribe(({ match: { params: { storyId, commentId } } }) => ({
  graphQL: [
    {
      readModel: storyDetails,
      query:
        'query ($aggregateId: String!, $commentId: String!) { storyDetails(aggregateId: $aggregateId, commentId: $commentId) { text, id, parentId, storyId, createdAt, createdBy, createdByName, replies } }',
      variables: {
        aggregateId: storyId,
        commentId: commentId
      }
    }
  ]
}))(connect(mapStateToProps)(CommentById))
