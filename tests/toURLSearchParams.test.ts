import { describe, it, expect } from 'bun:test';
import { toURLSearchParams } from '~'; // Update the import path

describe('toSearchParams function', () => {
  it('returns the same URLSearchParams object when input is URLSearchParams', () => {
    const searchParams = new URLSearchParams('key=value');
    const result = toURLSearchParams(searchParams);
    expect(result).toBe(searchParams);
  });

  it('converts a string to URLSearchParams', () => {
    const searchString = 'key=value&key2=value2';
    const result = toURLSearchParams(searchString);
    expect(result.get('key')).toBe('value');
    expect(result.get('key2')).toBe('value2');
  });

  it('converts a record/object to URLSearchParams', () => {
    const searchObject = { key: 'value', key2: 'value2' };
    const result = toURLSearchParams(searchObject);
    expect(result.get('key')).toBe('value');
    expect(result.get('key2')).toBe('value2');
  });

  it('handles array values in a record/object', () => {
    const searchObject = { key: ['value1', 'value2'] };
    const result = toURLSearchParams(searchObject);
    expect(result.getAll('key')).toEqual(['value1', 'value2']);
  });

  it('ignores null and undefined values in a record/object', () => {
    const searchObject = { key: 'value', nullKey: null, undefinedKey: undefined };
    const result = toURLSearchParams(searchObject);
    expect(result.has('nullKey')).toBe(false);
    expect(result.has('undefinedKey')).toBe(false);
    expect(result.get('key')).toBe('value');
  });

  it('converts boolean and number values to strings', () => {
    const searchObject = { boolKey: true, numKey: 123 };
    const result = toURLSearchParams(searchObject);
    expect(result.get('boolKey')).toBe('true');
    expect(result.get('numKey')).toBe('123');
  });

  it('throws an error for unsupported input types', () => {
    const badInput = () => toURLSearchParams(42 as any); // Force an unsupported type
    expect(badInput).toThrow('Unsupported search params input type.');
  });
});