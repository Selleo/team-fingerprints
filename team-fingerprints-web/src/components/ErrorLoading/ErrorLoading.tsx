import { ReactComponent as XCircleIcon } from "assets/XCircle.svg";
import "./styles.sass";

const ErrorLoading = ({ title = "Can't load this data" }) => {
  return (
    <div className="loading-failed">
      <h1 className="loading-failed__headline">{title}</h1>
      <XCircleIcon className="loading-failed__icon" />
    </div>
  );
};

export default ErrorLoading;
