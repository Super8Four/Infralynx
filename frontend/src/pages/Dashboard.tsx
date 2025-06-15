import { Row, Col, Card } from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Computer as DeviceIcon,
  ViewModule as RackIcon,
  Business as SiteIcon,
  Router as IPIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  // Sample data for charts
  const deviceData = [
    { name: 'Servers', count: 45 },
    { name: 'Switches', count: 30 },
    { name: 'Routers', count: 15 },
    { name: 'Storage', count: 20 },
  ];

  const stats = [
    { title: 'Total Devices', value: '110', icon: <DeviceIcon />, color: '#3498db' },
    { title: 'Racks', value: '25', icon: <RackIcon />, color: '#2ecc71' },
    { title: 'Sites', value: '5', icon: <SiteIcon />, color: '#e74c3c' },
    { title: 'IP Addresses', value: '500', icon: <IPIcon />, color: '#f1c40f' },
  ];

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Statistics Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col key={index} md={3} sm={6} className="mb-3">
            <Card className="dashboard-card h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                  <div>
                    <h6 className="mb-1">{stat.title}</h6>
                    <h3 className="mb-0">{stat.value}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="dashboard-card-title">Device Distribution</h5>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="dashboard-card">
            <Card.Body>
              <h5 className="dashboard-card-title">Recent Activity</h5>
              <div className="activity-list">
                <div className="activity-item d-flex align-items-center mb-3">
                  <div className="activity-icon me-3">
                    <DeviceIcon />
                  </div>
                  <div>
                    <p className="mb-0">New server added to Rack-01</p>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                </div>
                <div className="activity-item d-flex align-items-center mb-3">
                  <div className="activity-icon me-3">
                    <IPIcon />
                  </div>
                  <div>
                    <p className="mb-0">IP address assigned to Server-02</p>
                    <small className="text-muted">4 hours ago</small>
                  </div>
                </div>
                <div className="activity-item d-flex align-items-center">
                  <div className="activity-icon me-3">
                    <RackIcon />
                  </div>
                  <div>
                    <p className="mb-0">Rack-03 status updated</p>
                    <small className="text-muted">1 day ago</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 