const Cross = ({
  className = "w-4 h-4 text-gray-500",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.16663 3.16663L12.8333 12.8333M12.8333 3.16663L3.16663 12.8333"
      stroke="#707070"
      strokeLinecap="round"
    />
  </svg>
);

export default Cross;
