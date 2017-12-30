extern crate brotli;

use std::mem;
use std::os::raw::{c_char, c_void};
use std::slice::from_raw_parts;
use std::error::Error;

use brotli::{BrotliCompress, BrotliDecompress};
use brotli::enc::{BrotliEncoderInitParams};

// This is just so the file compiles

fn main() {}

// Memory management utility

#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf); // This is JS' responsibility now
    ptr as *mut c_void
}

#[no_mangle]
pub extern "C" fn dealloc(ptr: *mut c_char, len: u32) {
    unsafe  {
        let _buf = Vec::from_raw_parts(ptr, len as usize, len as usize);
    }
}

// Imports from JavaScript-land

extern "C" {
    fn js_resolve(ptr: *const u8, len: u32);
    fn js_reject(ptr: *const u8, len: u32);
    fn js_console_log(ptr: *const u8, len: u32);
}

// "Safe" implementations to communicate with Javascript-land

fn resolve(v: &mut Vec<u8>) -> () {
    let len = v.len() as u32;
    let ptr = v.as_mut_ptr();
    unsafe {
        js_resolve(ptr, len);
    }
}

fn reject<T: Error>(err: &T) -> () {
    let description = err.description();
    let len = description.len() as u32;
    let ptr = description.as_ptr();
    unsafe {
        js_reject(ptr, len);
    }
}

fn console_log(log: &str) -> () {
    let len = log.len() as u32;
    let ptr = log.as_ptr();
    unsafe {
        js_console_log(ptr, len);
    }
}

// Converts a pointer + buffer length to a slice

fn ptr_to_bytes<'a>(ptr: *mut c_char, len: u32) -> &'a [u8] {
  unsafe {
      from_raw_parts(ptr as *const u8, len as usize)
  }
}

// Actual module code

#[no_mangle]
pub extern "C" fn compress(ptr: *mut c_char, len: u32) -> () {
    let mut data = ptr_to_bytes(ptr, len);

    if cfg!(debug_assertions) {
        console_log(&format!("`compress` received {:?}", data));
    }

    let mut output = vec![];
    let params = BrotliEncoderInitParams();
    match BrotliCompress(&mut data, &mut output, &params) {
        Ok(_) => resolve(&mut output),
        Err(e) => reject(&e),
    };

    dealloc(ptr, len);
}

#[no_mangle]
pub extern "C" fn decompress(ptr: *mut c_char, len: u32) -> () {
    let mut data = ptr_to_bytes(ptr, len);

    if cfg!(debug_assertions) {
        console_log(&format!("`decompress` received: {:?}", data));
    }

    let mut result = vec![];
    match BrotliDecompress(&mut data, &mut result) {
        Ok(_) => resolve(&mut result),
        Err(e) => reject(&e),
    }

    dealloc(ptr, len);
}
