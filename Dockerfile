FROM oven/bun

COPY bun.lockb . 
COPY package.json . 

RUN bun install --frozen-lockfile

COPY src ./src 

EXPOSE 8080

CMD ["bun", "src/index.ts"]