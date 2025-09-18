import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Tablet, Monitor, Eye, Code, Download } from 'lucide-react';

const MobileAppDesign: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [selectedView, setSelectedView] = useState<'preview' | 'code'>('preview');

  const deviceSizes = {
    mobile: { width: '375px', height: '667px' },
    tablet: { width: '768px', height: '1024px' },
    desktop: { width: '1200px', height: '800px' }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Mobile App Design</h1>
            <p className="text-gray-600 mt-1">Design and preview mobile application interface</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/mobile')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Full App
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Device Selection */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Device Preview</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedDevice('mobile')}
              className={`p-2 rounded-lg transition-colors ${
                selectedDevice === 'mobile' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedDevice('tablet')}
              className={`p-2 rounded-lg transition-colors ${
                selectedDevice === 'tablet' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Tablet className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedDevice('desktop')}
              className={`p-2 rounded-lg transition-colors ${
                selectedDevice === 'desktop' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setSelectedView('preview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'preview' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eye className="w-4 h-4 mr-2 inline" />
            Preview
          </button>
          <button
            onClick={() => setSelectedView('code')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'code' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Code className="w-4 h-4 mr-2 inline" />
            Code View
          </button>
        </div>

        {/* Device Frame */}
        <div className="flex justify-center">
          <div 
            className="bg-gray-900 rounded-3xl p-4 shadow-2xl"
            style={{
              width: selectedDevice === 'mobile' ? '395px' : selectedDevice === 'tablet' ? '788px' : '1220px',
              height: selectedDevice === 'mobile' ? '687px' : selectedDevice === 'tablet' ? '1044px' : '820px'
            }}
          >
            <div 
              className="bg-white rounded-2xl overflow-hidden h-full"
              style={{
                width: deviceSizes[selectedDevice].width,
                height: deviceSizes[selectedDevice].height
              }}
            >
              {selectedView === 'preview' ? (
                <iframe
                  src="/mobile"
                  className="w-full h-full border-0"
                  title="Mobile App Preview"
                />
              ) : (
                <div className="p-4 h-full overflow-auto bg-gray-900 text-green-400 font-mono text-sm">
                  <div className="space-y-2">
                    <div>{'<div className="mobile-app">'}</div>
                    <div className="ml-4">{'<header className="app-header">'}</div>
                    <div className="ml-8">{'<h1>Gencrest Mobile App</h1>'}</div>
                    <div className="ml-4">{'</header>'}</div>
                    <div className="ml-4">{'<main className="app-content">'}</div>
                    <div className="ml-8">{'<nav className="bottom-nav">'}</div>
                    <div className="ml-12">{'<button>Dashboard</button>'}</div>
                    <div className="ml-12">{'<button>Tracker</button>'}</div>
                    <div className="ml-12">{'<button>Tasks</button>'}</div>
                    <div className="ml-12">{'<button>Liquidation</button>'}</div>
                    <div className="ml-12">{'<button>Reports</button>'}</div>
                    <div className="ml-8">{'</nav>'}</div>
                    <div className="ml-4">{'</main>'}</div>
                    <div>{'</div>'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Design Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsive Design</h3>
          <p className="text-gray-600 mb-4">Optimized for all device sizes with adaptive layouts and touch-friendly interfaces.</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Mobile-first approach</li>
            <li>• Touch-optimized controls</li>
            <li>• Adaptive typography</li>
            <li>• Flexible grid system</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modern UI/UX</h3>
          <p className="text-gray-600 mb-4">Clean, intuitive interface following modern design principles and accessibility standards.</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Material Design principles</li>
            <li>• Consistent color scheme</li>
            <li>• Smooth animations</li>
            <li>• Accessibility compliant</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
          <p className="text-gray-600 mb-4">Optimized for fast loading and smooth interactions across all devices and network conditions.</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Lazy loading</li>
            <li>• Optimized images</li>
            <li>• Minimal bundle size</li>
            <li>• Offline capabilities</li>
          </ul>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Frontend Technologies</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• React 18 with TypeScript</li>
              <li>• Tailwind CSS for styling</li>
              <li>• Lucide React for icons</li>
              <li>• React Router for navigation</li>
              <li>• Responsive design patterns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Dashboard with real-time data</li>
              <li>• Activity tracking system</li>
              <li>• Task management</li>
              <li>• Stock liquidation tracking</li>
              <li>• Report generation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDesign;