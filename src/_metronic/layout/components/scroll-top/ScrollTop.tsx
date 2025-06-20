import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {
  DrawerComponent,
  ScrollTopComponent,
  StickyComponent,
  ToggleComponent,
} from '../../../assets/ts/components'
import {KTIcon} from '../../../helpers'
import React from 'react';

export function ScrollTop() {
  const {pathname} = useLocation()
  const [initialized, setInintialized] = useState(false)

  const pluginsReinitialization = () => {
    setTimeout(() => {
      StickyComponent.reInitialization()
      setTimeout(() => {
        ToggleComponent.reinitialization()
        DrawerComponent.reinitialization()
      }, 70)
    }, 140)
  }

  const scrollTop = () => {
    ScrollTopComponent.goTop()
  }

  const updateHeaderSticky = () => {
    const stickyHeader = document.body.querySelectorAll(`[data-kt-sticky-name="header"]`)
    if (stickyHeader && stickyHeader.length > 0) {
      const sticky = StickyComponent.getInstance(stickyHeader[0] as HTMLElement)
      if (sticky) {
        sticky.update()
      }
    }
  }

  useEffect(() => {
    if (!initialized) {
      setInintialized(true)
    } else {
      pluginsReinitialization()
    }

    updateHeaderSticky()
    setTimeout(() => {
      scrollTop()
    }, 0)
  }, [initialized, pathname])

  return (
    <div id='kt_scrolltop' className='scrolltop' data-kt-scrolltop='true'>
      <KTIcon iconName='arrow-up' />
    </div>
  )
}
