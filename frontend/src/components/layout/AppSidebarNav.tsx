import {
  cilSpeedometer,
  cilDevices,
  cilStorage,
  cilLocationPin,
  cilNetwork,
  cilSettings,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import { useLocation } from 'react-router-dom';

export const AppSidebarNav = () => {
  const location = useLocation();

  const navItems = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Infrastructure',
    },
    {
      component: CNavItem,
      name: 'Devices',
      to: '/devices',
      icon: <CIcon icon={cilDevices} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Racks',
      to: '/racks',
      icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Sites',
      to: '/sites',
      icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'IP Management',
      to: '/ip-management',
      icon: <CIcon icon={cilNetwork} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Settings',
    },
    {
      component: CNavItem,
      name: 'Settings',
      to: '/settings',
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
  ];

  return (
    <ul className="nav flex-column">
      {navItems.map((item, index) => {
        if (item.component === CNavTitle) {
          return (
            <li key={index} className="nav-title">
              {item.name}
            </li>
          );
        }
        return (
          <li key={index} className="nav-item">
            <item.component
              to={item.to}
              className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
            >
              {item.icon}
              {item.name}
            </item.component>
          </li>
        );
      })}
    </ul>
  );
}; 