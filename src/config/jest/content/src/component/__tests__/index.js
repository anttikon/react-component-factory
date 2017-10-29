import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Component from '../index';

describe('Component', () => {
  it('should render correctly', () => {
    const output = shallow(<Component/>)
    expect(shallowToJson(output)).toMatchSnapshot()
  })
})
