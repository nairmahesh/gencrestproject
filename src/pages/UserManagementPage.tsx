import DashboardLayout from '../layouts/DashboradLayout';

const UserManagementPage = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">User Management</h1>
      <p>This page is for Admins to create, update, and manage users.</p>
    </DashboardLayout>
  );
};

export default UserManagementPage;