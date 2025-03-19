const Italic = ({
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
      d="M7 2.5H10.1667M10.1667 2.5H13.3333M10.1667 2.5L6.83333 13.5M6.83333 13.5H3.66666M6.83333 13.5H10.0067"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Italic;
