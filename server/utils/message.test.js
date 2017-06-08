var expect = require('expect');

var {generateMessage} = require('./message');
describe('generateMessage', () => {
  it('should generates correct message', function() {
    var from = 'jen';
    var text = 'hello world';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
})
