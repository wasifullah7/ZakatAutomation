import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KTIcon } from '../../helpers/icons';

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { isAdmin, isDonor, isAcceptor } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'element-11',
      path: '/dashboard',
      roles: ['admin', 'donor', 'acceptor'],
    },
    {
      title: 'Users',
      icon: 'profile-user',
      path: '/admin/users',
      roles: ['admin'],
    },
    {
      title: 'Reports',
      icon: 'chart-line',
      path: '/admin/reports',
      roles: ['admin'],
    },
    {
      title: 'Calculate Zakat',
      icon: 'calculator',
      path: '/donor/calculate',
      roles: ['donor'],
    },
    {
      title: 'Make Payment',
      icon: 'dollar',
      path: '/donor/payment',
      roles: ['donor'],
    },
    {
      title: 'Payment History',
      icon: 'clock',
      path: '/donor/history',
      roles: ['donor'],
    },
    {
      title: 'View Requests',
      icon: 'document',
      path: '/acceptor/requests',
      roles: ['acceptor'],
    },
    {
      title: 'Update Profile',
      icon: 'profile-circle',
      path: '/acceptor/profile',
      roles: ['acceptor'],
    },
    {
      title: 'Request History',
      icon: 'clock',
      path: '/acceptor/history',
      roles: ['acceptor'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (isAdmin) return item.roles.includes('admin');
    if (isDonor) return item.roles.includes('donor');
    if (isAcceptor) return item.roles.includes('acceptor');
    return false;
  });

  return (
    <div
      id="kt_aside"
      className={`aside ${open ? 'aside-on' : 'aside-off'} d-flex flex-column flex-row-auto`}
    >
      <div className="aside-logo flex-column-auto" id="kt_aside_logo">
        <a href="/" className="text-decoration-none">
          <h1 className="text-white fw-bold">Zakat System</h1>
        </a>
        <div
          id="kt_aside_toggle"
          className="btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle"
          data-kt-toggle="true"
          data-kt-toggle-state="active"
          data-kt-toggle-target="body"
          data-kt-toggle-name="aside-minimize"
          onClick={() => setOpen(!open)}
        >
          <KTIcon iconName="arrow-left" className="fs-1 rotate-180" />
        </div>
      </div>

      <div className="aside-menu flex-column-fluid">
        <div className="hover-scroll-overlay-y px-2 my-4 my-lg-8" id="kt_aside_menu_wrapper">
          <div
            id="kt_aside_menu"
            className="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
            data-kt-menu="true"
          >
            {filteredMenuItems.map((item, index) => (
              <div key={index} className="menu-item">
                <a
                  className="menu-link"
                  onClick={() => navigate(item.path)}
                >
                  <span className="menu-icon">
                    <KTIcon iconName={item.icon} className="fs-2" />
                  </span>
                  <span className="menu-title">{item.title}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 