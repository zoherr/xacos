
# XAOCS Benchmark Results

| Metric | Bare Fastify | XAOCS | Overhead |
|--------|-------------|-------|---------|
| Requests/sec | 6833 | 9365 | -27.0% |
| Total time (10000 reqs) | 1463ms | 1068ms | — |

Run date: 2026-05-17T05:57:59.652Z
Platform: win32 / Bun 1.3.12

## Notes
- In-process benchmarks (no network overhead)
- XAOCS overhead includes: file scanner, request adapter, middleware compose
- Acceptable overhead target: < 15%
