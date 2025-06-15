import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Computer as DeviceIcon,
  ViewModule as RackIcon,
  Business as SiteIcon,
  Router as IPIcon,
} from '@mui/icons-material';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/devices', label: 'Devices', icon: <DeviceIcon /> },
    { path: '/racks', label: 'Racks', icon: <RackIcon /> },
    { path: '/sites', label: 'Sites', icon: <SiteIcon /> },
    { path: '/ip-management', label: 'IP Management', icon: <IPIcon /> },
  ];

  return (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h5 className="mb-0">InfraLynx</h5>
      </div>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`sidebar-menu-item ${
              location.pathname === item.path ? 'active' : ''
            }`}
          >
            <span className="sidebar-menu-icon">{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar; 