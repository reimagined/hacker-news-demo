import React from 'react'
import { connect } from 'react-redux'

import ChildrenComments from '../components/ChildrenComments'
import Comment from '../components/Comment'
import subscribe from '../decorators/subscribe'
import comments from '../../common/read-models/comments'

export const CommentById = ({ comments, comment }) => {
  if (!comment) {
    return null
  }

  return (
    <Comment {...comment} showReply>
      <ChildrenComments replies={comment.replies} comments={comments} />
    </Comment>
  )
}

export const mapStateToProps = ({ comments }, { match }) => ({
  comments,
  comment: comments.find(({ id }) => id === match.params.commentId)
})

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: comments,
      query:
        'query ($aggregateId: String!, $commentId: String!) { comments(aggregateId: $aggregateId, commentId: $commentId) { text, id, parentId, storyId, createdAt, createdBy, replies } }',
      variables: {
        aggregateId: match.params.storyId,
        commentId: match.params.commentId
      }
    }
  ]
}))(connect(mapStateToProps)(CommentById))
