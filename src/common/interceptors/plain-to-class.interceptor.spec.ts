import { PlainToClassInterceptor } from '../../common/interceptors/plain-to-class.interceptor';

describe('TransformerInterceptor', () => {
  it('should be defined', () => {
    expect(new PlainToClassInterceptor()).toBeDefined();
  });
});
