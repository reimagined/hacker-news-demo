import Immutable from 'seamless-immutable'
import type { UserCreated } from '../events/users'
import events from '../events/users'
import { Event } from '../helpers'
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists'

const { USER_CREATED } = events

export default {
  name: 'users',
  initialState: Immutable({}),
  eventHandlers: {
    [USER_CREATED]: (state, { timestamp }) => state.set('createdAt', timestamp)
  },
  commands: {
    createUser: (state: any, command: UserCreated) => {
      const { name } = command.payload

      throwIfAggregateAlreadyExists(state, command)

      if (!name) {
        throw new Error('Name is required')
      }

      return new Event(USER_CREATED, { name })
    }
  }
}
