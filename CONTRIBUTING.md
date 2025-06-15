# Contributing to InfraLynx

Thank you for your interest in contributing to InfraLynx! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the Issues section
2. If not, create a new issue with a clear and descriptive title
3. Include as much relevant information as possible:
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node.js version, etc.)

### Suggesting Features

1. Check if the feature has already been suggested in the Issues section
2. If not, create a new issue with a clear and descriptive title
3. Provide a detailed description of the feature
4. Explain why this feature would be useful
5. Include any relevant examples or mockups

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Update documentation if necessary
7. Submit a pull request

### Development Workflow

1. Install dependencies:
   ```bash
   # Backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```

2. Set up the development environment:
   ```bash
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development servers:
   ```bash
   # Backend
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend
   npm run dev
   ```

### Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Write clear and concise comments
- Keep functions small and focused
- Use TypeScript types and interfaces
- Follow ESLint rules

### Testing

- Write tests for new features
- Update tests when fixing bugs
- Ensure all tests pass before submitting PR
- Maintain good test coverage

### Documentation

- Update README.md if needed
- Add JSDoc comments for new functions
- Update API documentation
- Include examples for new features

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation with any new features or changes
3. The PR will be merged once you have the sign-off of at least one maintainer
4. Ensure all CI checks pass

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/infralynx"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### Database Setup

```bash
# Create database
createdb infralynx

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

## Questions?

Feel free to open an issue if you have any questions about contributing to InfraLynx. 