import { readFile } from 'fs';
import { promisify } from 'util';
import { resolve as resolvePath } from 'path';
import { compress, decompress, brotli, BROTLI_COMPRESS } from '../../';

jest.setTimeout(60000);

const readFileAsync = promisify(readFile);

describe('brotli', () => {
  it('can compress and decompress', async () => {
    const input = await readFileAsync(resolvePath(__dirname, './sample.txt'));

    const compressedData = await compress(input);
    expect(Buffer.byteLength(compressedData)).toBeLessThan(Buffer.byteLength(input));

    const decompressedData = await decompress(compressedData);
    expect(Buffer.from(decompressedData).toString('binary')).toEqual(input.toString('binary'));
  });

  it('checks for `Uint8Array` input', async () => {
    await expect(brotli(BROTLI_COMPRESS, 'not a Uint8Array')).rejects.toThrow('buffer must be a Uint8Array');
  });

  it('checks for proper method given to `brotli` function', async () => {
    await expect(brotli('bad method', 'not a Uint8Array')).rejects.toThrow('method is invalid');
  });
});
