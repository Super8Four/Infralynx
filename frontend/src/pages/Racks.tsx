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
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Rack {
  id: string;
  name: string;
  description: string;
  status: string;
  siteId: string;
  capacity: number;
  usedUnits: number;
}

const Racks = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [racks, setRacks] = useState<Rack[]>([
    {
      id: '1',
      name: 'Rack-01',
      description: 'Main server rack',
      status: 'Active',
      siteId: 'Site-01',
      capacity: 42,
      usedUnits: 15,
    },
  ]);

  const handleAddRack = () => {
    setSelectedRack(null);
    setShowModal(true);
  };

  const handleEditRack = (rack: Rack) => {
    setSelectedRack(rack);
    setShowModal(true);
  };

  const handleDeleteRack = (rackId: string) => {
    if (window.confirm('Are you sure you want to delete this rack?')) {
      setRacks(racks.filter((rack) => rack.id !== rackId));
    }
  };

  const calculateUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Racks</h2>
        <Button variant="primary" onClick={handleAddRack}>
          <AddIcon className="me-2" />
          Add Rack
        </Button>
      </div>

      <Card className="table-container">
        <Table responsive hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Site</th>
              <th>Capacity</th>
              <th>Usage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {racks.map((rack) => (
              <tr key={rack.id}>
                <td>{rack.name}</td>
                <td>{rack.description}</td>
                <td>
                  <span
                    className={`badge bg-${
                      rack.status === 'Active' ? 'success' : 'warning'
                    }`}
                  >
                    {rack.status}
                  </span>
                </td>
                <td>{rack.siteId}</td>
                <td>{rack.capacity}U</td>
                <td>
                  <div className="d-flex align-items-center">
                    <div
                      className="progress flex-grow-1 me-2"
                      style={{ height: '8px' }}
                    >
                      <div
                        className={`progress-bar ${
                          calculateUsagePercentage(rack.usedUnits, rack.capacity) >
                          80
                            ? 'bg-danger'
                            : calculateUsagePercentage(
                                rack.usedUnits,
                                rack.capacity
                              ) > 60
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        role="progressbar"
                        style={{
                          width: `${calculateUsagePercentage(
                            rack.usedUnits,
                            rack.capacity
                          )}%`,
                        }}
                      />
                    </div>
                    <span>
                      {rack.usedUnits}/{rack.capacity}U
                    </span>
                  </div>
                </td>
                <td>
                  <Button
                    variant="link"
                    className="text-primary p-0 me-2"
                    onClick={() => handleEditRack(rack)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={() => handleDeleteRack(rack.id)}
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
            {selectedRack ? 'Edit Rack' : 'Add Rack'}
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
                    defaultValue={selectedRack?.name}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={selectedRack?.status}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                defaultValue={selectedRack?.description}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site</Form.Label>
                  <Form.Select defaultValue={selectedRack?.siteId}>
                    <option value="Site-01">Site-01</option>
                    <option value="Site-02">Site-02</option>
                    <option value="Site-03">Site-03</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity (U)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="48"
                    defaultValue={selectedRack?.capacity}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Racks; 