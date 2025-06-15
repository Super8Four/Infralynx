import { Navbar as BootstrapNavbar, Container, Button } from 'react-bootstrap';
import { Menu as MenuIcon, Notifications, Person } from '@mui/icons-material';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <BootstrapNavbar className="navbar" variant="dark" expand="lg">
      <Container fluid>
        <Button
          variant="link"
          className="text-white me-3"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </Button>
        <BootstrapNavbar.Brand href="/">InfraLynx</BootstrapNavbar.Brand>
        <div className="ms-auto d-flex align-items-center">
          <Button variant="link" className="text-white me-2">
            <Notifications />
          </Button>
          <Button variant="link" className="text-white">
            <Person />
          </Button>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 