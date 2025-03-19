const Pause = ({
  className = "w-3 h-3 text-gray-700",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1.41667C3.4687 1.41667 1.41667 3.4687 1.41667 6C1.41667 8.53129 3.46869 10.5833 6 10.5833C8.53129 10.5833 10.5833 8.53129 10.5833 6C10.5833 3.46869 8.53129 1.41667 6 1.41667ZM1.33333 6C1.33333 3.42267 3.42267 1.33333 6 1.33333C8.57731 1.33333 10.6667 3.42267 10.6667 6C10.6667 8.57731 8.57731 10.6667 6 10.6667C3.42267 10.6667 1.33333 8.57731 1.33333 6Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.666667"
    />
    <path
      d="M4.875 4.5V7.5M7.125 4.5V7.5"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

export default Pause;
