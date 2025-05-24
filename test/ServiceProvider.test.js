const ServiceProvider = require('../src/ServiceProvider');

describe('ServiceProvider', () => {
  test('new', () => {
    ServiceProvider.set('service', 'a');
    const SP = ServiceProvider.new().set('service', 'b');
    expect(ServiceProvider.get('service')).toBe('a');
    expect(SP.get('service')).toBe('b');
  });
});
