export const english = {
  questions: {
    foo: {
      test: 'test',
      bar: {
        baz: 'Hello!',
        bing: 'bong',
      },
    },
  },
} as const

export type FinanceContent = typeof english
