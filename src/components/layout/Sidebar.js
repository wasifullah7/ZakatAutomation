import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { KTIcon } from '../../helpers/icons';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'element-11',
      roles: ['admin', 'donor', 'acceptor']
    },
    {
      title: 'Donations',
      path: '/donations',
      icon: 'handcart',
      roles: ['admin', 'donor']
    },
    {
      title: 'Requests',
      path: '/requests',
      icon: 'document',
      roles: ['admin', 'acceptor']
    },
    {
      title: 'Beneficiaries',
      path: '/beneficiaries',
      icon: 'profile-user',
      roles: ['admin']
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: 'chart-line',
      roles: ['admin']
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: 'setting-2',
      roles: ['admin', 'donor', 'acceptor']
    }
  ];

  return (
    <div className="sidebar bg-white border-end">
      <div className="sidebar-header p-3 border-bottom">
        <h3 className="fs-4 fw-bold mb-0">Zakat Automation</h3>
      </div>

      <div className="sidebar-body">
        <div className="nav flex-column">
          {menuItems.map((item) => {
            if (item.roles.includes(user?.role)) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link d-flex align-items-center py-3 px-4 ${
                    isActive(item.path) ? 'active' : ''
                  }`}
                >
                  <KTIcon
                    iconName={item.icon}
                    className={`fs-2 me-3 ${
                      isActive(item.path) ? 'text-primary' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`${
                      isActive(item.path) ? 'text-primary fw-bold' : 'text-gray-700'
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="sidebar-footer p-3 border-top">
        <div className="d-flex align-items-center">
          <div className="symbol symbol-35px symbol-circle me-3">
            <img
              src={user?.profileImage || '/default-avatar.png'}
              alt={user?.name}
              className="rounded-circle"
            />
          </div>
          <div>
            <div className="fw-bold">{user?.name}</div>
            <div className="text-muted small">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 