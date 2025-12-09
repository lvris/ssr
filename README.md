## Getting Started

First, run the bench script to generate pages

```bash
npm run bench
# or
yarn run bench
# or
pnpm run bench
# or
bun run bench
```

This will create static benchmark pages under the `./bench` folder.

Then, you can build and start the server:

```bash
npm run build
npm run start
```

Then open following links to see the benchmark page.

- http://localhost:3333/bench/list/csr
- http://localhost:3333/bench/home/csr
- http://localhost:3333/bench/list/ssr
- http://localhost:3333/bench/home/ssr
- http://localhost:3333/bench/list/ssg
- http://localhost:3333/bench/home/ssg
- http://localhost:3333/bench/list/isr
- http://localhost:3333/bench/home/isr


