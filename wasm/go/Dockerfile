FROM rust:1.62.1

WORKDIR /usr/src/myapp

RUN rustup target add wasm32-wasi

COPY . .

RUN cargo install --path .
RUN cargo build --target wasm32-wasi --release
VOLUME /out

CMD ["cp", "target/wasm32-wasi/release/demo-rust.wasm", "/out/demo-rust.wasm"]
