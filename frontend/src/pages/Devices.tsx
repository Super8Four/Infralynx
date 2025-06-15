import { useState } from 'react';
import {
  Table,
  Button,
  Form,
  Modal,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  rackId: string;
  siteId: string;
}

const Devices = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Server-01',
      type: 'Server',
      status: 'Active',
      rackId: 'Rack-01',
      siteId: 'Site-01',
    },
    // Add more sample devices here
  ]);

  const handleAddDevice = () => {
    setSelectedDevice(null);
    setShowModal(true);
  };

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setShowModal(true);
  };

  const handleDeleteDevice = (deviceId: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      setDevices(devices.filter((device) => device.id !== deviceId));
    }
  };

  const handleSaveDevice = (device: Device) => {
    if (selectedDevice) {
      setDevices(
        devices.map((d) => (d.id === device.id ? device : d))
      );
    } else {
      setDevices([...devices, { ...device, id: Date.now().toString() }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Devices</h2>
        <Button variant="primary" onClick={handleAddDevice}>
          <AddIcon className="me-2" />
          Add Device
        </Button>
      </div>

      <Card className="table-container">
        <Table responsive hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Rack</th>
              <th>Site</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td>
                  <span
                    className={`badge bg-${
                      device.status === 'Active' ? 'success' : 'warning'
                    }`}
                  >
                    {device.status}
                  </span>
                </td>
                <td>{device.rackId}</td>
                <td>{device.siteId}</td>
                <td>
                  <Button
                    variant="link"
                    className="text-primary p-0 me-2"
                    onClick={() => handleEditDevice(device)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDevice ? 'Edit Device' : 'Add Device'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={selectedDevice?.name}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select defaultValue={selectedDevice?.type}>
                    <option value="Server">Server</option>
                    <option value="Switch">Switch</option>
                    <option value="Router">Router</option>
                    <option value="Storage">Storage</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={selectedDevice?.status}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rack</Form.Label>
                  <Form.Select defaultValue={selectedDevice?.rackId}>
                    <option value="Rack-01">Rack-01</option>
                    <option value="Rack-02">Rack-02</option>
                    <option value="Rack-03">Rack-03</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Site</Form.Label>
              <Form.Select defaultValue={selectedDevice?.siteId}>
                <option value="Site-01">Site-01</option>
                <option value="Site-02">Site-02</option>
                <option value="Site-03">Site-03</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Handle save logic here
              setShowModal(false);
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Devices; 