// noinspection CssReplaceWithShorthandSafely
import styled from '@xstyled/styled-components'
import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const activeClassName = 'nav-item-active'

// noinspection CssInvalidPropertyValue
const NavItem = styled(NavLink).attrs({
  activeClassName,
})`
  display: inline-block;
  background-color: dark;
  color: primaryLight; /* ⟶ theme.colors.primaryLight */
  transition: background-color 300ms, color 300ms;
  text-decoration: none;
  width: 100% !important;
  height: 100% !important;
  padding: 12px 18px;
  white-space: nowrap;

  &:hover {
    background-color: secondary;
    color: light;
  }
  &.${activeClassName} {
    background-color: primaryLight;
    color: dark;
  }
`

const Li = styled.li`
  display: inline-flex;
  align-items: baseline;
  flex: 1;
  border: 3px #29020d;
`

export function Tab({ toPath, label }) {
  return React.useMemo(
    () => (
      <Li>
        <NavItem to={toPath} exact activeClassName={activeClassName}>
          {label}
        </NavItem>
      </Li>
    ),
    [label, toPath],
  )
}

Tab.propTypes = {
  toPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}
