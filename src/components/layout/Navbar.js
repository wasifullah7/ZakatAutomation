import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { KTIcon } from '../../helpers/icons';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <img src="/th.jpeg" alt="Zakat Automation" height="40" />
        </Link>

        <div className="d-flex align-items-center">
          {/* Search */}
          <div className="d-flex align-items-center me-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <KTIcon iconName="magnifier" className="fs-3" />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="dropdown me-3">
            <button
              className="btn btn-icon btn-light"
              type="button"
              data-bs-toggle="dropdown"
            >
              <KTIcon iconName="notification" className="fs-2" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              <h6 className="dropdown-header">Notifications</h6>
              <a className="dropdown-item" href="#">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <KTIcon iconName="abstract-26" className="fs-2 text-primary" />
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <p className="mb-0">New donation received</p>
                    <small className="text-muted">2 minutes ago</small>
                  </div>
                </div>
              </a>
              {/* Add more notification items */}
            </div>
          </div>

          {/* User Menu */}
          <div className="dropdown">
            <button
              className="btn btn-icon btn-light d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"
            >
              <div className="d-flex align-items-center">
                <div className="symbol symbol-35px symbol-circle">
                  <img
                    src={user?.profileImage || '/default-avatar.png'}
                    alt={user?.name}
                    className="rounded-circle"
                  />
                </div>
                <div className="ms-2 d-none d-md-block">
                  <span className="fw-bold">{user?.firstName} {user?.lastName}</span>
                  <span className="text-muted d-block">{user?.role}</span>
                </div>
              </div>
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="dropdown-item">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-40px me-3">
                    <img
                      src={user?.profileImage || '/default-avatar.png'}
                      alt={user?.name}
                      className="rounded-circle"
                    />
                  </div>
                  <div>
                    <div className="fw-bold">{user?.firstName} {user?.lastName}</div>
                    <div className="text-muted">{user?.email}</div>
                  </div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" to="/profile">
                <KTIcon iconName="user" className="fs-2 me-2" />
                My Profile
              </Link>
              <Link className="dropdown-item" to="/settings">
                <KTIcon iconName="setting-2" className="fs-2 me-2" />
                Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={logout}>
                <KTIcon iconName="exit-right" className="fs-2 me-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 