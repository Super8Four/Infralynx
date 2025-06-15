import { useState } from 'react';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Nav,
  Tab,
} from 'react-bootstrap';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <h2 className="mb-4">Settings</h2>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'general')}>
        <Row>
          <Col md={3}>
            <Card className="mb-4">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="general" className="d-flex align-items-center">
                      <SettingsIcon className="me-2" />
                      General
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security" className="d-flex align-items-center">
                      <SecurityIcon className="me-2" />
                      Security
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="notifications" className="d-flex align-items-center">
                      <NotificationsIcon className="me-2" />
                      Notifications
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="backup" className="d-flex align-items-center">
                      <StorageIcon className="me-2" />
                      Backup & Restore
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Card>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="general">
                    <h4 className="mb-4">General Settings</h4>
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" defaultValue="InfraLynx" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Time Zone</Form.Label>
                            <Form.Select defaultValue="UTC">
                              <option value="UTC">UTC</option>
                              <option value="EST">EST</option>
                              <option value="PST">PST</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Default Language</Form.Label>
                        <Form.Select defaultValue="en">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </Form.Select>
                      </Form.Group>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="security">
                    <h4 className="mb-4">Security Settings</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="two-factor"
                          label="Enable Two-Factor Authentication"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="session-timeout"
                          label="Enable Session Timeout"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Session Timeout (minutes)</Form.Label>
                        <Form.Control type="number" defaultValue={30} />
                      </Form.Group>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="notifications">
                    <h4 className="mb-4">Notification Settings</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Enable Email Notifications"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="device-alerts"
                          label="Device Status Alerts"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="rack-alerts"
                          label="Rack Capacity Alerts"
                        />
                      </Form.Group>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="backup">
                    <h4 className="mb-4">Backup & Restore</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Backup Frequency</Form.Label>
                        <Form.Select defaultValue="daily">
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Retention Period (days)</Form.Label>
                        <Form.Control type="number" defaultValue={30} />
                      </Form.Group>
                      <div className="d-flex gap-2">
                        <Button variant="primary">Create Backup</Button>
                        <Button variant="secondary">Restore from Backup</Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Button variant="primary">Save Changes</Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Settings; 