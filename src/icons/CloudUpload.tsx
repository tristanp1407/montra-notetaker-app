const CloudUpload = ({
  className = "w-5 h-5 text-gray-500",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 16.0417V9.79171M10 9.79171L12.0833 11.875M10 9.79171L7.91666 11.875M12.5 16.0417H15.1042C17.0027 16.0417 18.5417 14.5027 18.5417 12.6042C18.5417 10.7057 17.0027 9.16671 15.1042 9.16671C15.0678 9.16671 15.0317 9.16729 14.9957 9.16837C14.9986 9.09871 15 9.02871 15 8.95837C15 6.19695 12.7614 3.95837 10 3.95837C7.80966 3.95837 5.94827 5.36678 5.27205 7.32737C3.12089 7.60287 1.45833 9.44062 1.45833 11.6667C1.45833 14.083 3.41709 16.0417 5.83333 16.0417H7.5"
      stroke="#505050"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CloudUpload;
