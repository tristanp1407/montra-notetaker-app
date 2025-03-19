const Underline = ({
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
      d="M4.33334 13.8333H12.6667M4.33334 2.5V8C4.33334 10.3012 6.19882 12.1667 8.5 12.1667C10.8012 12.1667 12.6667 10.3012 12.6667 8V2.5"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

export default Underline;
