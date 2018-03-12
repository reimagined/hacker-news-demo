import jwt from 'jsonwebtoken'

// @flow
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_COMMENTED
} from '../events'
import type {
  Event,
  RawEvent,
  StoryCreated,
  StoryCommented,
  StoryUnvoted,
  StoryUpvoted
} from '../../flow-types/events'

import validate from './validation'

export default {
  name: 'story',
  initialState: {},
  commands: {
    createStory: (
      state: any,
      command: any,
      jwtToken: any
    ): RawEvent<StoryCreated> => {
      const { id: userId, name: userName } = jwt.verify(
        jwtToken,
        process.env.JWT_SECRET || 'DefaultSecret'
      )
      validate.stateIsAbsent(state, 'Story')

      const { title, link, text } = command.payload

      validate.fieldRequired(command.payload, 'title')

      return {
        type: STORY_CREATED,
        payload: { title, text, link, userId, userName }
      }
    },

    upvoteStory: (
      state: any,
      command: any,
      jwtToken: any
    ): RawEvent<StoryUpvoted> => {
      const { id: userId } = jwt.verify(
        jwtToken,
        process.env.JWT_SECRET || 'DefaultSecret'
      )

      validate.stateExists(state, 'Story')
      validate.itemIsNotInArray(state.voted, userId, 'User already voted')

      return { type: STORY_UPVOTED, payload: { userId } }
    },

    unvoteStory: (
      state: any,
      command: any,
      jwtToken: any
    ): RawEvent<StoryUnvoted> => {
      const { id: userId } = jwt.verify(
        jwtToken,
        process.env.JWT_SECRET || 'DefaultSecret'
      )

      validate.stateExists(state, 'Story')
      validate.itemIsInArray(state.voted, userId, 'User did not vote')

      return { type: STORY_UNVOTED, payload: { userId } }
    },

    commentStory: (
      state: any,
      command: any,
      jwtToken: any
    ): RawEvent<StoryCommented> => {
      const { id: userId, name: userName } = jwt.verify(
        jwtToken,
        process.env.JWT_SECRET || 'DefaultSecret'
      )
      validate.stateExists(state, 'Story')

      const { commentId, parentId, text } = command.payload

      validate.fieldRequired(command.payload, 'parentId')
      validate.fieldRequired(command.payload, 'text')
      validate.keyIsNotInObject(
        state.comments,
        commentId,
        'Comment already exists'
      )

      return {
        type: STORY_COMMENTED,
        payload: {
          commentId,
          parentId,
          userId,
          userName,
          text
        }
      }
    }
  },
  projection: {
    [STORY_CREATED]: (
      state,
      { timestamp, payload: { userId } }: Event<StoryCreated>
    ) => ({
      ...state,
      createdAt: timestamp,
      createdBy: userId,
      voted: [],
      comments: {}
    }),

    [STORY_UPVOTED]: (state, { payload: { userId } }: Event<StoryUpvoted>) => ({
      ...state,
      voted: state.voted.concat(userId)
    }),

    [STORY_UNVOTED]: (state, { payload: { userId } }: Event<StoryUnvoted>) => ({
      ...state,
      voted: state.voted.filter(curUserId => curUserId !== userId)
    }),

    [STORY_COMMENTED]: (
      state,
      { timestamp, payload: { commentId, userId } }: Event<StoryCommented>
    ) => ({
      ...state,
      comments: {
        ...state.comments,
        [commentId]: {
          createdAt: timestamp,
          createdBy: userId
        }
      }
    })
  }
}
