import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, ArrowRight, User, Calendar, MessageSquare } from 'lucide-react';
import { ApprovalWorkflow, ApprovalStep, ROLE_HIERARCHY, getRoleByCode } from '../types/hierarchy';

interface ApprovalWorkflowProps {
  workflow: ApprovalWorkflow;
  onApprove?: (comments?: string) => void;
  onReject?: (comments: string) => void;
  canTakeAction?: boolean;
}

export const ApprovalWorkflowComponent: React.FC<ApprovalWorkflowProps> = ({
  workflow,
  onApprove,
  onReject,
  canTakeAction = false
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState('');

  const getStatusColor = (status: ApprovalStep['status']) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'skipped': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: ApprovalStep['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getWorkflowTypeLabel = (type: ApprovalWorkflow['type']) => {
    switch (type) {
      case 'monthly_plan': return 'Monthly Plan';
      case 'travel_claim': return 'Travel Claim';
      case 'expense_report': return 'Expense Report';
      case 'target_revision': return 'Target Revision';
      default: return 'Approval Request';
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(comments || undefined);
      setComments('');
      setShowComments(false);
    }
  };

  const handleReject = () => {
    if (onReject && comments.trim()) {
      onReject(comments);
      setComments('');
      setShowComments(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {getWorkflowTypeLabel(workflow.type)} Approval
          </h3>
          <p className="text-sm text-gray-600">
            Submitted by {workflow.submittedByRole} on {new Date(workflow.submissionDate).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
        </span>
      </div>

      {/* Approval Chain */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Approval Chain</h4>
        <div className="space-y-3">
          {workflow.approvalChain.map((step, index) => {
            const role = getRoleByCode(step.approverRole);
            const isCurrentStep = step.status === 'pending' && 
                                 workflow.currentApproverRole === step.approverRole;
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{role?.name}</span>
                    {isCurrentStep && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  
                  {step.date && (
                    <p className="text-xs text-gray-500">
                      {step.status === 'approved' ? 'Approved' : 'Rejected'} on {new Date(step.date).toLocaleDateString()}
                    </p>
                  )}
                  
                  {step.comments && (
                    <p className="text-sm text-gray-600 mt-1 italic">"{step.comments}"</p>
                  )}
                </div>
                
                {index < workflow.approvalChain.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      {canTakeAction && workflow.status === 'pending' && (
        <div className="space-y-4">
          {!showComments ? (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowComments(true)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </button>
              <button
                onClick={() => setShowComments(true)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (optional for approval, required for rejection):
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add your comments..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={!comments.trim()}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowComments(false);
                    setComments('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workflow Details */}
      {showFullDetails && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Request Details</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(workflow.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};