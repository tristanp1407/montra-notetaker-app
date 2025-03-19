const ChevronLeft = ({
  className = "w-3 h-5 text-gray-700",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.65483 9L1.36193 5.7071C0.971398 5.3166 0.971398 4.6834 1.36193 4.2929L4.65483 1"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronLeft;
