import React from "react";

const BlankPage = ({
  className = "w-5 h-5 text-gray-600",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0417 12.9977V3.95841C16.0417 3.03794 15.2955 2.29175 14.375 2.29175H5.625C4.70453 2.29175 3.95834 3.03794 3.95834 3.95841V16.0417C3.95834 16.9622 4.70453 17.7084 5.625 17.7084H5.83334M16.0417 12.9977V13.3037C16.0417 13.939 15.8349 14.5572 15.4524 15.0656C14.2004 16.7292 12.2355 17.7084 10.1488 17.7084H5.83334M16.0417 12.9977C16.0417 15.139 13.0338 15.139 11.7448 14.2825L10.8243 15.1998C9.21267 16.8061 8.11254 17.7084 5.83334 17.7084M7.29172 5.62508H12.7084M7.29172 9.0001H12.7084M7.29172 12.3751H9.375"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BlankPage;
