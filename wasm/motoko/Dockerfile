FROM nixos/nix:2.10.3
RUN nix-env -iA cachix -f https://cachix.org/api/v1/install
RUN cachix use ic-hs-test
RUN mkdir -p /opt/moc
WORKDIR /opt/moc
RUN wget -O motoko.tar.gz https://github.com/dfinity/motoko/releases/download/0.6.29/motoko-linux64-0.6.29.tar.gz \
    && tar xzvf motoko.tar.gz \
    && rm -rf motoko.tar.gz
#RUN nix-env -i -f . -A moc
