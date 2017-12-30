export default (buffer) => {
  if (!(buffer instanceof Uint8Array)) throw new Error('buffer must be a Uint8Array');

  if (typeof window === 'object' && typeof TextDecoder === 'function') {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(buffer);
  }

  return Buffer.from(buffer).toString('utf8');
};
