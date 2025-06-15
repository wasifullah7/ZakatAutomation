import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { KTIcon } from '../../helpers/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardContent = () => {
  const { user } = useAuth();

  // Sample data for charts
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Donations',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#3699FF',
        backgroundColor: 'rgba(54, 153, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Requests',
        data: [8000, 12000, 10000, 18000, 15000, 22000],
        borderColor: '#1BC5BD',
        backgroundColor: 'rgba(27, 197, 189, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ['Food', 'Education', 'Healthcare', 'Shelter', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#3699FF',
          '#1BC5BD',
          '#F64E60',
          '#FFA800',
          '#8950FC',
        ],
      },
    ],
  };

  const stats = [
    {
      title: 'Total Donations',
      value: '$125,000',
      change: '+15%',
      icon: 'handcart',
      color: 'primary',
    },
    {
      title: 'Active Requests',
      value: '45',
      change: '+8%',
      icon: 'document',
      color: 'success',
    },
    {
      title: 'Beneficiaries',
      value: '120',
      change: '+12%',
      icon: 'profile-user',
      color: 'warning',
    },
    {
      title: 'Success Rate',
      value: '92%',
      change: '+5%',
      icon: 'chart-line',
      color: 'info',
    },
  ];

  return (
    <div className="dashboard-content p-4">
      {/* Welcome Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-2hx fw-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">
            Here's what's happening with your Zakat activities today.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-light-primary">
            <KTIcon iconName="plus" className="fs-2" />
            New Donation
          </button>
          <button className="btn btn-light-success">
            <KTIcon iconName="document" className="fs-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-gray-600 fs-6">{stat.title}</span>
                    <h3 className="fs-2hx fw-bold my-2">{stat.value}</h3>
                    <span className={`badge badge-light-${stat.color}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className={`icon-shape bg-light-${stat.color}`}>
                    <KTIcon iconName={stat.icon} className={`fs-2 text-${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4">
        {/* Monthly Overview */}
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title">Monthly Overview</h3>
            </div>
            <div className="card-body">
              <Line
                data={monthlyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title">Category Distribution</h3>
            </div>
            <div className="card-body">
              <Doughnut
                data={categoryData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">Recent Activity</h3>
        </div>
        <div className="card-body">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-line"></div>
              <div className="timeline-icon">
                <KTIcon iconName="abstract-26" className="fs-2 text-primary" />
              </div>
              <div className="timeline-content">
                <div className="d-flex align-items-center mb-2">
                  <div className="fw-bold me-2">New Donation</div>
                  <span className="badge badge-light-success">Completed</span>
                </div>
                <div className="text-gray-600">
                  John Doe donated $5,000 for Education category
                </div>
                <div className="text-gray-500 fs-7">2 hours ago</div>
              </div>
            </div>
            {/* Add more timeline items */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent; 