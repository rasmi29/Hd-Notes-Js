import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left side - Form content */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
        
        {/* Right side - Background image (hidden on mobile) */}
        <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 transform rotate-12 scale-150 rounded-full blur-3xl"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-96 h-96 opacity-40">
              <div className="w-full h-full bg-gradient-to-tl from-purple-400 via-blue-400 to-cyan-400 rounded-full blur-2xl transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;