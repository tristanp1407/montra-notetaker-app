const Lock = ({
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
      d="M10.8334 6.5V4.83333C10.8334 3.26853 9.56488 2 8.00008 2C6.43527 2 5.16675 3.26853 5.16675 4.83333V6.5M8.00008 9.33333V11.3333M4.50008 14.1667H11.5001C12.2365 14.1667 12.8334 13.5697 12.8334 12.8333V7.83333C12.8334 7.09693 12.2365 6.5 11.5001 6.5H4.50008C3.7637 6.5 3.16675 7.09693 3.16675 7.83333V12.8333C3.16675 13.5697 3.7637 14.1667 4.50008 14.1667Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Lock;
