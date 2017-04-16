/* eslint-disable fp/no-nil */
/* eslint-disable better/explicit-return */
/* eslint-disable fp/no-unused-expression */

import React from 'react'
import renderer from 'react-test-renderer'

import Flag from './Flag'

it('renders correctly', () => {
  const flag = renderer.create(
    <Flag code="no" height="42" />
  ).toJSON();
  expect(flag).toMatchSnapshot();
});
