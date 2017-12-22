import { compress, decompress, brotli, BROTLI_COMPRESS } from '../../';

jest.setTimeout(60000);

const input = Buffer.from('blah blah blah blah blah blah', 'utf8');

describe('brotli', () => {
  it('can compress and decompress', async () => {
    const compressedData = await compress(input);
    expect(Buffer.from(compressedData).length).toBeLessThan(input.length);

    const decompressedData = await decompress(compressedData);
    expect(Buffer.from(decompressedData)).toEqual(input);
  });

  it('checks for `Uint8Array` input', async () => {
    await expect(brotli(BROTLI_COMPRESS, 'not a Unit8Array')).rejects.toThrow('data must be a Uint8Array');
  });

  it('checks for proper method given to `brotli` function', async () => {
    await expect(brotli('bad method', 'not a Unit8Array')).rejects.toThrow('method is invalid');
  });
});
