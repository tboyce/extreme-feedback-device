import { ExtremeFeedbackDevicePage } from './app.po';

describe('extreme-feedback-device App', function() {
  let page: ExtremeFeedbackDevicePage;

  beforeEach(() => {
    page = new ExtremeFeedbackDevicePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
