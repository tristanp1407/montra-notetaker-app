const Play = ({
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
      d="M10.0775 5.16038L4.41825 1.4985C3.75289 1.06797 2.875 1.54557 2.875 2.33807V9.66178C2.875 10.4543 3.75289 10.9319 4.41825 10.5014L10.0775 6.83948C10.6865 6.44543 10.6865 5.55443 10.0775 5.16038Z"
      stroke="currentColor"
      strokeLinejoin="round"
    />
  </svg>
);

export default Play;
