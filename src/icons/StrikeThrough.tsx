const StrikeThrough = ({
  className = "w-4 h-4 text-gray-800",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.2185 4.57411C12.0514 3.77082 11.3526 1.83337 8.50113 1.83337C5.76039 1.83337 4.73261 3.61565 4.73261 4.91671C4.73261 6.94184 6.60302 7.47057 8.50113 7.97717M4.47917 11.426C4.7356 12.2292 5.64964 14.1667 8.50113 14.1667C11.2419 14.1667 12.4409 12.3844 12.4409 11.0834C12.4409 10.5822 12.3264 10.1727 12.1252 9.83244"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path d="M2.33333 8H14.6667" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

export default StrikeThrough;
