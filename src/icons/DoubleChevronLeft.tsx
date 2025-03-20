const DoubleChevronLeft = ({
  className = "w-4 h-4 text-gray-800",
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
      d="M6.66653 10.6667L4.47127 8.47144C4.21091 8.21111 4.21091 7.78897 4.47127 7.52864L6.66653 5.33337M11.3332 10.6667L9.13796 8.47144C8.87756 8.21111 8.87756 7.78897 9.13796 7.52864L11.3332 5.33337"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DoubleChevronLeft;
