import { NavLink, Outlet } from 'react-router';
import { useState } from 'react';

export function AppLayout() {
  const [open, setOpen] = useState({
    sites: true,
    ipam: true,
    settings: true,
    administration: false,
    organization: false,
  });
  const toggle = (section: keyof typeof open) =>
    setOpen((current) => ({ ...current, [section]: !current[section] }));
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
              <li className="nav-header">ORGANIZATION</li>
              <li className={`nav-item ${open.sites ? 'menu-open' : ''}`}>
                <button
                  className="nav-link sidebar-toggle"
                  type="button"
                  onClick={() => toggle('sites')}
                  aria-expanded={open.sites}
                >
                  <i className="nav-icon bi bi-buildings" />
                  <p>
                    Sites
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </button>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/sites" className="nav-link">
                      <i className="nav-icon bi bi-building" />
                      <p>Sites</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/sites#locations" className="nav-link">
                      <i className="nav-icon bi bi-geo-alt" />
                      <p>Locations</p>
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-header">IPAM</li>
              <li className={`nav-item ${open.ipam ? 'menu-open' : ''}`}>
                <button
                  className="nav-link sidebar-toggle"
                  type="button"
                  onClick={() => toggle('ipam')}
                  aria-expanded={open.ipam}
                >
                  <i className="nav-icon bi bi-diagram-3" />
                  <p>
                    IPAM
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </button>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink to="/ipam/addresses" className="nav-link">
                      <i className="nav-icon bi bi-hdd-network" />
                      <p>Addresses</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/prefixes" className="nav-link">
                      <i className="nav-icon bi bi-diagram-3" />
                      <p>Prefixes</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/ipam/asns" className="nav-link">
                      <i className="nav-icon bi bi-globe2" />
                      <p>ASNs</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/ipam/aggregates" className="nav-link">
                      <i className="nav-icon bi bi-signpost-split" />
                      <p>Aggregates</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/ipam/vrfs" className="nav-link">
                      <i className="nav-icon bi bi-shuffle" />
                      <p>VRFs</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/ipam/vlans" className="nav-link">
                      <i className="nav-icon bi bi-bezier2" />
                      <p>VLANs</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/ipam/other" className="nav-link">
                      <i className="nav-icon bi bi-three-dots" />
                      <p>Other</p>
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink to="/import" className="nav-link">
                  <i className="nav-icon bi bi-box-arrow-in-down" />
                  <p>Import</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/tags" className="nav-link">
                  <i className="nav-icon bi bi-tags" />
                  <p>Tags</p>
                </NavLink>
              </li>

              <li className="nav-header">SETTINGS</li>
              <li className={`nav-item ${open.settings ? 'menu-open' : ''}`}>
                <button
                  className="nav-link sidebar-toggle"
                  type="button"
                  onClick={() => toggle('settings')}
                  aria-expanded={open.settings}
                >
                  <i className="nav-icon bi bi-gear" />
                  <p>
                    Settings
                    <i className="nav-arrow bi bi-chevron-right" />
                  </p>
                </button>
                <ul className="nav nav-treeview">
                  <li
                    className={`nav-item ${open.administration ? 'menu-open' : ''}`}
                  >
                    <button
                      className="nav-link sidebar-toggle"
                      type="button"
                      onClick={() => toggle('administration')}
                      aria-expanded={open.administration}
                    >
                      <i className="nav-icon bi bi-shield-lock" />
                      <p>
                        Administration
                        <i className="nav-arrow bi bi-chevron-right" />
                      </p>
                    </button>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <NavLink to="/settings/users" className="nav-link">
                          <i className="nav-icon bi bi-person" />
                          <p>Users</p>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink to="/settings/groups" className="nav-link">
                          <i className="nav-icon bi bi-people" />
                          <p>Groups</p>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink to="/settings/api-tokens" className="nav-link">
                          <i className="nav-icon bi bi-key" />
                          <p>API tokens</p>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/settings/permissions"
                          className="nav-link"
                        >
                          <i className="nav-icon bi bi-shield-check" />
                          <p>Permissions</p>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li
                    className={`nav-item ${open.organization ? 'menu-open' : ''}`}
                  >
                    <button
                      className="nav-link sidebar-toggle"
                      type="button"
                      onClick={() => toggle('organization')}
                      aria-expanded={open.organization}
                    >
                      <i className="nav-icon bi bi-diagram-2" />
                      <p>
                        Organization
                        <i className="nav-arrow bi bi-chevron-right" />
                      </p>
                    </button>
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <NavLink to="/settings/tenants" className="nav-link">
                          <i className="nav-icon bi bi-person-workspace" />
                          <p>Tenants</p>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink to="/sites#regions" className="nav-link">
                          <i className="nav-icon bi bi-globe-americas" />
                          <p>Regions</p>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink to="/sites#site-groups" className="nav-link">
                          <i className="nav-icon bi bi-collection" />
                          <p>Site groups</p>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/settings/system" className="nav-link">
                      <i className="nav-icon bi bi-cpu" />
                      <p>System</p>
                    </NavLink>
                  </li>
                </ul>
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
