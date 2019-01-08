import { PolicyholderThemeDemoPage } from './app.po';

describe('policy-holder-theme-demo App', () => {
  let page: PolicyholderThemeDemoPage;

  beforeEach(() => {
    page = new PolicyholderThemeDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
