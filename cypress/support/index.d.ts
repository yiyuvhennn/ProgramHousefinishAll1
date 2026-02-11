declare namespace Cypress {
  interface Chainable {
    resetDb(): Chainable<number>
  }
}
