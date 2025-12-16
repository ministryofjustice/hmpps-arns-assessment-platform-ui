import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { getCorrelationContext } from 'applicationinsights'
import { initialiseName } from './utils'
import config from '../config'
import logger from '../../logger'

export default function nunjucksSetup(app?: express.Express) {
  if (app) {
    app.set('view engine', 'njk')

    app.locals.asset_path = '/assets/'
    app.locals.applicationName = 'ARNS Assessment Platform'
    app.locals.environmentName = config.environmentName
    app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
  }

  let assetManifest: Record<string, string> = {}

  try {
    const paths = [
      path.resolve(__dirname, '../../assets/manifest.json'),
      path.resolve(__dirname, 'assets/manifest.json'),
    ]

    const validPath = paths.find(p => fs.existsSync(p))

    if (!validPath) {
      throw new Error('Asset manifest not found')
    }

    assetManifest = JSON.parse(fs.readFileSync(validPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, 'server/views'),
      path.join(__dirname, '../../server/views'),
      path.join(__dirname, 'server/forms'),
      path.join(__dirname, '../../server/forms'),
      path.join(__dirname, 'packages/form-engine/src/diagnostics/inspector/templates'),
      path.join(__dirname, '../../packages/form-engine/src/diagnostics/inspector/templates'),
      'packages/form-engine-moj-components/src/',
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
    ],
    {
      autoescape: true,
      express: app,
      noCache: process.env.NODE_ENV !== 'production',
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addFilter('json', (obj, spaces = 2) => JSON.stringify(obj, null, spaces))

  // Global function to get the current request's operation ID for support purposes
  njkEnv.addGlobal('getRequestId', () => {
    const context = getCorrelationContext()

    return context?.operation?.id ?? 'unavailable'
  })

  // Map navigation data structure (path → url) for nav-list-item macro
  interface NavItem {
    path: string
    title: string
    active?: boolean
    hiddenFromNavigation?: boolean
    children?: NavItem[]
  }

  interface MappedNavItem {
    url: string
    title: string
    active: boolean
    hiddenFromNavigation: boolean
    children: MappedNavItem[]
  }

  const mapNavItem = (item: NavItem): MappedNavItem => ({
    url: item.path,
    title: item.title,
    active: item.active ?? false,
    hiddenFromNavigation: item.hiddenFromNavigation ?? false,
    children: item.children?.map(mapNavItem) ?? [],
  })

  const isDeepestActive = (item: NavItem): boolean => {
    if (!item.active) {
      return false
    }

    if (item.children && item.children.length) {
      const hasVisibleActiveChild = item.children.some(child => child.active && !child.hiddenFromNavigation)
      return !hasVisibleActiveChild
    }

    return true
  }

  njkEnv.addFilter('mapNavItem', mapNavItem)

  njkEnv.addFilter('isDeepestActive', isDeepestActive)

  return njkEnv
}
