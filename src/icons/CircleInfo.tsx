const CircleInfo = ({
  className = "w-5 h-5 text-gray-500",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.95834 9.16663H10V13.5416M17.7083 9.99996C17.7083 14.2571 14.2572 17.7083 10 17.7083C5.74281 17.7083 2.29167 14.2571 2.29167 9.99996C2.29167 5.74277 5.74281 2.29163 10 2.29163C14.2572 2.29163 17.7083 5.74277 17.7083 9.99996Z"
      stroke="#505050"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6.14587C9.71234 6.14587 9.47917 6.37906 9.47917 6.66671C9.47917 6.95436 9.71234 7.18754 10 7.18754C10.2877 7.18754 10.5208 6.95436 10.5208 6.66671C10.5208 6.37906 10.2877 6.14587 10 6.14587Z"
      fill="#505050"
      stroke="#505050"
      strokeWidth="0.166667"
    />
  </svg>
);

export default CircleInfo;
