extern crate brotli;

use std::mem;
use std::os::raw::c_void;

use brotli::{BrotliCompress, BrotliDecompress};
use brotli::enc::{BrotliEncoderInitParams};

// This is just so the file compiles

fn main() {}

// Memory management utility for `kaffeerost` to hook into

#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf); // This is JS' responsibility now
    ptr as *mut c_void
}

// Actual module code

#[no_mangle]
pub extern "C" fn compress(input: &[u8]) -> Vec<u8> {
    let mut data = input;
    let mut output = vec![];
    let params = BrotliEncoderInitParams();
    match BrotliCompress(&mut data, &mut output, &params) {
        Ok(_) => output,
        Err(e) => panic!("Error {:?}", e),
    }
}

#[no_mangle]
pub extern "C" fn decompress(input: &[u8]) -> Vec<u8> {
    let mut data = input;
    let mut result = vec![];
    match BrotliDecompress(&mut data, &mut result) {
        Ok(_) => result,
        Err(e) => panic!("Error {:?}", e),
    }
}
