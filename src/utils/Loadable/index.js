import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { LoadingDots } from '../../components/LoadingDots'

export const Loadable = ({ children, loadingContent }) => (
  <Suspense fallback={loadingContent}>{children}</Suspense>
)

Loadable.propTypes = {
  loadingContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
}

Loadable.defaultProps = {
  loadingContent: LoadingDots,
}
