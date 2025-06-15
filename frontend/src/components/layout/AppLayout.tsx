import { useState } from 'react';
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CImage,
} from '@coreui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cilMenu, cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { AppSidebarNav } from './AppSidebarNav';
import { useAuth } from '../../hooks/useAuth';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarShow, setSidebarShow] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      <CHeader className="header header-sticky mb-4">
        <CContainer fluid>
          <CHeaderToggler
            className="ps-1"
            onClick={() => setSidebarShow(!sidebarShow)}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderBrand className="mx-auto d-md-none" to="/">
            <CImage
              src="/logo.png"
              height={35}
              alt="InfraLynx Logo"
              className="d-inline-block align-top"
            />
          </CHeaderBrand>
          <CHeaderNav className="d-none d-md-flex me-auto">
            <CHeaderNav className="px-3">
              <CHeaderToggler
                className="ps-1"
                onClick={() => setSidebarShow(!sidebarShow)}
              >
                <CIcon icon={cilMenu} size="lg" />
              </CHeaderToggler>
            </CHeaderNav>
          </CHeaderNav>
          <CHeaderNav>
            <CHeaderNav className="px-3">
              <CHeaderToggler
                className="ps-1"
                onClick={handleLogout}
              >
                <CIcon icon={cilAccountLogout} size="lg" />
              </CHeaderToggler>
            </CHeaderNav>
          </CHeaderNav>
        </CContainer>
      </CHeader>
      <div className="body flex-grow-1 px-3">
        <CContainer fluid>
          <div className="d-flex">
            <CSidebar
              position="fixed"
              visible={sidebarShow}
              onVisibleChange={(visible) => setSidebarShow(visible)}
            >
              <CSidebarBrand className="d-none d-md-flex">
                <CImage
                  src="/logo.png"
                  height={35}
                  alt="InfraLynx Logo"
                  className="d-inline-block align-top"
                />
              </CSidebarBrand>
              <CSidebarNav>
                <AppSidebarNav />
              </CSidebarNav>
              <CSidebarToggler
                className="d-none d-lg-flex"
                onClick={() => setSidebarShow(!sidebarShow)}
              />
            </CSidebar>
            <div
              className={`content ${sidebarShow ? 'sidebar-show' : 'sidebar-hide'}`}
            >
              {children}
            </div>
          </div>
        </CContainer>
      </div>
    </div>
  );
};

export default AppLayout; 