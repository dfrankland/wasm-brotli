export const stringToPointer = ({ exports, buffer }) => {
  const { alloc, memory } = exports;

  const len = buffer.length;
  const ptr = alloc(len + 1);

  const internalMemory = new Uint8Array(memory.buffer);

  for (let i = 0; i < len; i += 1) {
    internalMemory[ptr + i] = buffer[i];
  }

  internalMemory[ptr + len] = 0;

  return { ptr, len };

  // More functional programming?
  // const ptr = alloc(len + 1);
  // const memory = [...Buffer.from(inputString, 'binary')].reduce(
  //   (allMemory, data, index, array) => {
  //     const newMemory = Uint8Array(allMemory);
  //     newMemory[ptr + index] = data;
  //     if (index === array.length - 1) newMemory[ptr + array.length] = 0;
  //     return newMemory;
  //   },
  //   new Uint8Array(memoryBuffer),
  // );
};

export const pointerToString = ({ exports, ptr, len }) => (
  new Uint8Array(exports.memory.buffer, ptr, len)
);
