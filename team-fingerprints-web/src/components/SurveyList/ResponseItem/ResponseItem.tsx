import { useNavigate } from "react-router-dom";
import { ResponseItem } from "../../../types/models";
import StatusIcon from "./StatusIcon";
import StatusInfo from "./StatusInfo";

type typeProps = {
  item: ResponseItem;
  companyId?: string | undefined;
  teamId?: string | undefined;
};

const SurveyItem = ({ item, companyId, teamId }: typeProps) => {
  const navigate = useNavigate();
  const { _id, title, completionStatus } = item.survey;

  const navigateUrl = () => {
    if (teamId) {
      return `/companies/${companyId}/team/${teamId}/surveys/${_id}`;
    } else if (companyId) {
      return `/companies/${companyId}/results/${_id}`;
    } else {
      return `/survey/${_id}`;
    }
  };

  return (
    <li
      key={item.survey._id}
      className="responses__survey"
      onClick={() => navigate(navigateUrl())}
    >
      <StatusIcon status={completionStatus} />
      <span className="responses__survey__name">
        {title}
        {completionStatus === "new" && (
          <span className="responses__survey__new-indicator">New</span>
        )}
      </span>
      <StatusInfo status={completionStatus} />
    </li>
  );
};

export default SurveyItem;
