# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CI/CD pipeline with GitHub Actions
- Semantic release automation
- Product validation before order creation
- Event-driven communication between services (SNS/SQS)
- Comprehensive README documentation
- Docker containerization for all services
- LocalStack for AWS services simulation

### Features

- Products Service with CRUD operations
- Orders Service with product validation
- PostgreSQL databases (separate for each service)
- API Gateway routing
- Automatic database migrations
- Product seeding (20 initial products)
