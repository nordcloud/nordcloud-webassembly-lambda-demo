FROM ubuntu:22.10
RUN apt update -y && apt install -y curl xz-utils
RUN mkdir -p /usr/src/app
RUN curl -o /usr/src/zig.tar.xz https://ziglang.org/download/0.9.1/zig-linux-x86_64-0.9.1.tar.xz \
    && tar xJvf /usr/src/zig.tar.xz -C /usr/src \
    && mv /usr/src/zig-linux-* /usr/src/zig \
    && rm -rf zig-*.tar.xz
ENV PATH /usr/src/zig:$PATH
WORKDIR /usr/src/app
