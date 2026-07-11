import { NavLink, Outlet } from 'react-router';

export function AppLayout() {
  return (
    <div className="app-wrapper">
      <nav className="app-header navbar navbar-expand bg-body">
        <div className="container-fluid">
          <button
            className="btn btn-link nav-link"
            type="button"
            data-lte-toggle="sidebar"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list" />
          </button>
          <span className="navbar-text ms-auto small">Infralynx 0.1.0</span>
        </div>
      </nav>

      <aside
        className="app-sidebar bg-body-secondary shadow"
        data-bs-theme="dark"
      >
        <div className="sidebar-brand">
          <NavLink to="/" className="brand-link text-decoration-none">
            <span className="brand-text fw-light">Infralynx</span>
          </NavLink>
        </div>
        <div className="sidebar-wrapper">
          <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" role="menu">
              <li className="nav-item">
                <NavLink to="/" end className="nav-link">
                  <i className="nav-icon bi bi-speedometer2" />
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-header">FACILITIES</li>
              <li className="nav-item">
                <NavLink to="/sites" className="nav-link">
                  <i className="nav-icon bi bi-buildings" />
                  <p>Site management</p>
                </NavLink>
              </li>
              <li className="nav-header">IPAM</li>
              <li className="nav-item">
                <NavLink to="/prefixes" className="nav-link">
                  <i className="nav-icon bi bi-diagram-3" />
                  <p>Prefixes</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-content-header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">
                <h3 className="mb-0">Infrastructure management</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="app-content">
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <strong>Infralynx</strong> · Portable IPAM and DCIM
      </footer>
    </div>
  );
}
