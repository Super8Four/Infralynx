import { useState } from 'react';
import {
  Table,
  Button,
  Form,
  Modal,
  Row,
  Col,
  Card,
  Tabs,
  Tab,
} from 'react-bootstrap';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface IPPrefix {
  id: string;
  prefix: string;
  description: string;
  status: string;
  siteId: string;
  parentId?: string;
}

interface IPAddress {
  id: string;
  address: string;
  description: string;
  status: string;
  deviceId: string;
  prefixId: string;
}

const IPManagement = () => {
  const [activeTab, setActiveTab] = useState('prefixes');
  const [showPrefixModal, setShowPrefixModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState<IPPrefix | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<IPAddress | null>(null);

  const [prefixes, setPrefixes] = useState<IPPrefix[]>([
    {
      id: '1',
      prefix: '192.168.1.0/24',
      description: 'Main network',
      status: 'Active',
      siteId: 'Site-01',
    },
  ]);

  const [addresses, setAddresses] = useState<IPAddress[]>([
    {
      id: '1',
      address: '192.168.1.1',
      description: 'Gateway',
      status: 'Active',
      deviceId: 'Server-01',
      prefixId: '192.168.1.0/24',
    },
  ]);

  const handleAddPrefix = () => {
    setSelectedPrefix(null);
    setShowPrefixModal(true);
  };

  const handleEditPrefix = (prefix: IPPrefix) => {
    setSelectedPrefix(prefix);
    setShowPrefixModal(true);
  };

  const handleDeletePrefix = (prefixId: string) => {
    if (window.confirm('Are you sure you want to delete this prefix?')) {
      setPrefixes(prefixes.filter((prefix) => prefix.id !== prefixId));
    }
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: IPAddress) => {
    setSelectedAddress(address);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter((address) => address.id !== addressId));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>IP Management</h2>
      </div>

      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'prefixes')}
            className="mb-3"
          >
            <Tab eventKey="prefixes" title="IP Prefixes">
              <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={handleAddPrefix}>
                  <AddIcon className="me-2" />
                  Add Prefix
                </Button>
              </div>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Prefix</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Site</th>
                    <th>Parent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prefixes.map((prefix) => (
                    <tr key={prefix.id}>
                      <td>{prefix.prefix}</td>
                      <td>{prefix.description}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            prefix.status === 'Active' ? 'success' : 'warning'
                          }`}
                        >
                          {prefix.status}
                        </span>
                      </td>
                      <td>{prefix.siteId}</td>
                      <td>{prefix.parentId || '-'}</td>
                      <td>
                        <Button
                          variant="link"
                          className="text-primary p-0 me-2"
                          onClick={() => handleEditPrefix(prefix)}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => handleDeletePrefix(prefix.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            <Tab eventKey="addresses" title="IP Addresses">
              <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={handleAddAddress}>
                  <AddIcon className="me-2" />
                  Add Address
                </Button>
              </div>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Device</th>
                    <th>Prefix</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((address) => (
                    <tr key={address.id}>
                      <td>{address.address}</td>
                      <td>{address.description}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            address.status === 'Active' ? 'success' : 'warning'
                          }`}
                        >
                          {address.status}
                        </span>
                      </td>
                      <td>{address.deviceId}</td>
                      <td>{address.prefixId}</td>
                      <td>
                        <Button
                          variant="link"
                          className="text-primary p-0 me-2"
                          onClick={() => handleEditAddress(address)}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Prefix Modal */}
      <Modal show={showPrefixModal} onHide={() => setShowPrefixModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPrefix ? 'Edit IP Prefix' : 'Add IP Prefix'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Prefix (CIDR)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 192.168.1.0/24"
                defaultValue={selectedPrefix?.prefix}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedPrefix?.description}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={selectedPrefix?.status}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Reserved">Reserved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site</Form.Label>
                  <Form.Select defaultValue={selectedPrefix?.siteId}>
                    <option value="Site-01">Site-01</option>
                    <option value="Site-02">Site-02</option>
                    <option value="Site-03">Site-03</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Parent Prefix (Optional)</Form.Label>
              <Form.Select defaultValue={selectedPrefix?.parentId}>
                <option value="">None</option>
                <option value="192.168.0.0/16">192.168.0.0/16</option>
                <option value="10.0.0.0/8">10.0.0.0/8</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrefixModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowPrefixModal(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Address Modal */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAddress ? 'Edit IP Address' : 'Add IP Address'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>IP Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 192.168.1.1"
                defaultValue={selectedAddress?.address}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedAddress?.description}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={selectedAddress?.status}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Reserved">Reserved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Device</Form.Label>
                  <Form.Select defaultValue={selectedAddress?.deviceId}>
                    <option value="Server-01">Server-01</option>
                    <option value="Server-02">Server-02</option>
                    <option value="Switch-01">Switch-01</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Prefix</Form.Label>
              <Form.Select defaultValue={selectedAddress?.prefixId}>
                <option value="192.168.1.0/24">192.168.1.0/24</option>
                <option value="10.0.0.0/24">10.0.0.0/24</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowAddressModal(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IPManagement; 