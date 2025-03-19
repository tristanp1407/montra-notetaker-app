const Albums = ({
  className = "w-4 h-4 text-gray-700",
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
      d="M2.5 3.83336V12.1667M5.16667 3.16669V12.8334M13.5 4.58165V11.4184C13.5 12.0346 13.0779 12.5704 12.4788 12.7147L9.4788 13.4371C8.64013 13.6391 7.83333 13.0035 7.83333 12.1408V3.85922C7.83333 2.99655 8.64013 2.36098 9.4788 2.56294L12.4788 3.28537C13.0779 3.42961 13.5 3.96551 13.5 4.58165Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Albums;
