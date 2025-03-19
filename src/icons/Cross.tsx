const DotGrid = ({
  className = "w-4 h-4 text-gray-500",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.33331 8.00004C8.33331 8.18415 8.18408 8.33337 7.99998 8.33337C7.81587 8.33337 7.66665 8.18415 7.66665 8.00004C7.66665 7.81594 7.81587 7.66671 7.99998 7.66671C8.18408 7.66671 8.33331 7.81594 8.33331 8.00004Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.666667"
    />
    <path
      d="M13.5 8.66671C13.8682 8.66671 14.1666 8.36824 14.1666 8.00004C14.1666 7.63184 13.8682 7.33337 13.5 7.33337C13.1318 7.33337 12.8333 7.63184 12.8333 8.00004C12.8333 8.36824 13.1318 8.66671 13.5 8.66671Z"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.49998 8.66671C2.86817 8.66671 3.16665 8.36824 3.16665 8.00004C3.16665 7.63184 2.86817 7.33337 2.49998 7.33337C2.13179 7.33337 1.83331 7.63184 1.83331 8.00004C1.83331 8.36824 2.13179 8.66671 2.49998 8.66671Z"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99998 8.66671C8.36818 8.66671 8.66665 8.36824 8.66665 8.00004C8.66665 7.63184 8.36818 7.33337 7.99998 7.33337C7.63178 7.33337 7.33331 7.63184 7.33331 8.00004C7.33331 8.36824 7.63178 8.66671 7.99998 8.66671Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      s
    />
  </svg>
);

export default DotGrid;
