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
  LocationOn as LocationIcon,
} from '@mui/icons-material';

interface Site {
  id: string;
  name: string;
  description: string;
  address: string;
  status: string;
  rackCount: number;
  deviceCount: number;
}

const Sites = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'Main Data Center',
      description: 'Primary data center location',
      address: '123 Main St, City, Country',
      status: 'Active',
      rackCount: 25,
      deviceCount: 110,
    },
  ]);

  const handleAddSite = () => {
    setSelectedSite(null);
    setShowModal(true);
  };

  const handleEditSite = (site: Site) => {
    setSelectedSite(site);
    setShowModal(true);
  };

  const handleDeleteSite = (siteId: string) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      setSites(sites.filter((site) => site.id !== siteId));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Sites</h2>
        <Button variant="primary" onClick={handleAddSite}>
          <AddIcon className="me-2" />
          Add Site
        </Button>
      </div>

      <Card className="table-container">
        <Table responsive hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Address</th>
              <th>Status</th>
              <th>Racks</th>
              <th>Devices</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id}>
                <td>{site.name}</td>
                <td>{site.description}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <LocationIcon className="me-2" style={{ fontSize: 16 }} />
                    {site.address}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge bg-${
                      site.status === 'Active' ? 'success' : 'warning'
                    }`}
                  >
                    {site.status}
                  </span>
                </td>
                <td>{site.rackCount}</td>
                <td>{site.deviceCount}</td>
                <td>
                  <Button
                    variant="link"
                    className="text-primary p-0 me-2"
                    onClick={() => handleEditSite(site)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={() => handleDeleteSite(site.id)}
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
            {selectedSite ? 'Edit Site' : 'Add Site'}
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
                    defaultValue={selectedSite?.name}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={selectedSite?.status}>
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
                defaultValue={selectedSite?.description}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedSite?.address}
              />
            </Form.Group>
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

export default Sites; 