import React from 'react'
import styled from '@xstyled/styled-components'
import PropTypes from 'prop-types'
import { Tab } from './Tab'

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

const Ul = styled.ul`
  display: flex;
  flex-flow: row wrap;
  text-align: center;
  vertical-align: baseline;
  padding: 0;
  margin: 0;
  justify-content: space-evenly;
  align-items: baseline;
`
export const Tabs = ({ routes }) => (
  <nav>
    <Ul role="menu" className="primary-navigation">
      {routes.map((route, i) => {
        const { path, name } = route
        return <Tab key={i} toPath={path} label={capitalizeFirstLetter(name)} />
      })}
    </Ul>
  </nav>
)

Tabs.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
}
