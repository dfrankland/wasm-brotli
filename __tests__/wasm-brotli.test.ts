import { readFile } from 'fs';
import { promisify } from 'util';
import { resolve as resolvePath } from 'path';
import { compress, decompress } from '../pkg';

const readFileAsync = promisify(readFile);

describe('brotli', () => {
  it('can compress and decompress', async () => {
    const input = await readFileAsync(resolvePath(__dirname, './sample.txt'));

    const compressedData = await compress(input);
    expect(Buffer.byteLength(compressedData)).toBeLessThan(
      Buffer.byteLength(input),
    );

    const decompressedData = await decompress(compressedData);
    expect(Buffer.from(decompressedData).toString('binary')).toEqual(
      input.toString('binary'),
    );

    return 'blah';
  });

  it('checks for `Uint8Array` input', async () => {
    await expect(() => compress((null as unknown) as Uint8Array)).toThrow(
      "Cannot read property 'length' of null",
    );

    await expect(() => compress((undefined as unknown) as Uint8Array)).toThrow(
      "Cannot read property 'length' of undefined",
    );

    await expect(() => compress((0 as unknown) as Uint8Array)).toThrow(
      'invalid_argument',
    );

    // ¯\_(ツ)_/¯ This should throw, but it works
    await expect(() => compress(({} as unknown) as Uint8Array)).not.toThrow();
  });
});
