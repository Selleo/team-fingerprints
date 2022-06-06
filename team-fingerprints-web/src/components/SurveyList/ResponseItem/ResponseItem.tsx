import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ResponseItem } from "../../../types/models";
import StatusIcon from "./StatusIcon";
import StatusInfo from "./StatusInfo";

type typeProps = {
  item: ResponseItem;
  companyId?: string;
  teamId?: string;
  navigateUrl: string;
};

const SurveyItem = ({ item, companyId, teamId, navigateUrl }: typeProps) => {
  const navigate = useNavigate();
  const { _id, title, completionStatus } = item.survey;

  return (
    <li key={item.survey._id}>
      <div
        className="responses__survey"
        onClick={() => navigate(navigateUrl + _id)}
      >
        <StatusIcon status={completionStatus} />
        <span className="responses__survey__name">
          {title}
          {completionStatus === "new" && (
            <span className="responses__survey__new-indicator">New</span>
          )}
        </span>
        <StatusInfo status={completionStatus} />
      </div>
    </li>
  );
};

export default SurveyItem;
