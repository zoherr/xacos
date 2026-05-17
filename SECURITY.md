# Security Policy

## Reporting Vulnerabilities

Please report security vulnerabilities to: security@xaocs.dev

Do NOT open a public GitHub issue for security vulnerabilities.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Yes    |

## Security Defaults

XAOCS enforces these security defaults out of the box:
- JWT secrets must be ≥ 32 characters
- bcrypt rounds ≥ 12 (configurable via BCRYPT_ROUNDS env)
- HttpOnly, Secure, SameSite cookies in production
- SQL injection protection via Knex parameterized queries
- 10MB request body limit
- Security headers (X-Content-Type-Options, etc.)
