import { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/*.test.{ts,tsx}'],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testPathIgnorePatterns: ["/node_modules/"] 
}
export default config