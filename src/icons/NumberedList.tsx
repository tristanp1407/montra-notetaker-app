const NumberedList = ({
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
      d="M8.33333 11.1666H14M8.33333 4.83329H14M4.66667 6.49996V3.16663L3 4.33329M3.16667 9.95449C3.16667 9.95449 3.64915 9.49996 4.23924 9.49996C4.82933 9.49996 5.30769 9.91456 5.30769 10.426C5.30769 11.6256 3 11.8333 3 12.8333H5.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default NumberedList;
