import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ResponseItem } from "../../../types/models";
import StatusIcon from "./StatusIcon";
import StatusInfo from "./StatusInfo";

type typeProps = {
  item: ResponseItem;
  companyId?: string;
  teamId?: string;
};

const SurveyItem = ({ item, companyId, teamId }: typeProps) => {
  const navigate = useNavigate();
  const { _id, title, completionStatus } = item.survey;

  const navigateUrl = useMemo(() => {
    if (teamId) {
      return `/companies/${companyId}/team/${teamId}/surveys/${_id}`;
    }
    if (companyId) {
      return `/companies/${companyId}/results/${_id}`;
    }
    return `/survey/${_id}`;
  }, [teamId, companyId]);

  return (
    <li key={item.survey._id}>
      <div className="responses__survey" onClick={() => navigate(navigateUrl)}>
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
