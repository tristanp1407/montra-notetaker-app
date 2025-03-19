const BulletList = ({
  className = "w-4 h-4 text-gray-800",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 13 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.33333 8.16667H12M6.33333 1.83333H12M3.66667 1.83333C3.66667 2.56971 3.06971 3.16667 2.33333 3.16667C1.59695 3.16667 1 2.56971 1 1.83333C1 1.09695 1.59695 0.5 2.33333 0.5C3.06971 0.5 3.66667 1.09695 3.66667 1.83333ZM3.66667 8.16667C3.66667 8.90307 3.06971 9.5 2.33333 9.5C1.59695 9.5 1 8.90307 1 8.16667C1 7.43027 1.59695 6.83333 2.33333 6.83333C3.06971 6.83333 3.66667 7.43027 3.66667 8.16667Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BulletList;
