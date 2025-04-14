import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[9999]">
      <div className="p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="flex flex-row gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-primary-500 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-primary-500 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-primary-500 animate-bounce [animation-delay:-.5s]"></div>
        </div>
        {/* <p className="text-white text-sm mt-2">Loading...</p> */}
      </div>
    </div>
  );
};

export default Loading;
