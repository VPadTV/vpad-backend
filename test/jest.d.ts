/// <reference types="jest" />
export declare type MockProxy<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer B
  ? CalledWithMock<B, A>
  : T[K]
} & T

export interface CalledWithMock<T, Y extends any[]> extends jest.Mock<T, Y> {
  calledWith: (...args: Y | MatchersOrLiterals<Y>) => jest.Mock<T, Y>
}

export declare type MatchersOrLiterals<Y extends any[]> = {
  [K in keyof Y]: Matcher<Y[K]> | Y[K]
}

export declare class Matcher<T> {
  readonly asymmetricMatch: MatcherFn<T>
  private readonly description
  $$typeof: symbol
  inverse?: boolean
  constructor(asymmetricMatch: MatcherFn<T>, description: string)
  toString(): string
  toAsymmetricMatcher(): string
  getExpectedType(): string
}

export declare type MatcherFn<T> = (actualValue: T) => boolean

export declare type Mockfn = typeof jest.fn
