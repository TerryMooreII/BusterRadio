import { BusterradioPage } from './app.po';

describe('busterradio App', () => {
  let page: BusterradioPage;

  beforeEach(() => {
    page = new BusterradioPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('br works!');
  });
});
