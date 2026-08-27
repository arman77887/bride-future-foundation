# Bride Future Foundation (BFF) Platform

Monorepo codebase for the Bride Future Foundation production platform consisting of a Laravel 11 REST API backend, Next.js 14 bilingual frontend, and PostgreSQL database storage.

## Phase 1 Status
- Monorepo foundation established.
- Complete PostgreSQL migrations for all 39 approved tables.
- Append-only audit log trigger security.
- Laravel health check API endpoint.
- Next.js bilingual routing setup.
- Docker & Nginx templates.

## Prerequisites
- PHP 8.3+
- Composer
- Node.js 20+
- PostgreSQL 15+

## Quick Start
1. Copy `.env.example` to `.env` in root and configure environment variables.
2. Run `docker-compose up --build -d` to spin up services.
3. Execute backend migrations inside the container:
   `docker-compose exec backend php artisan migrate`
