import React from "react";

const ChevronsUpDown = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.3335 6.00002L7.52876 3.80476C7.7891 3.54441 8.21123 3.54441 8.47156 3.80476L10.6668 6.00002M10.6668 10L8.47156 12.1953C8.21123 12.4556 7.7891 12.4556 7.52876 12.1953L5.3335 10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronsUpDown;
