const Bold = ({
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
      d="M4.32812 8H9.33467C10.8074 8 12.0013 6.80607 12.0013 5.33333V5.16667C12.0013 3.69391 10.8074 2.5 9.33467 2.5H5.66146C4.92508 2.5 4.32812 3.09695 4.32812 3.83333V8ZM4.32812 8V12.1667C4.32812 12.9031 4.92508 13.5 5.66146 13.5H8.83467M9.16813 13.5H10.0015C11.4742 13.5 12.6681 12.3061 12.6681 10.8333V10.6667C12.6681 9.19393 11.4742 8 10.0015 8H9.16813"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

export default Bold;
