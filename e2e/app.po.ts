import { browser, element, by } from 'protractor';

export class BusterradioPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('br-root h1')).getText();
  }
}
