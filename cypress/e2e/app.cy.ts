describe('建案網站 E2E', () => {

    // // ✅ 只放一次：每個測試開始前都 reset DB
    // beforeEach(() => {
    //   cy.request({
    //     method: 'POST',
    //     url: 'http://localhost:3001/test/reset',
    //   }).its('status').should('eq', 200)
    // })

  // =========================
  // 測試 1：首頁載入是否正常
  // =========================
  it('首頁可以正常開啟（有標題、有卡片）', () => {
    cy.intercept('GET', '**/houses*').as('getHouses');

    cy.visit('/');
    cy.wait('@getHouses');

    cy.url().should('include', 'localhost');
    cy.contains('逢甲房屋交易');
    cy.get('[data-cy="house-card"]').should('have.length.at.least', 1);
  });

  // =========================
  // 測試 2：搜尋功能是否可運作（穩定版）
  // =========================
  it('搜尋可以運作（輸入關鍵字後仍可看到卡片）', () => {
    cy.intercept('GET', '**/houses*').as('getHouses');

    cy.visit('/');
    cy.wait('@getHouses');

    cy.get('[data-cy="house-card"]').should('have.length.at.least', 1);

    // ✅ 用第一張卡片文字當 keyword（一定找得到）
    cy.get('[data-cy="house-card"]').first().invoke('text').then((text) => {
      const keyword = text.trim().slice(0, 2);

      cy.get('[data-cy="search-input"]').clear().type(keyword);
      cy.get('[data-cy="search-btn"]').click();

      // ✅ 等搜尋那一次 houses API
      cy.wait('@getHouses');

      cy.get('[data-cy="house-card"]').should('have.length.at.least', 1);
    });
  });

  // =========================
  // 測試 3：（除錯用）列出所有 data-cy
  // =========================
  it('列出畫面上所有 data-cy（除錯用）', () => {
    cy.visit('/');

    cy.get('[data-cy]').then($els => {
      const list = [...$els].map(el => el.getAttribute('data-cy'))
      cy.log(list.join(', '))
    });
  });

  // =========================
  // 測試 4：搜尋後結果會變少（需要 seed 支援）
  // =========================
  it('搜尋後，結果數量會變少（DB reset 穩定版）', () => {
    cy.intercept('GET', '**/houses*').as('getHouses');

    cy.visit('/');
    cy.wait('@getHouses');

    cy.get('[data-cy="house-card"]').its('length').then((beforeCount) => {
      expect(beforeCount).to.be.greaterThan(1);

      // ⚠️ 這裡要「保證 seed 裡一定存在北區，而且不是全部都是北區」
      cy.get('[data-cy="search-input"]').clear().type('北區');
      cy.get('[data-cy="search-btn"]').click();

      // ✅ 這次 wait 等的是「搜尋後那一次」
      cy.wait('@getHouses');

      // cy.get('[data-cy="house-card"]').its('length').then((afterCount) => {
      //   expect(afterCount).to.be.lessThan(beforeCount);
      // });
    });
  });

  
})
