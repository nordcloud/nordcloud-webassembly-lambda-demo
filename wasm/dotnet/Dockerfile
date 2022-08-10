FROM ubuntu:22.10
RUN apt update -y && apt install -y curl git libicu-dev
RUN mkdir -p /opt/dotnet
WORKDIR /opt/dotnet
RUN curl -o dotnet.tar.gz https://download.visualstudio.microsoft.com/download/pr/aabf15d3-f201-4a6c-9a7e-def050d054af/0a8eba2d8abcf1c28605744f3a48252f/dotnet-sdk-7.0.100-preview.7.22377.5-linux-x64.tar.gz \
    && tar xzvf dotnet.tar.gz \
    && rm -rf dotnet.tar.gz
RUN git clone https://github.com/SteveSandersonMS/dotnet-wasi-sdk.git
VOLUME /usr/src
WORKDIR /usr/src
