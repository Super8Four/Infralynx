# InfraLynx

A modern infrastructure management system for tracking and managing data center assets, including devices, racks, sites, and IP addresses.

## Features

- **Device Management**: Track servers, network equipment, and other devices
- **Rack Management**: Organize devices within racks and track rack space utilization
- **Site Management**: Manage multiple data center locations
- **IP Address Management**: Track IPv4 and IPv6 addresses and prefixes
  - Hierarchical IP prefix management
  - IP address assignment to devices
  - Support for both IPv4 and IPv6
  - Status tracking for IP resources
  - Parent-child relationships for IP prefixes
- RESTful API
- TypeScript support
- PostgreSQL database with Prisma ORM
- Comprehensive test suite
- Modern React frontend (coming soon)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/infralynx.git
cd infralynx
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/infralynx"
PORT=3000
NODE_ENV=development
```

4. Initialize the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create a new device
- `GET /api/devices/:id` - Get device details
- `PATCH /api/devices/:id` - Update a device
- `DELETE /api/devices/:id` - Delete a device

### Racks
- `GET /api/racks` - List all racks
- `POST /api/racks` - Create a new rack
- `GET /api/racks/:id` - Get rack details
- `PATCH /api/racks/:id` - Update a rack
- `DELETE /api/racks/:id` - Delete a rack

### Sites
- `GET /api/sites` - List all sites
- `POST /api/sites` - Create a new site
- `GET /api/sites/:id` - Get site details
- `PATCH /api/sites/:id` - Update a site
- `DELETE /api/sites/:id` - Delete a site

### IP Management
- `GET /api/ip/prefixes` - List all IP prefixes
- `POST /api/ip/prefixes` - Create a new IP prefix
- `GET /api/ip/prefixes/:id` - Get IP prefix details
- `PATCH /api/ip/prefixes/:id` - Update an IP prefix
- `DELETE /api/ip/prefixes/:id` - Delete an IP prefix
- `GET /api/ip/addresses` - List all IP addresses
- `POST /api/ip/addresses` - Create a new IP address
- `GET /api/ip/addresses/:id` - Get IP address details
- `PATCH /api/ip/addresses/:id` - Update an IP address
- `DELETE /api/ip/addresses/:id` - Delete an IP address

### Request Body Examples

#### Create IP Prefix
```json
{
  "prefix": "192.168.1.0/24",
  "description": "Main network",
  "status": "ACTIVE",
  "siteId": "site-uuid",
  "parentId": "parent-prefix-uuid" // Optional
}
```

#### Create IP Address
```json
{
  "address": "192.168.1.1",
  "description": "Gateway",
  "status": "ACTIVE",
  "deviceId": "device-uuid",
  "prefixId": "prefix-uuid"
}
```

### Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

## Development

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
npx prisma migrate dev
```

### Generating Prisma Client
```bash
npx prisma generate
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
