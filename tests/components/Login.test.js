import React from 'react'
import { shallow } from 'enzyme'

import Login from '../../client/components/Login'

it('renders correctly', () => {
  const markup = shallow(<Login />)

  expect(markup).toMatchSnapshot()
})
