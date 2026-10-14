import React from 'react';

const PageTitle = ({ children }) => {
  return (
    <h1 className="my-6 text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
      {children}
    </h1>
  );
};

export default PageTitle;
