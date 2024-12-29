InfraLynx

# InfraLynx

InfraLynx is a powerful and flexible application designed to manage network infrastructure, inspired by NetBox but with enhanced features and a modern user interface. This project is built using Node.js and supports both PostgreSQL and MS SQL databases, making it suitable for deployment on Windows, Linux, and Docker environments.

## Features

- **Device Management**: Easily manage devices within your network.
- **Rack Management**: Organize and manage racks for better infrastructure visibility.
- **Site Management**: Keep track of various sites and their associated devices and racks.
- **API-First Design**: Built with a RESTful API for seamless integration with other tools and services.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL or MS SQL Server
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/InfraLynx.git
   cd InfraLynx
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the database connection in `src/config/database.ts`.

### Running the Application

To run the application locally, use the following command:
```
npm start
```

### Running with Docker

To build and run the application using Docker, execute:
```
docker-compose up --build
```

### Running Tests

To run the integration tests, use:
```
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
