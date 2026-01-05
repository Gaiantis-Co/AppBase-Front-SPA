describe('Auth Persistence', function () {
    before((browser) => browser.url(browser.launch_url));

    it('should maintain session after reload', function (browser) {
        browser
            .execute(function () {
                localStorage.setItem('auth_token', 'fake-token');
                localStorage.setItem('user', JSON.stringify({ id: 1, name: 'E2E User', email: 'e2e@example.com' }));
            })
            .refresh()
            .waitForElementVisible('body')
            // Check if redirected to dashboard or if elements of logged in user are visible
            // This depends on the actual UI implementation
            .assert.urlContains('/dashboard');

        browser.end();
    });
});
