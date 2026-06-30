import { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core'
import { trackNavigation, NavKeyPatterns } from './trackNavigation'

const PATTERNS: NavKeyPatterns = {
  home: '/home',
  list: '/list',
  detail: '/detail',
}

const CONFIG = { stackKey: 'testStack', clearKey: 'home', referrerKey: 'navRef' }

function makeContext(url: string, stack: string[] = []) {
  const session: Record<string, unknown> = { testStack: [...stack] }
  const setData = jest.fn()

  const context = {
    getRequestUrl: () => url,
    getSession: () => session,
    setData,
  } as unknown as EffectFunctionContext

  return { context, session, setData }
}

describe('trackNavigation()', () => {
  describe('untracked page', () => {
    it('should leave the stack unchanged and set referrer to the top of the stack', async () => {
      // Arrange
      const { context, session, setData } = makeContext('/unknown', ['list', 'detail'])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(session.testStack).toEqual(['list', 'detail'])
      expect(setData).toHaveBeenCalledWith('navRef', 'detail')
    })

    it('should set referrer to null when visiting an untracked page with an empty stack', async () => {
      // Arrange
      const { context, setData } = makeContext('/unknown', [])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(setData).toHaveBeenCalledWith('navRef', null)
    })
  })

  describe('clear key', () => {
    it('should clear the stack and set referrer to null when the clear key URL is visited', async () => {
      // Arrange
      const { context, session, setData } = makeContext('/home', ['list', 'detail'])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(session.testStack).toEqual([])
      expect(setData).toHaveBeenCalledWith('navRef', null)
    })

    it('should push the clear key like a normal key when clearKey is undefined', async () => {
      // Arrange — config without a clearKey means no auto-clear
      const configNoClear = { stackKey: 'testStack', referrerKey: 'navRef' }
      const { context, session, setData } = makeContext('/home', ['list'])

      // Act
      await trackNavigation(context, PATTERNS, configNoClear)

      // Assert — 'home' is pushed, stack is not cleared
      expect(session.testStack).toEqual(['list', 'home'])
      expect(setData).toHaveBeenCalledWith('navRef', 'list')
    })
  })

  describe('reload (same key already at top)', () => {
    it('should leave the stack unchanged and set referrer to the second-to-top entry', async () => {
      // Arrange
      const { context, session, setData } = makeContext('/detail', ['list', 'detail'])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(session.testStack).toEqual(['list', 'detail'])
      expect(setData).toHaveBeenCalledWith('navRef', 'list')
    })

    it('should set referrer to null on reload when there is no second-to-top entry', async () => {
      // Arrange — only one entry, same as current page
      const { context, setData } = makeContext('/detail', ['detail'])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(setData).toHaveBeenCalledWith('navRef', null)
    })
  })

  describe('back-navigation (key already in stack, not at top)', () => {
    it('should trim the stack to the visited key and set referrer to the new second-to-top', async () => {
      // Arrange — navigating back to 'list' from deeper in the stack
      const { context, session, setData } = makeContext('/list', ['list', 'detail'])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(session.testStack).toEqual(['list'])
      expect(setData).toHaveBeenCalledWith('navRef', null)
    })

    it('should set referrer to the correct predecessor after trimming a deeper stack', async () => {
      // Arrange
      const { context, session, setData } = makeContext('/list', ['home', 'list', 'detail'])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(session.testStack).toEqual(['home', 'list'])
      expect(setData).toHaveBeenCalledWith('navRef', 'home')
    })
  })

  describe('referrerKey default', () => {
    it('should write to navigationReferrer when referrerKey is not specified', async () => {
      // Arrange — config without referrerKey should default to 'navigationReferrer'
      const configDefaultRef = { stackKey: 'testStack', clearKey: 'home' }
      const { context, setData } = makeContext('/detail', ['list'])

      // Act
      await trackNavigation(context, PATTERNS, configDefaultRef)

      // Assert
      expect(setData).toHaveBeenCalledWith('navigationReferrer', 'list')
    })
  })

  describe('forward navigation (new key)', () => {
    it('should push the new key and set referrer to the previous top', async () => {
      // Arrange
      const { context, session, setData } = makeContext('/detail', ['list'])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(session.testStack).toEqual(['list', 'detail'])
      expect(setData).toHaveBeenCalledWith('navRef', 'list')
    })

    it('should set referrer to null when pushing onto an empty stack', async () => {
      // Arrange
      const { context, session, setData } = makeContext('/detail', [])

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      expect(session.testStack).toEqual(['detail'])
      expect(setData).toHaveBeenCalledWith('navRef', null)
    })

    it('should drop the oldest entry when pushing would exceed the 10-entry cap', async () => {
      // Arrange — 10 existing entries, adding one more should drop the oldest
      const fullStack = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
      const { context, session } = makeContext('/detail', fullStack)

      // Act
      await trackNavigation(context, PATTERNS, CONFIG)

      // Assert
      const result = session.testStack as string[]
      expect(result.length).toBe(10)
      expect(result[0]).toBe('b')
      expect(result[9]).toBe('detail')
    })
  })
})
