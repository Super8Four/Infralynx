# InfraLynx

InfraLynx is a modern infrastructure management system designed to help organizations efficiently manage their IT infrastructure, including devices, racks, sites, and IP addresses.

## Features

### Backend
- RESTful API built with Node.js, Express, and TypeScript
- PostgreSQL database with Prisma ORM
- Comprehensive data models for devices, racks, sites, and IP management
- Input validation and error handling
- Environment-based configuration
- API documentation with Swagger/OpenAPI

### Frontend
- Modern React application with TypeScript
- Bootstrap-based responsive UI
- Material UI icons integration
- Protected routes and authentication
- Real-time data updates
- Interactive dashboards and charts
- Comprehensive device, rack, and site management
- IP address management with prefix support
- User settings and preferences

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/infralynx.git
   cd infralynx
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Create a `.env` file in the root directory:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/infralynx"
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   ```

5. Initialize the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

## Development

### Backend
```bash
# Start the development server
npm run dev

# Run tests
npm test

# Generate Prisma client
npx prisma generate
```

### Frontend
```bash
cd frontend

# Start the development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## API Endpoints

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create a new device
- `GET /api/devices/:id` - Get device details
- `PATCH /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device

### Racks
- `GET /api/racks` - List all racks
- `POST /api/racks` - Create a new rack
- `GET /api/racks/:id` - Get rack details
- `PATCH /api/racks/:id` - Update rack
- `DELETE /api/racks/:id` - Delete rack

### Sites
- `GET /api/sites` - List all sites
- `POST /api/sites` - Create a new site
- `GET /api/sites/:id` - Get site details
- `PATCH /api/sites/:id` - Update site
- `DELETE /api/sites/:id` - Delete site

### IP Management
- `GET /api/ip/prefixes` - List all IP prefixes
- `POST /api/ip/prefixes` - Create a new IP prefix
- `GET /api/ip/prefixes/:id` - Get prefix details
- `PATCH /api/ip/prefixes/:id` - Update prefix
- `DELETE /api/ip/prefixes/:id` - Delete prefix
- `GET /api/ip/addresses` - List all IP addresses
- `POST /api/ip/addresses` - Create a new IP address
- `GET /api/ip/addresses/:id` - Get address details
- `PATCH /api/ip/addresses/:id` - Update address
- `DELETE /api/ip/addresses/:id` - Delete address

## Database Schema

### Device
- id: UUID (primary key)
- name: String
- type: String
- status: String
- rackId: UUID (foreign key)
- siteId: UUID (foreign key)
- model: String
- serialNumber: String
- manufacturer: String
- ipAddresses: IPAddress[]
- createdAt: DateTime
- updatedAt: DateTime

### Rack
- id: UUID (primary key)
- name: String
- status: String
- siteId: UUID (foreign key)
- capacity: Int
- usedUnits: Int
- devices: Device[]
- ipPrefixes: IPPrefix[]
- createdAt: DateTime
- updatedAt: DateTime

### Site
- id: UUID (primary key)
- name: String
- description: String
- address: String
- status: String
- racks: Rack[]
- ipPrefixes: IPPrefix[]
- createdAt: DateTime
- updatedAt: DateTime

### IPPrefix
- id: UUID (primary key)
- prefix: String
- description: String
- status: String
- siteId: UUID (foreign key)
- rackId: UUID (foreign key)
- parentId: UUID (foreign key)
- ipAddresses: IPAddress[]
- createdAt: DateTime
- updatedAt: DateTime

### IPAddress
- id: UUID (primary key)
- address: String
- description: String
- status: String
- deviceId: UUID (foreign key)
- prefixId: UUID (foreign key)
- createdAt: DateTime
- updatedAt: DateTime

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
