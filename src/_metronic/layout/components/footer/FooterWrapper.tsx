import clsx from 'clsx'
import React from 'react';
import {useLayout} from '../../core'
import {Footer} from './Footer'

const FooterWrapper = () => {
  const {config} = useLayout()
  if (!config.app?.footer?.display) {
    return null
  }

  return (
    <div className='app-footer' id='kt_app_footer'>
      {config.app.footer.containerClass ? (
        <div
          className={clsx(
            'app-container',
            config.app.footer.container === 'fixed' ? 'container-xxl' : 'container-fluid',
            config.app.footer.containerClass
          )}
        >
          <Footer />
        </div>
      ) : (
        <Footer />
      )}
    </div>
  )
}

export {FooterWrapper}
