const AutoFormat = ({
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
      d="M6 12.75V3H10.3M6 12.75H7.5M6 12.75H4.5M10.3 3V4.5M10.3 3H1.7V4.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 8H15.5"
      stroke="currentColor"
      strokeWidth="1.03448"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 10.5H14.5"
      stroke="currentColor"
      strokeWidth="1.03448"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 12.7H12.5"
      stroke="currentColor"
      strokeWidth="1.03448"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4154 3.9153C13.1424 4.18824 12.7946 4.37916 12.37 4.49977C12.7919 4.61952 13.1436 4.80983 13.4203 5.08153L13.4154 3.9153ZM13.4154 3.9153C13.6882 3.6424 13.8791 3.2946 13.9998 2.87004C14.1195 3.2919 14.3098 3.64364 14.5815 3.92034M13.4154 3.9153L14.5815 3.92035M14.5815 3.92035C14.8461 4.18975 15.1815 4.38161 15.5893 4.49978C15.1837 4.61721 14.8446 4.8084 14.5765 5.07651C14.3084 5.34463 14.1172 5.68372 13.9998 6.0893M14.5815 3.92035L13.9998 6.0893M13.9998 6.0893C13.8816 5.68148 13.6898 5.34609 13.4203 5.08154L13.9998 6.0893Z"
      stroke="currentColor"
      strokeWidth="0.666667"
    />
  </svg>
);

export default AutoFormat;
