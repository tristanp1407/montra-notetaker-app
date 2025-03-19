const Copy = ({
  className = "w-4 h-4 text-gray-700",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.16667 5.16667V3.83333C5.16667 3.09695 5.76362 2.5 6.5 2.5H12.1667C12.9031 2.5 13.5 3.09695 13.5 3.83333V9.50667C13.5 10.2431 12.9031 10.84 12.1667 10.84H10.8333M2.5 6.5V12.1667C2.5 12.9031 3.09695 13.5 3.83333 13.5H9.5C10.2364 13.5 10.8333 12.9031 10.8333 12.1667V6.5C10.8333 5.76362 10.2364 5.16667 9.5 5.16667H3.83333C3.09695 5.16667 2.5 5.76362 2.5 6.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Copy;
