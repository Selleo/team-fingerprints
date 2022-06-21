import { ReactComponent as RightArrowIcon } from "assets/RightArrow.svg";
import { ReactComponent as Chart } from "assets/Chart.svg";

const StatusInfo = ({ status }: { status: string }) => {
  const getInfo = () => {
    switch (status) {
      case "finished":
        return (
          <div className="responses__status">
            <Chart />
            <span className="responses__status-text">Check results</span>
          </div>
        );
      case "pending":
        return (
          <div className="responses__status">
            <span className="responses__status-text">Return to filling</span>
            <RightArrowIcon />
          </div>
        );
      case "new":
        return (
          <div className="responses__status">
            <span className="responses__status-text">Start filling</span>
            <RightArrowIcon />
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="responses__status-wrapper">{getInfo()}</div>;
};

export default StatusInfo;
