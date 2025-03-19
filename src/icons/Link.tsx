const Link = ({
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
      d="M7.00018 3.68252L7.64453 3.03819C9.25093 1.43177 11.8555 1.43177 13.4619 3.03819C15.0683 4.6446 15.0683 7.24911 13.4619 8.85551L12.8161 9.50131M4.18591 6.4968L3.53815 7.14458C1.93173 8.75098 1.93173 11.3555 3.53815 12.9619C5.14456 14.5683 7.74907 14.5683 9.35547 12.9619L9.99853 12.3188M6.83333 9.66671L10.1667 6.33338"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export default Link;
