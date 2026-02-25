import { parseHeaders } from '../../src/utils/parse-headers';

describe('parseHeaders', () => {
  it('should return empty object for undefined input', () => {
    expect(parseHeaders(undefined)).toEqual({});
  });

  it('should return empty object for empty string', () => {
    expect(parseHeaders('')).toEqual({});
  });

  it('should return empty object for null input', () => {
    expect(parseHeaders(null as any)).toEqual({});
  });

  it('should parse a single header string', () => {
    expect(parseHeaders('User-Agent: Mozilla/5.0')).toEqual({ 'User-Agent': 'Mozilla/5.0' });
  });

  it('should handle header values containing colons', () => {
    expect(parseHeaders('User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toEqual({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    });
  });

  it('should trim key and value whitespace', () => {
    expect(parseHeaders('  X-Custom  :  some value  ')).toEqual({ 'X-Custom': 'some value' });
  });

  it('should return empty object for string without colon', () => {
    expect(parseHeaders('invalid-header')).toEqual({});
  });

  it('should return empty object for string with only colon', () => {
    expect(parseHeaders(': value')).toEqual({});
  });

  it('should parse an array of header strings', () => {
    expect(parseHeaders(['User-Agent: Mozilla/5.0', 'X-Custom: value'])).toEqual({
      'User-Agent': 'Mozilla/5.0',
      'X-Custom': 'value',
    });
  });

  it('should skip invalid entries in array', () => {
    expect(parseHeaders(['User-Agent: Mozilla/5.0', 'invalid', 'X-Custom: value'])).toEqual({
      'User-Agent': 'Mozilla/5.0',
      'X-Custom': 'value',
    });
  });

  it('should handle empty array', () => {
    expect(parseHeaders([])).toEqual({});
  });

  it('should pass through an object directly', () => {
    const headers = { 'User-Agent': 'Mozilla/5.0', 'X-Custom': 'value' };
    expect(parseHeaders(headers)).toEqual(headers);
  });

  it('should parse a JSON string into headers', () => {
    const json = '{"User-Agent":"Mozilla/5.0","X-Custom":"value"}';
    expect(parseHeaders(json)).toEqual({ 'User-Agent': 'Mozilla/5.0', 'X-Custom': 'value' });
  });

  it('should fall back to header string parsing when JSON is invalid', () => {
    expect(parseHeaders('X-Custom: value')).toEqual({ 'X-Custom': 'value' });
  });

  it('should handle empty object', () => {
    expect(parseHeaders({})).toEqual({});
  });

  it('should handle header value with equals sign', () => {
    expect(parseHeaders('Authorization: Bearer abc=def')).toEqual({ Authorization: 'Bearer abc=def' });
  });
});
