import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Shield, 
  MapPin, 
  Building,
  ArrowLeft,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Crown,
  Award,
  Target
} from 'lucide-react';
import { User, ROLE_HIERARCHY, getRoleByCode } from '../types/hierarchy';
import { UserProfile } from '../components/UserProfile';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Sample users data based on hierarchy
  const [users] = useState<User[]>([
    {
      id: 'U001',
      employeeCode: 'MDO001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gencrest.com',
      phone: '+91 98765 43210',
      role: getRoleByCode('MDO')!,
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      state: 'Delhi',
      reportsTo: 'TSM',
      isActive: true,
      joinDate: '2023-01-15'
    },
    {
      id: 'U002',
      employeeCode: 'TSM001',
      name: 'Priya Sharma',
      email: 'priya.sharma@gencrest.com',
      phone: '+91 87654 32109',
      role: getRoleByCode('TSM')!,
      territory: 'Delhi Territory',
      region: 'Delhi NCR',
      zone: 'North Zone',
      state: 'Delhi',
      reportsTo: 'RBH',
      isActive: true,
      joinDate: '2022-06-10'
    },
    {
      id: 'U003',
      employeeCode: 'RBH001',
      name: 'Amit Patel',
      email: 'amit.patel@gencrest.com',
      phone: '+91 76543 21098',
      role: getRoleByCode('RBH')!,
      region: 'Delhi NCR',
      zone: 'North Zone',
      state: 'Delhi',
      reportsTo: 'RMM',
      isActive: true,
      joinDate: '2021-03-20'
    },
    {
      id: 'U004',
      employeeCode: 'RMM001',
      name: 'Sunita Gupta',
      email: 'sunita.gupta@gencrest.com',
      phone: '+91 65432 10987',
      role: getRoleByCode('RMM')!,
      region: 'North Region',
      zone: 'North Zone',
      reportsTo: 'MH',
      isActive: true,
      joinDate: '2020-08-15'
    },
    {
      id: 'U005',
      employeeCode: 'ZBH001',
      name: 'Vikram Singh',
      email: 'vikram.singh@gencrest.com',
      phone: '+91 54321 09876',
      role: getRoleByCode('ZBH')!,
      zone: 'North Zone',
      reportsTo: 'VP_SM',
      isActive: true,
      joinDate: '2019-11-05'
    },
    {
      id: 'U006',
      employeeCode: 'MH001',
      name: 'Asad Ahmed',
      email: 'asad.ahmed@gencrest.com',
      phone: '+91 43210 98765',
      role: getRoleByCode('MH')!,
      reportsTo: 'VP_SM',
      isActive: true,
      joinDate: '2018-04-12'
    },
    {
      id: 'U007',
      employeeCode: 'MD001',
      name: 'Ravi Agarwal',
      email: 'ravi.agarwal@gencrest.com',
      phone: '+91 32109 87654',
      role: getRoleByCode('MD')!,
      reportsTo: undefined,
      isActive: true,
      joinDate: '2015-01-01'
    },
    {
      id: 'U008',
      employeeCode: 'VP001',
      name: 'Navdeep Mehta',
      email: 'navdeep.mehta@gencrest.com',
      phone: '+91 21098 76543',
      role: getRoleByCode('VP_SM')!,
      reportsTo: 'MD',
      isActive: true,
      joinDate: '2017-01-08'
    },
    {
      id: 'U009',
      employeeCode: 'CHRO001',
      name: 'Meera Joshi',
      email: 'meera.joshi@gencrest.com',
      phone: '+91 10987 65432',
      role: getRoleByCode('CHRO')!,
      reportsTo: 'MD',
      isActive: true,
      joinDate: '2016-09-15'
    },
    {
      id: 'U010',
      employeeCode: 'CFO001',
      name: 'Ashok Bansal',
      email: 'ashok.bansal@gencrest.com',
      phone: '+91 09876 54321',
      role: getRoleByCode('CFO')!,
      reportsTo: 'MD',
      isActive: true,
      joinDate: '2016-12-01'
    }
  ]);

  const getRoleColor = (roleCode: string) => {
    switch (roleCode) {
      case 'MDO': return 'bg-blue-100 text-blue-800';
      case 'TSM': return 'bg-green-100 text-green-800';
      case 'RBH': return 'bg-purple-100 text-purple-800';
      case 'RMM': return 'bg-orange-100 text-orange-800';
      case 'ZBH': return 'bg-indigo-100 text-indigo-800';
      case 'MH': return 'bg-pink-100 text-pink-800';
      case 'VP_SM': return 'bg-red-100 text-red-800';
      case 'MD': return 'bg-gray-900 text-white';
      case 'CHRO': return 'bg-teal-100 text-teal-800';
      case 'CFO': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: number) => {
    if (level >= 8) return <Crown className="w-4 h-4" />;
    if (level >= 6) return <Award className="w-4 h-4" />;
    if (level >= 3) return <Target className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'All' || user.role.code === selectedRole;
    const matchesRegion = selectedRegion === 'All' || user.region === selectedRegion;
    
    return matchesSearch && matchesRole && matchesRegion;
  });

  // Group users by hierarchy level
  const usersByLevel = filteredUsers.reduce((acc, user) => {
    const level = user.role.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(user);
    return acc;
  }, {} as Record<number, User[]>);

  const sortedLevels = Object.keys(usersByLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage organizational hierarchy and user roles</p>
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Field Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => ['MDO', 'TSM'].includes(u.role.code)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Management</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => ['RBH', 'RMM', 'ZBH', 'MH'].includes(u.role.code)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Executives</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => ['VP_SM', 'MD', 'CHRO', 'CFO'].includes(u.role.code)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Roles</option>
            {ROLE_HIERARCHY.map(role => (
              <option key={role.code} value={role.code}>{role.name}</option>
            ))}
          </select>
          
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Regions</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
          </select>
        </div>
      </div>

      {/* Organizational Hierarchy View */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Organizational Hierarchy</h2>
        
        <div className="space-y-6">
          {sortedLevels.map(level => (
            <div key={level} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  {getLevelIcon(level)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Level {level} - {level <= 2 ? 'Field Level' : level <= 4 ? 'Regional Level' : level <= 6 ? 'Zonal Level' : 'Executive Level'}
                </h3>
                <span className="text-sm text-gray-500">({usersByLevel[level].length} users)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-11">
                {usersByLevel[level].map(user => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-xs text-gray-600">{user.employeeCode}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    
                    <div className="mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role.code)}`}>
                        {user.role.name}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      {user.territory && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {user.territory}
                        </div>
                      )}
                      {user.region && (
                        <div>Region: {user.region}</div>
                      )}
                      {user.zone && (
                        <div>Zone: {user.zone}</div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                        className="flex-1 bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs hover:bg-purple-200 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {selectedUser === user.id ? 'Hide' : 'View'}
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 overflow-y-auto">
              <UserProfile 
                user={users.find(u => u.id === selectedUser)!} 
                showFullDetails={true}
              />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Permissions Reference */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3">Role</th>
                <th className="text-left py-2 px-3">Level</th>
                <th className="text-left py-2 px-3">Can Approve</th>
                <th className="text-left py-2 px-3">Reports To</th>
                <th className="text-left py-2 px-3">Key Permissions</th>
              </tr>
            </thead>
            <tbody>
              {ROLE_HIERARCHY.map(role => (
                <tr key={role.code} className="border-b border-gray-100">
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role.code)}`}>
                      {role.code}
                    </span>
                  </td>
                  <td className="py-2 px-3">{role.level}</td>
                  <td className="py-2 px-3">
                    {role.canApprove.length > 0 ? role.canApprove.join(', ') : '-'}
                  </td>
                  <td className="py-2 px-3">{role.reportsTo || '-'}</td>
                  <td className="py-2 px-3">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((perm, index) => (
                        <span key={index} className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {perm.module}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{role.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;