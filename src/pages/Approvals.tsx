import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Target,
  Filter,
  Search,
  Eye
} from 'lucide-react';
import { ApprovalWorkflow, getApprovalWorkflow, getRoleByCode } from '../types/hierarchy';
import { ApprovalWorkflowComponent } from '../components/ApprovalWorkflow';

const Approvals: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  // Sample approval workflows
  const [workflows] = useState<ApprovalWorkflow[]>([
    {
      id: 'WF001',
      type: 'monthly_plan',
      submittedBy: 'U002',
      submittedByRole: 'TSM',
      currentApprover: 'U003',
      currentApproverRole: 'RBH',
      status: 'pending',
      submissionDate: '2024-01-20T10:00:00Z',
      data: {
        title: 'January 2024 Monthly Plan - MDO Team',
        activities: 45,
        targets: { visits: 35, sales: 500000 },
        territory: 'North Delhi',
        planFor: 'MDO Team and Self'
      },
      approvalChain: [
        {
          approverRole: 'RBH',
          status: 'pending'
        }
      ]
    },
    {
      id: 'WF002',
      type: 'travel_claim',
      submittedBy: 'U001',
      submittedByRole: 'MDO',
      currentApprover: 'U002',
      currentApproverRole: 'TSM',
      status: 'approved',
      submissionDate: '2024-01-18T14:30:00Z',
      approvalDate: '2024-01-19T09:15:00Z',
      comments: 'Approved for client visit expenses',
      data: {
        amount: 2500,
        purpose: 'Client visit - Delhi to Gurgaon',
        distance: 45,
        mode: 'Car'
      },
      approvalChain: [
        {
          approverRole: 'TSM',
          approverUserId: 'U002',
          status: 'approved',
          date: '2024-01-19T09:15:00Z',
          comments: 'Approved for client visit expenses'
        }
      ]
    },
    {
      id: 'WF005',
      type: 'monthly_plan',
      submittedBy: 'U003',
      submittedByRole: 'RBH',
      currentApprover: '',
      currentApproverRole: '',
      status: 'approved',
      submissionDate: '2024-01-19T10:00:00Z',
      approvalDate: '2024-01-19T10:00:00Z',
      comments: 'Auto-approved: RBH creating plan in TSM absence',
      data: {
        title: 'Emergency Monthly Plan - TSM Absent',
        activities: 30,
        targets: { visits: 25, sales: 300000 },
        territory: 'Delhi Territory',
        reason: 'TSM on medical leave'
      },
      approvalChain: [
        {
          approverRole: 'AUTO_APPROVED',
          status: 'approved',
          date: '2024-01-19T10:00:00Z',
          comments: 'Auto-approved: RBH creating plan in TSM absence'
        }
      ]
    },
    {
      id: 'WF003',
      type: 'monthly_plan',
      submittedBy: 'U004',
      submittedByRole: 'RMM',
      currentApprover: 'U006',
      currentApproverRole: 'MH',
      status: 'pending',
      submissionDate: '2024-01-19T16:00:00Z',
      data: {
        title: 'Regional Marketing Plan - Q1 2024',
        budget: 500000,
        campaigns: 3,
        regions: ['Delhi NCR', 'Punjab', 'Haryana']
      },
      approvalChain: [
        {
          approverRole: 'MH',
          status: 'pending'
        }
      ]
    },
    {
      id: 'WF004',
      type: 'monthly_plan',
      submittedBy: 'U005',
      submittedByRole: 'ZBH',
      currentApprover: 'U007',
      currentApproverRole: 'VP_SM',
      status: 'pending',
      submissionDate: '2024-01-21T11:00:00Z',
      data: {
        title: 'Zonal Business Plan - North Zone',
        budget: 2000000,
        territories: 8,
        expectedGrowth: '15%'
      },
      approvalChain: [
        {
          approverRole: 'VP_SM',
          status: 'pending'
        }
      ]
    }
  ]);

  const getTypeIcon = (type: ApprovalWorkflow['type']) => {
    switch (type) {
      case 'monthly_plan': return <Calendar className="w-4 h-4" />;
      case 'travel_claim': return <DollarSign className="w-4 h-4" />;
      case 'expense_report': return <FileText className="w-4 h-4" />;
      case 'target_revision': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ApprovalWorkflow['type']) => {
    switch (type) {
      case 'monthly_plan': return 'bg-blue-100 text-blue-800';
      case 'travel_claim': return 'bg-green-100 text-green-800';
      case 'expense_report': return 'bg-purple-100 text-purple-800';
      case 'target_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ApprovalWorkflow['status']) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'escalated': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.data.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.submittedByRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || workflow.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || workflow.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = workflows.filter(w => w.status === 'pending').length;
  const approvedCount = workflows.filter(w => w.status === 'approved').length;
  const rejectedCount = workflows.filter(w => w.status === 'rejected').length;

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
            <h1 className="text-2xl font-bold text-gray-900">Approval Workflows</h1>
            <p className="text-gray-600 mt-1">Manage approval requests and workflows</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{workflows.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
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
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Types</option>
            <option value="monthly_plan">Monthly Plans</option>
            <option value="travel_claim">Travel Claims</option>
            <option value="expense_report">Expense Reports</option>
            <option value="target_revision">Target Revisions</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => {
          const submitterRole = getRoleByCode(workflow.submittedByRole);
          const approverRole = getRoleByCode(workflow.currentApproverRole);
          
          return (
            <div key={workflow.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(workflow.type)}`}>
                    {getTypeIcon(workflow.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {workflow.data.title || `${workflow.type.replace('_', ' ')} Request`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      From: {submitterRole?.name} → To: {approverRole?.name}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Submitted: {new Date(workflow.submissionDate).toLocaleDateString()}
                </div>
                {workflow.approvalDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Processed: {new Date(workflow.approvalDate).toLocaleDateString()}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Current: {approverRole?.code}
                </div>
              </div>

              {/* Quick Data Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {workflow.type === 'monthly_plan' && (
                    <>
                      <div>
                        <span className="text-gray-600">Activities:</span>
                        <span className="font-medium ml-1">{workflow.data.activities}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Visit Target:</span>
                        <span className="font-medium ml-1">{workflow.data.targets?.visits}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sales Target:</span>
                        <span className="font-medium ml-1">₹{(workflow.data.targets?.sales / 100000).toFixed(1)}L</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Territory:</span>
                        <span className="font-medium ml-1">{workflow.data.territory}</span>
                      </div>
                    </>
                  )}
                  
                  {workflow.type === 'travel_claim' && (
                    <>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium ml-1">₹{workflow.data.amount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium ml-1">{workflow.data.distance} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mode:</span>
                        <span className="font-medium ml-1">{workflow.data.mode}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Purpose:</span>
                        <span className="font-medium ml-1">{workflow.data.purpose}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedWorkflow(selectedWorkflow === workflow.id ? null : workflow.id)}
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {selectedWorkflow === workflow.id ? 'Hide Details' : 'View Details'}
                </button>
                
                {workflow.status === 'pending' && (
                  <>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </>
                )}
              </div>

              {/* Expanded Details */}
              {selectedWorkflow === workflow.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <ApprovalWorkflowComponent
                    workflow={workflow}
                    canTakeAction={workflow.status === 'pending'}
                    onApprove={(comments) => {
                      console.log('Approved with comments:', comments);
                      // In real app, this would update the workflow
                    }}
                    onReject={(comments) => {
                      console.log('Rejected with comments:', comments);
                      // In real app, this would update the workflow
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No approval workflows found</p>
        </div>
      )}
    </div>
  );
};

export default Approvals;