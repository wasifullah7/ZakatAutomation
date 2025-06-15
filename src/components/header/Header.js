import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KTIcon } from '../../helpers/icons';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div id="kt_header" className="header align-items-stretch">
      <div className="container-fluid d-flex align-items-stretch justify-content-between">
        <div className="d-flex align-items-center d-lg-none ms-n2 me-2" title="Show aside menu">
          <div className="btn btn-icon btn-active-color-primary w-35px h-35px" id="kt_aside_mobile_toggle">
            <KTIcon iconName="abstract-14" className="fs-1" />
          </div>
        </div>

        <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
          <a href="/" className="d-lg-none">
            <h1 className="text-white fw-bold">Zakat System</h1>
          </a>
        </div>

        <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
          <div className="d-flex align-items-stretch" id="kt_header_nav">
            <div className="header-menu align-items-stretch">
              <div className="menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch">
                <div className="menu-item here show menu-lg-down-accordion me-lg-1">
                  <span className="menu-link">
                    <span className="menu-title">Dashboard</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-stretch flex-shrink-0">
            <div className="d-flex align-items-center ms-1 ms-lg-3" id="kt_header_user_menu_toggle">
              <div
                className="cursor-pointer symbol symbol-30px symbol-md-40px"
                data-kt-menu-trigger="click"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="symbol-label fs-3 bg-light-primary text-primary">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
              </div>

              {showUserMenu && (
                <div
                  className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
                  data-kt-menu="true"
                >
                  <div className="menu-item px-3">
                    <div className="menu-content d-flex align-items-center px-3">
                      <div className="symbol symbol-50px me-3">
                        <div className="symbol-label fs-3 bg-light-primary text-primary">
                          {user?.firstName?.charAt(0)}
                          {user?.lastName?.charAt(0)}
                        </div>
                      </div>

                      <div className="d-flex flex-column">
                        <div className="fw-bolder d-flex align-items-center fs-5">
                          {user?.firstName} {user?.lastName}
                          <span className="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">
                            {user?.role}
                          </span>
                        </div>
                        <a href="#" className="fw-bold text-muted text-hover-primary fs-7">
                          {user?.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="separator my-2"></div>

                  <div className="menu-item px-5">
                    <a onClick={() => navigate('/profile')} className="menu-link px-5">
                      My Profile
                    </a>
                  </div>

                  <div className="menu-item px-5">
                    <a onClick={() => navigate('/settings')} className="menu-link px-5">
                      Settings
                    </a>
                  </div>

                  <div className="separator my-2"></div>

                  <div className="menu-item px-5">
                    <a onClick={onLogout} className="menu-link px-5">
                      Sign Out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 