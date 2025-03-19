const Microphone = ({
  className = "w-5 h-5 text-gray-700",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.0007 15.8333C12.5636 15.8333 14.7662 14.2907 15.7307 12.0833M10.0007 15.8333C7.43786 15.8333 5.23525 14.2907 4.27081 12.0833M10.0007 15.8333V17.7083M10.0007 13.125C8.04475 13.125 6.45909 11.5393 6.45909 9.58329V5.83329C6.45909 3.87728 8.04475 2.29163 10.0007 2.29163C11.9567 2.29163 13.5424 3.87728 13.5424 5.83329V9.58329C13.5424 11.5393 11.9567 13.125 10.0007 13.125Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Microphone;
