FROM loadimpact/k6

RUN mkdir -p /home/k6

WORKDIR /home/k6

COPY . .

WORKDIR /home/k6/scripts