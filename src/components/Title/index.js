import React from 'react'
import PropTypes from 'prop-types'
import styled from '@xstyled/styled-components'

const H1 = styled.h1(({ color }) => ({
  color: color || '#333',
}))

const H2 = styled.h2(({ color }) => ({
  color: color || '#272727',
}))

export const Title = ({ content, subtitle, color, subtitleColor }) => (
  <section className="coptix-heading">
    <H1 color={color}>{content}</H1>
    {subtitle && <H2 color={subtitleColor}>{subtitle}</H2>}
  </section>
)

Title.propTypes = {
  content: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  color: PropTypes.string,
  subtitleColor: PropTypes.string,
}

Title.defaultProps = {
  subtitle: null,
}
