import { MdError } from "react-icons/md";

interface ErrorAlertProps {
  title?: string;
  errors: (string | undefined | null)[];
  additionalClasses?: string;
  centerScreen?: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  errors,
  additionalClasses = "",
  centerScreen = false,
}) => {
  const filteredErrors = errors.filter(Boolean);
  if (!filteredErrors.length) return null;

  return (
    <div
      className={`w-full ${
        centerScreen ? "flex items-center justify-center" : ""
      }`}
    >
      <div
        className={`border border-red-500 rounded-xl px-6 py-4 bg-white text-center shadow-md ${additionalClasses}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <MdError
            className="text-red-600 text-4xl"
            data-testid="MdError-icon"
          />
          {title && <p className="text-red-600 font-bold text-lg">{title}</p>}
          <ul className="text-red-600 text-sm list-none mt-2">
            {filteredErrors.map((msg, idx) => (
              <li key={idx} className="font-medium text-left">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ErrorAlert;
