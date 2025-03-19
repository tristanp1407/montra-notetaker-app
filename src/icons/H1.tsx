const H1 = ({
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
      d="M2.33334 3.16663V7.99996M2.33334 7.99996V12.8333M2.33334 7.99996H9.33334M9.33334 3.16663V7.99996M9.33334 7.99996V12.8333M12.5 8.99996L14.6667 7.16663V12.8333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default H1;
