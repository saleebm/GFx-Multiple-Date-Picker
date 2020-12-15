import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
    console.log(info)
    console.log(error)
  }

  render() {
    if (this.state.hasError) {
      return <h1>There was an error...</h1>
    }
    const { children } = this.props
    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
}
