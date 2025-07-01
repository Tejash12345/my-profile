import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">Contact</h1>
        <div className="border-b-2 border-gray-700 mb-6 w-16 mx-auto" />
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            {/* Phone Icon */}
            <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.001 16.001 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z"></path></svg>
            <span className="text-lg font-medium text-white">+91 9110549651</span>
          </div>
          <div className="flex items-center justify-center">
            {/* Gmail Icon */}
            <svg className="w-6 h-6 text-red-400 mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 6V7.51L12 13.01L4 7.51V6H20ZM4 18V9.51L12 15.01L20 9.51V18H4Z" />
            </svg>
            <span className="text-lg font-medium text-white">tejraj0078@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 