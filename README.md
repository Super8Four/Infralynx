# InfraLynx

A modern infrastructure management system built with Node.js, TypeScript, and PostgreSQL.

## Features

- Device management (servers, network equipment, etc.)
- Rack management with capacity tracking
- Site management
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

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/infralynx?schema=public"
PORT=3000
NODE_ENV=development
```

4. Set up the database:
```bash
# Create the database
createdb infralynx

# Run migrations
npx prisma migrate dev

# Initialize with sample data
npm run db:init
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start at http://localhost:3000

## Testing

1. Set up test database:
```bash
createdb infralynx_test
```

2. Run tests:
```bash
npm test
```

## API Endpoints

### Devices

- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get device by ID
- `POST /api/devices` - Create new device
- `PATCH /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device

Request body for POST/PATCH:
```json
{
  "name": "string",
  "type": "string",
  "status": "string",
  "rackId": "number (optional)",
  "siteId": "number (optional)"
}
```

### Racks

- `GET /api/racks` - Get all racks
- `GET /api/racks/:id` - Get rack by ID
- `POST /api/racks` - Create new rack
- `PATCH /api/racks/:id` - Update rack
- `DELETE /api/racks/:id` - Delete rack

Request body for POST/PATCH:
```json
{
  "name": "string",
  "location": "string",
  "capacity": "number",
  "siteId": "number (optional)"
}
```

### Sites

- `GET /api/sites` - Get all sites
- `GET /api/sites/:id` - Get site by ID
- `POST /api/sites` - Create new site
- `PATCH /api/sites/:id` - Update site
- `DELETE /api/sites/:id` - Delete site

Request body for POST/PATCH:
```json
{
  "name": "string",
  "address": "string"
}
```

## Response Format

All API responses follow this format:
```json
{
  "status": "success" | "fail" | "error",
  "data": object | array | null,
  "message": "string (only for errors)"
}
```

## Database Schema

### Device
- id: number
- name: string
- type: string
- status: string
- rackId: number (optional)
- siteId: number (optional)
- createdAt: Date
- updatedAt: Date

### Rack
- id: number
- name: string
- location: string
- capacity: number
- siteId: number (optional)
- createdAt: Date
- updatedAt: Date

### Site
- id: number
- name: string
- address: string
- createdAt: Date
- updatedAt: Date

## Frontend (Coming Soon)

The frontend will be built with:
- React + TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls

Features:
- Modern, responsive dashboard
- Device management interface
- Rack visualization
- Site management
- Search and filtering
- Real-time updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
