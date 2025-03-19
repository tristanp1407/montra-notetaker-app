const H2 = ({
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
      d="M9.33334 3.16663V7.99996M9.33334 7.99996V12.8333M9.33334 7.99996H2.33334M2.33334 7.99996V3.16663M2.33334 7.99996V12.8333M15.3333 12.8333H12.3333L14.9545 9.69416C15.1985 9.43489 15.3333 9.01356 15.3333 8.66663C15.3333 7.88423 14.7402 7.16663 13.8333 7.16663C13.2781 7.16663 12.7933 7.45149 12.534 7.87496C12.4735 7.98163 12.4313 8.10369 12.4018 8.22223"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default H2;
