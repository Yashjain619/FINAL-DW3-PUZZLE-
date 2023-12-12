describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to mark the book as finished', () => {
    cy.get('input[type="search"]').type('angular');

    cy.get('form').submit();

    cy.get('[data-testing="add-item"]:enabled').first().click();

    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="finish-book-cta"]:enabled').first().click();

    cy.get('[data-testing="finish-date"]').first().should('contain.text', 'Finished reading');
  });
});
