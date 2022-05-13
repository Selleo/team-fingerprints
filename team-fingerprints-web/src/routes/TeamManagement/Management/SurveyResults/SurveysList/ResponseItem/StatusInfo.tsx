import { ReactComponent as RightArrowIcon } from "../../../../../../assets/RightArrow.svg";
import { ReactComponent as Chart } from "../../../../../../assets/Chart.svg";

const StatusInfo = ({ status }: { status: string }) => {
  const getInfo = () => {
    switch (status) {
      case "finished":
        return (
          <span className="responses__survey__status">
            <Chart />
            Check results
          </span>
        );
      case "pending":
        return (
          <span className="responses__survey__status">
            Return to filling
            <RightArrowIcon />
          </span>
        );
      case "new":
        return (
          <span className="responses__survey__status">
            Start filling
            <RightArrowIcon />
          </span>
        );
      default:
        return null;
    }
  };

  return <div className="responses__survey__status-wrapper">{getInfo()}</div>;
};

export default StatusInfo;
