import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Target, Calendar, MapPin, AlertTriangle, TrendingUp, CheckCircle, Clock, Award, BarChart3, PieChart, ArrowUp, ArrowDown, Eye, Filter, Search, ChevronRight, User, Building, Activity, ArrowLeft, Camera, FileText, FileSignature as Signature, Phone, Home, Tractor, Sprout, ChevronDown, X } from 'lucide-react';

interface ActivityDetail {
  id: string;
  activityType: string;
  target: number;
  completed: number;
  pending: number;
  mdoBreakdown: MDOActivityBreakdown[];
}

interface MDOActivityBreakdown {
  mdoId: string;
  mdoName: string;
  target: number;
  completed: number;
  pending: number;
  farmerDetails?: FarmerVisitDetail[];
}

interface FarmerVisitDetail {
  id: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  visitDate: string;
  visitTime: string;
  duration: number;
  purpose: string;
  outcomes: string[];
  hasPhoto: boolean;
  hasSignature: boolean;
  hasNotes: boolean;
  notes?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  products: string[];
  orderValue: number;
  nextFollowUp?: string;
  satisfaction: number;
}

interface MDOStats {
  id: string;
  name: string;
  employeeCode: string;
  territory: string;
  ytdActivities: {
    planned: number;
    done: number;
    percentage: number;
  };
  monthlyActivities: {
    planned: number;
    done: number;
    pending: number;
    pendingPercentage: number;
    completedPercentage: number;
  };
  exceptions: Exception[];
  performance: {
    visitCompliance: number;
    targetAchievement: number;
    liquidationRate: number;
    customerSatisfaction: number;
  };
  regionEffort: {
    territory: string;
    activitiesCompleted: number;
    hoursSpent: number;
    visitCount: number;
  };
  activityDetails: ActivityDetail[];
}

interface Exception {
  id: string;
  type: 'route_deviation' | 'insufficient_hours' | 'missing_proof' | 'late_submission' | 'target_miss';
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  date: string;
  status: 'Open' | 'Resolved' | 'In Progress';
  mdoId: string;
  mdoName: string;
}

interface TSMPersonalStats {
  ytdActivities: {
    planned: number;
    done: number;
    percentage: number;
  };
  monthlyActivities: {
    planned: number;
    done: number;
    pending: number;
    pendingPercentage: number;
    completedPercentage: number;
  };
  teamManagement: {
    totalMDOs: number;
    activeMDOs: number;
    topPerformers: number;
    needsAttention: number;
  };
  approvals: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

const TSMDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'overview' | 'team' | 'personal' | 'exceptions' | 'activity-drill'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerritory, setFilterTerritory] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetail | null>(null);
  const [selectedMDO, setSelectedMDO] = useState<string | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerVisitDetail | null>(null);

  // Sample farmer visit details
  const sampleFarmerVisits: FarmerVisitDetail[] = [
    {
      id: 'FV001',
      farmerName: 'Ramesh Sharma',
      farmerPhone: '+91 98765 43210',
      village: 'Green Valley',
      visitDate: '2024-01-20',
      visitTime: '10:30 AM',
      duration: 45,
      purpose: 'Product demonstration and soil testing',
      outcomes: [
        'Demonstrated new fertilizer application',
        'Conducted soil pH test',
        'Provided crop advisory',
        'Collected feedback on previous products'
      ],
      hasPhoto: true,
      hasSignature: true,
      hasNotes: true,
      notes: 'Farmer showed interest in organic fertilizers. Soil test revealed low nitrogen content. Recommended NPK complex for next season.',
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Green Valley Farm, Sector 12, Delhi'
      },
      products: ['NPK Complex 25kg', 'Organic Fertilizer 10kg'],
      orderValue: 15000,
      nextFollowUp: '2024-01-27',
      satisfaction: 4
    },
    {
      id: 'FV002',
      farmerName: 'Suresh Kumar',
      farmerPhone: '+91 87654 32109',
      village: 'Sunrise Village',
      visitDate: '2024-01-20',
      visitTime: '2:15 PM',
      duration: 30,
      purpose: 'Follow-up visit and payment collection',
      outcomes: [
        'Collected outstanding payment',
        'Discussed new product requirements',
        'Scheduled next delivery'
      ],
      hasPhoto: false,
      hasSignature: true,
      hasNotes: true,
      notes: 'Payment collected successfully. Farmer requested bulk discount for next order.',
      location: {
        latitude: 28.5355,
        longitude: 77.3910,
        address: 'Sunrise Village, Near Highway, Delhi'
      },
      products: ['DAP 50kg'],
      orderValue: 8000,
      satisfaction: 5
    },
    {
      id: 'FV003',
      farmerName: 'Priya Devi',
      farmerPhone: '+91 76543 21098',
      village: 'Golden Fields',
      visitDate: '2024-01-19',
      visitTime: '11:00 AM',
      duration: 60,
      purpose: 'New customer onboarding and training',
      outcomes: [
        'Completed farmer registration',
        'Provided product training',
        'Demonstrated application techniques',
        'Set up payment terms'
      ],
      hasPhoto: true,
      hasSignature: true,
      hasNotes: true,
      notes: 'New farmer with 5 acres. Very enthusiastic about organic farming. Potential for long-term partnership.',
      location: {
        latitude: 28.4089,
        longitude: 77.3178,
        address: 'Golden Fields, Village Road, Delhi'
      },
      products: ['Organic Seeds 1kg', 'Bio Fertilizer 5kg'],
      orderValue: 12000,
      nextFollowUp: '2024-01-26',
      satisfaction: 5
    },
    {
      id: 'FV004',
      farmerName: 'Vikram Singh',
      farmerPhone: '+91 65432 10987',
      village: 'Green Valley',
      visitDate: '2024-01-21',
      visitTime: '9:00 AM',
      duration: 40,
      purpose: 'Crop advisory and pest control consultation',
      outcomes: [
        'Identified pest issues',
        'Recommended treatment plan',
        'Provided pesticide samples'
      ],
      hasPhoto: true,
      hasSignature: false,
      hasNotes: true,
      notes: 'Crop showing signs of aphid infestation. Recommended immediate treatment with provided pesticide.',
      location: {
        latitude: 28.6200,
        longitude: 77.2100,
        address: 'Green Valley Extension, Delhi'
      },
      products: ['Pesticide 500ml', 'Fungicide 1L'],
      orderValue: 3500,
      satisfaction: 4
    },
    {
      id: 'FV005',
      farmerName: 'Anita Kumari',
      farmerPhone: '+91 54321 09876',
      village: 'Sunrise Village',
      visitDate: '2024-01-21',
      visitTime: '3:30 PM',
      duration: 35,
      purpose: 'Product delivery and usage guidance',
      outcomes: [
        'Delivered ordered products',
        'Explained usage instructions',
        'Collected feedback on previous purchase'
      ],
      hasPhoto: true,
      hasSignature: true,
      hasNotes: false,
      location: {
        latitude: 28.5400,
        longitude: 77.3950,
        address: 'Sunrise Village, Main Road, Delhi'
      },
      products: ['Urea 25kg', 'DAP 25kg'],
      orderValue: 6500,
      satisfaction: 4
    }
  ];

  // Sample MDO data with detailed activity breakdown
  const mdoStats: MDOStats[] = [
    {
      id: 'MDO001',
      name: 'Rajesh Kumar',
      employeeCode: 'MDO001',
      territory: 'North Delhi',
      ytdActivities: {
        planned: 540,
        done: 456,
        percentage: 84
      },
      monthlyActivities: {
        planned: 45,
        done: 38,
        pending: 7,
        pendingPercentage: 16,
        completedPercentage: 84
      },
      exceptions: [
        {
          id: 'EX001',
          type: 'route_deviation',
          description: 'Deviated from planned route on Jan 18',
          severity: 'Medium',
          date: '2024-01-18',
          status: 'Open',
          mdoId: 'MDO001',
          mdoName: 'Rajesh Kumar'
        }
      ],
      performance: {
        visitCompliance: 85,
        targetAchievement: 88,
        liquidationRate: 72,
        customerSatisfaction: 4.2
      },
      regionEffort: {
        territory: 'North Delhi',
        activitiesCompleted: 38,
        hoursSpent: 342,
        visitCount: 28
      },
      activityDetails: [
        {
          id: 'ACT001',
          activityType: 'Farmer Visits',
          target: 20,
          completed: 17,
          pending: 3,
          mdoBreakdown: [
            {
              mdoId: 'MDO001',
              mdoName: 'Rajesh Kumar',
              target: 20,
              completed: 17,
              pending: 3,
              farmerDetails: sampleFarmerVisits.slice(0, 3)
            }
          ]
        },
        {
          id: 'ACT002',
          activityType: 'Product Demos',
          target: 15,
          completed: 12,
          pending: 3,
          mdoBreakdown: [
            {
              mdoId: 'MDO001',
              mdoName: 'Rajesh Kumar',
              target: 15,
              completed: 12,
              pending: 3
            }
          ]
        },
        {
          id: 'ACT003',
          activityType: 'Dealer Meetings',
          target: 10,
          completed: 9,
          pending: 1,
          mdoBreakdown: [
            {
              mdoId: 'MDO001',
              mdoName: 'Rajesh Kumar',
              target: 10,
              completed: 9,
              pending: 1
            }
          ]
        }
      ]
    },
    {
      id: 'MDO002',
      name: 'Amit Singh',
      employeeCode: 'MDO002',
      territory: 'South Delhi',
      ytdActivities: {
        planned: 540,
        done: 432,
        percentage: 80
      },
      monthlyActivities: {
        planned: 45,
        done: 36,
        pending: 9,
        pendingPercentage: 20,
        completedPercentage: 80
      },
      exceptions: [
        {
          id: 'EX003',
          type: 'insufficient_hours',
          description: 'Worked only 7.5 hours on Jan 17',
          severity: 'High',
          date: '2024-01-17',
          status: 'Open',
          mdoId: 'MDO002',
          mdoName: 'Amit Singh'
        }
      ],
      performance: {
        visitCompliance: 82,
        targetAchievement: 85,
        liquidationRate: 68,
        customerSatisfaction: 4.0
      },
      regionEffort: {
        territory: 'South Delhi',
        activitiesCompleted: 36,
        hoursSpent: 324,
        visitCount: 26
      },
      activityDetails: [
        {
          id: 'ACT004',
          activityType: 'Farmer Visits',
          target: 18,
          completed: 14,
          pending: 4,
          mdoBreakdown: [
            {
              mdoId: 'MDO002',
              mdoName: 'Amit Singh',
              target: 18,
              completed: 14,
              pending: 4,
              farmerDetails: sampleFarmerVisits.slice(1, 4)
            }
          ]
        },
        {
          id: 'ACT005',
          activityType: 'Product Demos',
          target: 12,
          completed: 10,
          pending: 2,
          mdoBreakdown: [
            {
              mdoId: 'MDO002',
              mdoName: 'Amit Singh',
              target: 12,
              completed: 10,
              pending: 2
            }
          ]
        }
      ]
    },
    {
      id: 'MDO003',
      name: 'Priya Verma',
      employeeCode: 'MDO003',
      territory: 'East Delhi',
      ytdActivities: {
        planned: 540,
        done: 486,
        percentage: 90
      },
      monthlyActivities: {
        planned: 45,
        done: 41,
        pending: 4,
        pendingPercentage: 9,
        completedPercentage: 91
      },
      exceptions: [],
      performance: {
        visitCompliance: 92,
        targetAchievement: 94,
        liquidationRate: 78,
        customerSatisfaction: 4.5
      },
      regionEffort: {
        territory: 'East Delhi',
        activitiesCompleted: 41,
        hoursSpent: 369,
        visitCount: 32
      },
      activityDetails: [
        {
          id: 'ACT006',
          activityType: 'Farmer Visits',
          target: 22,
          completed: 20,
          pending: 2,
          mdoBreakdown: [
            {
              mdoId: 'MDO003',
              mdoName: 'Priya Verma',
              target: 22,
              completed: 20,
              pending: 2,
              farmerDetails: sampleFarmerVisits.slice(0, 5)
            }
          ]
        }
      ]
    },
    {
      id: 'MDO004',
      name: 'Rohit Gupta',
      employeeCode: 'MDO004',
      territory: 'West Delhi',
      ytdActivities: {
        planned: 540,
        done: 475,
        percentage: 88
      },
      monthlyActivities: {
        planned: 45,
        done: 39,
        pending: 6,
        pendingPercentage: 13,
        completedPercentage: 87
      },
      exceptions: [],
      performance: {
        visitCompliance: 89,
        targetAchievement: 91,
        liquidationRate: 75,
        customerSatisfaction: 4.3
      },
      regionEffort: {
        territory: 'West Delhi',
        activitiesCompleted: 39,
        hoursSpent: 351,
        visitCount: 30
      },
      activityDetails: [
        {
          id: 'ACT007',
          activityType: 'Farmer Visits',
          target: 19,
          completed: 16,
          pending: 3,
          mdoBreakdown: [
            {
              mdoId: 'MDO004',
              mdoName: 'Rohit Gupta',
              target: 19,
              completed: 16,
              pending: 3,
              farmerDetails: sampleFarmerVisits.slice(2, 5)
            }
          ]
        }
      ]
    }
  ];

  // TSM's personal stats
  const tsmPersonalStats: TSMPersonalStats = {
    ytdActivities: {
      planned: 240,
      done: 216,
      percentage: 90
    },
    monthlyActivities: {
      planned: 20,
      done: 18,
      pending: 2,
      pendingPercentage: 10,
      completedPercentage: 90
    },
    teamManagement: {
      totalMDOs: mdoStats.length,
      activeMDOs: mdoStats.length,
      topPerformers: mdoStats.filter(m => m.performance.targetAchievement >= 90).length,
      needsAttention: mdoStats.filter(m => m.exceptions.length > 0).length
    },
    approvals: {
      pending: 5,
      approved: 23,
      rejected: 2
    }
  };

  // Aggregate team activities for drill-down
  const teamActivities: ActivityDetail[] = [
    {
      id: 'TEAM_ACT001',
      activityType: 'Farmer Visits',
      target: 79, // Sum of all MDO targets
      completed: 67, // Sum of all MDO completed
      pending: 12, // Sum of all MDO pending
      mdoBreakdown: [
        {
          mdoId: 'MDO001',
          mdoName: 'Rajesh Kumar',
          target: 20,
          completed: 17,
          pending: 3,
          farmerDetails: sampleFarmerVisits.slice(0, 3)
        },
        {
          mdoId: 'MDO002',
          mdoName: 'Amit Singh',
          target: 18,
          completed: 14,
          pending: 4,
          farmerDetails: sampleFarmerVisits.slice(1, 4)
        },
        {
          mdoId: 'MDO003',
          mdoName: 'Priya Verma',
          target: 22,
          completed: 20,
          pending: 2,
          farmerDetails: sampleFarmerVisits.slice(0, 5)
        },
        {
          mdoId: 'MDO004',
          mdoName: 'Rohit Gupta',
          target: 19,
          completed: 16,
          pending: 3,
          farmerDetails: sampleFarmerVisits.slice(2, 5)
        }
      ]
    },
    {
      id: 'TEAM_ACT002',
      activityType: 'Product Demos',
      target: 54,
      completed: 44,
      pending: 10,
      mdoBreakdown: [
        {
          mdoId: 'MDO001',
          mdoName: 'Rajesh Kumar',
          target: 15,
          completed: 12,
          pending: 3
        },
        {
          mdoId: 'MDO002',
          mdoName: 'Amit Singh',
          target: 12,
          completed: 10,
          pending: 2
        },
        {
          mdoId: 'MDO003',
          mdoName: 'Priya Verma',
          target: 14,
          completed: 12,
          pending: 2
        },
        {
          mdoId: 'MDO004',
          mdoName: 'Rohit Gupta',
          target: 13,
          completed: 10,
          pending: 3
        }
      ]
    },
    {
      id: 'TEAM_ACT003',
      activityType: 'Dealer Meetings',
      target: 42,
      completed: 36,
      pending: 6,
      mdoBreakdown: [
        {
          mdoId: 'MDO001',
          mdoName: 'Rajesh Kumar',
          target: 10,
          completed: 9,
          pending: 1
        },
        {
          mdoId: 'MDO002',
          mdoName: 'Amit Singh',
          target: 11,
          completed: 9,
          pending: 2
        },
        {
          mdoId: 'MDO003',
          mdoName: 'Priya Verma',
          target: 11,
          completed: 10,
          pending: 1
        },
        {
          mdoId: 'MDO004',
          mdoName: 'Rohit Gupta',
          target: 10,
          completed: 8,
          pending: 2
        }
      ]
    }
  ];

  // Aggregate team stats
  const teamAggregates = {
    ytdActivities: {
      planned: mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.planned, 0),
      done: mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.done, 0),
      percentage: Math.round((mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.done, 0) / mdoStats.reduce((sum, mdo) => sum + mdo.ytdActivities.planned, 0)) * 100)
    },
    monthlyActivities: {
      planned: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.planned, 0),
      done: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.done, 0),
      pending: mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.pending, 0),
      pendingPercentage: Math.round((mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.pending, 0) / mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.planned, 0)) * 100),
      completedPercentage: Math.round((mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.done, 0) / mdoStats.reduce((sum, mdo) => sum + mdo.monthlyActivities.planned, 0)) * 100)
    },
    totalExceptions: mdoStats.reduce((sum, mdo) => sum + mdo.exceptions.length, 0),
    averagePerformance: Math.round(mdoStats.reduce((sum, mdo) => sum + mdo.performance.targetAchievement, 0) / mdoStats.length)
  };

  const allExceptions = mdoStats.flatMap(mdo => mdo.exceptions);
  const filteredExceptions = allExceptions.filter(ex => ex.status === 'Open');

  const getExceptionColor = (type: Exception['type']) => {
    switch (type) {
      case 'route_deviation': return 'bg-yellow-100 text-yellow-800';
      case 'insufficient_hours': return 'bg-red-100 text-red-800';
      case 'missing_proof': return 'bg-orange-100 text-orange-800';
      case 'late_submission': return 'bg-purple-100 text-purple-800';
      case 'target_miss': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: Exception['severity']) => {
    switch (severity) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredMDOs = mdoStats.filter(mdo => {
    const matchesSearch = mdo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mdo.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTerritory = filterTerritory === 'All' || mdo.territory === filterTerritory;
    return matchesSearch && matchesTerritory;
  });

  const handleActivityDrillDown = (activity: ActivityDetail) => {
    setSelectedActivity(activity);
    setSelectedView('activity-drill');
  };

  const handleMDODrillDown = (mdoId: string) => {
    setSelectedMDO(mdoId);
  };

  const handleFarmerDrillDown = (farmer: FarmerVisitDetail) => {
    setSelectedFarmer(farmer);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Team vs Personal Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Aggregates */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{teamAggregates.ytdActivities.percentage}%</div>
              <div className="text-sm text-blue-600">YTD Achievement</div>
              <div className="text-xs text-gray-500 mt-1">{teamAggregates.ytdActivities.done}/{teamAggregates.ytdActivities.planned}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{teamAggregates.monthlyActivities.completedPercentage}%</div>
              <div className="text-sm text-green-600">Monthly Progress</div>
              <div className="text-xs text-gray-500 mt-1">{teamAggregates.monthlyActivities.done}/{teamAggregates.monthlyActivities.planned}</div>
            </div>
          </div>
        </div>

        {/* TSM Personal Stats */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Performance</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">{tsmPersonalStats.ytdActivities.percentage}%</div>
              <div className="text-sm text-purple-600">YTD Achievement</div>
              <div className="text-xs text-gray-500 mt-1">{tsmPersonalStats.ytdActivities.done}/{tsmPersonalStats.ytdActivities.planned}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-800">{tsmPersonalStats.monthlyActivities.completedPercentage}%</div>
              <div className="text-sm text-orange-600">Monthly Progress</div>
              <div className="text-xs text-gray-500 mt-1">{tsmPersonalStats.monthlyActivities.done}/{tsmPersonalStats.monthlyActivities.planned}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity Breakdown */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Activity Breakdown</h3>
        <div className="space-y-4">
          {teamActivities.map((activity) => (
            <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {activity.activityType === 'Farmer Visits' && <Tractor className="w-5 h-5 text-blue-600" />}
                    {activity.activityType === 'Product Demos' && <Sprout className="w-5 h-5 text-blue-600" />}
                    {activity.activityType === 'Dealer Meetings' && <Building className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{activity.activityType}</h4>
                    <p className="text-sm text-gray-600">Target: {activity.target}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleActivityDrillDown(activity)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Drill Down
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-800">{activity.completed}</div>
                  <div className="text-xs text-green-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-800">{activity.pending}</div>
                  <div className="text-xs text-orange-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-800">{Math.round((activity.completed / activity.target) * 100)}%</div>
                  <div className="text-xs text-blue-600">Achievement</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(activity.completed / activity.target) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{tsmPersonalStats.teamManagement.totalMDOs}</div>
          <div className="text-sm text-gray-600">Total MDOs</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-green-600">{tsmPersonalStats.teamManagement.topPerformers}</div>
          <div className="text-sm text-gray-600">Top Performers</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-red-600">{tsmPersonalStats.teamManagement.needsAttention}</div>
          <div className="text-sm text-gray-600">Need Attention</div>
        </div>
        <div className="bg-white rounded-xl p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{teamAggregates.averagePerformance}%</div>
          <div className="text-sm text-gray-600">Avg Performance</div>
        </div>
      </div>

      {/* Exceptions Alert */}
      {filteredExceptions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Active Exceptions ({filteredExceptions.length})</h3>
            </div>
            <button 
              onClick={() => setSelectedView('exceptions')}
              className="text-red-600 text-sm hover:text-red-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {filteredExceptions.slice(0, 3).map((exception) => (
              <div key={exception.id} className="bg-white rounded-lg p-3 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{exception.description}</p>
                    <p className="text-xs text-gray-600">{exception.mdoName} • {new Date(exception.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium ${getSeverityColor(exception.severity)}`}>
                    {exception.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTeamView = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search MDOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterTerritory}
            onChange={(e) => setFilterTerritory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Territories</option>
            <option value="North Delhi">North Delhi</option>
            <option value="South Delhi">South Delhi</option>
            <option value="East Delhi">East Delhi</option>
            <option value="West Delhi">West Delhi</option>
          </select>
        </div>
      </div>

      {/* MDO Performance Cards */}
      <div className="space-y-4">
        {filteredMDOs.map((mdo) => (
          <div key={mdo.id} className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mdo.name}</h3>
                  <p className="text-gray-600">{mdo.employeeCode} • {mdo.territory}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {mdo.exceptions.length > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {mdo.exceptions.length} Exception{mdo.exceptions.length !== 1 ? 's' : ''}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mdo.performance.targetAchievement >= 90 ? 'bg-green-100 text-green-800' :
                  mdo.performance.targetAchievement >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {mdo.performance.targetAchievement}% Target
                </span>
              </div>
            </div>

            {/* Activity Breakdown for this MDO */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Activity Breakdown</h4>
              <div className="space-y-2">
                {mdo.activityDetails.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        {activity.activityType === 'Farmer Visits' && <Tractor className="w-4 h-4 text-purple-600" />}
                        {activity.activityType === 'Product Demos' && <Sprout className="w-4 h-4 text-purple-600" />}
                        {activity.activityType === 'Dealer Meetings' && <Building className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{activity.activityType}</p>
                        <p className="text-xs text-gray-600">Target: {activity.target}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">{activity.completed}</p>
                        <p className="text-xs text-gray-500">Done</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-orange-600">{activity.pending}</p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                      <button
                        onClick={() => handleActivityDrillDown(activity)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* YTD vs Monthly Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">YTD Activities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-900">{mdo.ytdActivities.planned}</div>
                    <div className="text-xs text-blue-600">Planned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-900">{mdo.ytdActivities.done}</div>
                    <div className="text-xs text-blue-600">Done</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-blue-600 mb-1">
                    <span>Progress</span>
                    <span>{mdo.ytdActivities.percentage}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${mdo.ytdActivities.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Monthly Activities</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-900">{mdo.monthlyActivities.planned}</div>
                    <div className="text-xs text-green-600">Planned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-900">{mdo.monthlyActivities.done}</div>
                    <div className="text-xs text-green-600">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-800">{mdo.monthlyActivities.pending}</div>
                    <div className="text-xs text-orange-600">Pending</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <span className="text-green-600 font-semibold">{mdo.monthlyActivities.completedPercentage}% Done</span>
                  </div>
                  <div className="text-center">
                    <span className="text-orange-600 font-semibold">{mdo.monthlyActivities.pendingPercentage}% Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Region-wise Effort */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">Region-wise Effort - {mdo.regionEffort.territory}</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{mdo.regionEffort.activitiesCompleted}</div>
                  <div className="text-xs text-gray-600">Activities</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{mdo.regionEffort.hoursSpent}</div>
                  <div className="text-xs text-gray-600">Hours</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{mdo.regionEffort.visitCount}</div>
                  <div className="text-xs text-gray-600">Visits</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-sm font-bold text-purple-800">{mdo.performance.visitCompliance}%</div>
                <div className="text-xs text-purple-600">Visit Compliance</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-sm font-bold text-blue-800">{mdo.performance.targetAchievement}%</div>
                <div className="text-xs text-blue-600">Target Achievement</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-sm font-bold text-green-800">{mdo.performance.liquidationRate}%</div>
                <div className="text-xs text-green-600">Liquidation Rate</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="text-sm font-bold text-yellow-800">{mdo.performance.customerSatisfaction}</div>
                <div className="text-xs text-yellow-600">Satisfaction</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivityDrillDown = () => {
    if (!selectedActivity) return null;

    return (
      <div className="space-y-6">
        {/* Activity Header */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedView('overview')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {selectedActivity.activityType === 'Farmer Visits' && <Tractor className="w-6 h-6 text-blue-600" />}
                {selectedActivity.activityType === 'Product Demos' && <Sprout className="w-6 h-6 text-blue-600" />}
                {selectedActivity.activityType === 'Dealer Meetings' && <Building className="w-6 h-6 text-blue-600" />}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedActivity.activityType}</h2>
                <p className="text-gray-600">MDO-wise breakdown and farmer details</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{selectedActivity.completed}/{selectedActivity.target}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* MDO Breakdown */}
        <div className="space-y-4">
          {selectedActivity.mdoBreakdown.map((mdoBreakdown) => (
            <div key={mdoBreakdown.mdoId} className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mdoBreakdown.mdoName}</h3>
                    <p className="text-gray-600">Target: {mdoBreakdown.target} | Completed: {mdoBreakdown.completed} | Pending: {mdoBreakdown.pending}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-blue-600">
                    {Math.round((mdoBreakdown.completed / mdoBreakdown.target) * 100)}%
                  </span>
                  {mdoBreakdown.farmerDetails && (
                    <button
                      onClick={() => handleMDODrillDown(mdoBreakdown.mdoId)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Farmers
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-800">{mdoBreakdown.completed}</div>
                  <div className="text-xs text-green-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-800">{mdoBreakdown.pending}</div>
                  <div className="text-xs text-orange-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-800">{mdoBreakdown.target}</div>
                  <div className="text-xs text-blue-600">Target</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(mdoBreakdown.completed / mdoBreakdown.target) * 100}%` }}
                ></div>
              </div>

              {/* Farmer Details for this MDO */}
              {selectedMDO === mdoBreakdown.mdoId && mdoBreakdown.farmerDetails && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Farmer-wise Details</h4>
                  <div className="space-y-3">
                    {mdoBreakdown.farmerDetails.map((farmer) => (
                      <div key={farmer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Tractor className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{farmer.farmerName}</h5>
                              <p className="text-sm text-gray-600">{farmer.village} • {farmer.farmerPhone}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleFarmerDrillDown(farmer)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(farmer.visitDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {farmer.duration} min
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Target className="w-3 h-3 mr-1" />
                            ₹{farmer.orderValue.toLocaleString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Award className="w-3 h-3 mr-1" />
                            {farmer.satisfaction}/5
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs">
                          <div className={`flex items-center ${farmer.hasPhoto ? 'text-green-600' : 'text-red-600'}`}>
                            <Camera className="w-3 h-3 mr-1" />
                            Photo: {farmer.hasPhoto ? 'Yes' : 'No'}
                          </div>
                          <div className={`flex items-center ${farmer.hasSignature ? 'text-green-600' : 'text-red-600'}`}>
                            <FileText className="w-3 h-3 mr-1" />
                            Signature: {farmer.hasSignature ? 'Yes' : 'No'}
                          </div>
                          <div className={`flex items-center ${farmer.hasNotes ? 'text-green-600' : 'text-red-600'}`}>
                            <FileText className="w-3 h-3 mr-1" />
                            Notes: {farmer.hasNotes ? 'Yes' : 'No'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExceptions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exception Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-800">{allExceptions.filter(e => e.type === 'route_deviation').length}</div>
            <div className="text-xs text-red-600">Route Deviations</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-800">{allExceptions.filter(e => e.type === 'insufficient_hours').length}</div>
            <div className="text-xs text-orange-600">Hour Violations</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-800">{allExceptions.filter(e => e.type === 'missing_proof').length}</div>
            <div className="text-xs text-yellow-600">Missing Proofs</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-800">{allExceptions.filter(e => e.type === 'late_submission').length}</div>
            <div className="text-xs text-purple-600">Late Submissions</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{allExceptions.filter(e => e.type === 'target_miss').length}</div>
            <div className="text-xs text-gray-600">Target Misses</div>
          </div>
        </div>

        <div className="space-y-3">
          {allExceptions.map((exception) => (
            <div key={exception.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 ${getSeverityColor(exception.severity)}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{exception.description}</h4>
                    <p className="text-sm text-gray-600">{exception.mdoName} • {new Date(exception.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExceptionColor(exception.type)}`}>
                    {exception.type.replace('_', ' ')}
                  </span>
                  <span className={`text-xs font-medium ${getSeverityColor(exception.severity)}`}>
                    {exception.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-bg rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">TSM Dashboard - {user?.name}</h1>
            <p className="text-white/90">Territory Sales Manager</p>
            <p className="text-white/80 text-sm mt-1">{user?.territory || 'Delhi Territory'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{teamAggregates.monthlyActivities.done}</div>
            <div className="text-white/90 text-sm">Team Activities Done</div>
            <div className="text-white/80 text-xs mt-1">
              {teamAggregates.monthlyActivities.pending} Pending
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl p-2 card-shadow">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              selectedView === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('team')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              selectedView === 'team'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Team Details
          </button>
          <button
            onClick={() => setSelectedView('exceptions')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors relative ${
              selectedView === 'exceptions'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Exceptions
            {filteredExceptions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {filteredExceptions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'team' && renderTeamView()}
      {selectedView === 'exceptions' && renderExceptions()}
      {selectedView === 'activity-drill' && renderActivityDrillDown()}

      {/* Farmer Detail Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-green-100 p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Tractor className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedFarmer.farmerName}</h3>
                    <p className="text-gray-600">{selectedFarmer.village} • {selectedFarmer.farmerPhone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFarmer(null)}
                  className="p-2 hover:bg-green-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Visit Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Visit Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Date:</span>
                        <span className="font-medium">{new Date(selectedFarmer.visitDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Time:</span>
                        <span className="font-medium">{selectedFarmer.visitTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Duration:</span>
                        <span className="font-medium">{selectedFarmer.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Purpose:</span>
                        <span className="font-medium">{selectedFarmer.purpose}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-3">Business Impact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Order Value:</span>
                        <span className="font-medium">₹{selectedFarmer.orderValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Satisfaction:</span>
                        <span className="font-medium">{selectedFarmer.satisfaction}/5 ⭐</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Products:</span>
                        <span className="font-medium">{selectedFarmer.products.length} items</span>
                      </div>
                      {selectedFarmer.nextFollowUp && (
                        <div className="flex justify-between">
                          <span className="text-green-700">Next Follow-up:</span>
                          <span className="font-medium">{new Date(selectedFarmer.nextFollowUp).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documentation Status */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Documentation Status</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`text-center p-3 rounded-lg ${
                      selectedFarmer.hasPhoto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <Camera className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Photos</div>
                      <div className="text-xs">{selectedFarmer.hasPhoto ? 'Captured' : 'Missing'}</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${
                      selectedFarmer.hasSignature ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <FileText className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Signature</div>
                      <div className="text-xs">{selectedFarmer.hasSignature ? 'Captured' : 'Missing'}</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${
                      selectedFarmer.hasNotes ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <FileText className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Notes</div>
                      <div className="text-xs">{selectedFarmer.hasNotes ? 'Available' : 'Missing'}</div>
                    </div>
                  </div>
                </div>

                {/* Outcomes */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-800 mb-3">Visit Outcomes</h4>
                  <ul className="space-y-2">
                    {selectedFarmer.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start text-sm text-purple-700">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-purple-600" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Products */}
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-semibold text-orange-800 mb-3">Products Discussed</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFarmer.products.map((product, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedFarmer.notes && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Visit Notes</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedFarmer.notes}</p>
                  </div>
                )}

                {/* Location */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Location Details</h4>
                  <div className="flex items-center text-sm text-blue-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedFarmer.location.address}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Coordinates: {selectedFarmer.location.latitude}, {selectedFarmer.location.longitude}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TSMDashboard;