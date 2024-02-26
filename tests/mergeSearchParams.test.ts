import { describe, it, expect } from 'bun:test';
import { mergeURLSearchParams } from '~'; // Update the import path

describe('mergeSearchParams function', () => {
  it('replaces existing parameters with new ones in replace mode', () => {
    const query1 = new URLSearchParams('a=1&b=2');
    const query2 = new URLSearchParams('b=3&c=4');
    const result = mergeURLSearchParams(query1, query2, 'replace');
    expect(result.toString()).toBe('a=1&b=3&c=4');
  });

  it('appends parameters without deleting existing ones in append mode', () => {
    const query1 = new URLSearchParams('a=1&b=2');
    const query2 = new URLSearchParams('b=3&c=4');
    const result = mergeURLSearchParams(query1, query2, 'append');
    expect(result.toString()).toBe('a=1&b=2&b=3&c=4');
  });

  it('handles string inputs for query parameters', () => {
    const query1 = 'a=1&b=2';
    const query2 = 'b=3&c=4';
    const result = mergeURLSearchParams(query1, query2, 'replace');
    expect(result.toString()).toBe('a=1&b=3&c=4');
  });

  it('correctly handles URLSearchParamsInput object inputs', () => {
    const query1 = { a: '1', b: '2' };
    const query2 = { b: '3', c: '4' };
    const result = mergeURLSearchParams(query1, query2, 'replace');
    expect(result.toString()).toBe('a=1&b=3&c=4');
  });

  it('supports array values in URLSearchParamsInput objects for append mode', () => {
    const query1 = { a: ['1', '2'], b: '2' };
    const query2 = { b: ['3', '4'], c: '4' };
    const result = mergeURLSearchParams(query1, query2, 'append');
    // Note: The order of parameters may depend on the implementation of URLSearchParams.
    expect(result.toString()).toBe('a=1&a=2&b=2&b=3&b=4&c=4');
  });

  it('removes parameters correctly before appending in replace mode', () => {
    const query1 = { a: '1', b: ['2', '3'] };
    const query2 = { b: '4', c: '5' };
    const result = mergeURLSearchParams(query1, query2, 'replace');
    expect(result.toString()).toBe('a=1&b=4&c=5');
  });

  // Add more tests as needed for edge cases and different inputs
});