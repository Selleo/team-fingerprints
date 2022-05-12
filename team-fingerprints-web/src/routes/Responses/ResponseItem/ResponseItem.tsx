import { useNavigate } from "react-router-dom";
import { ResponseItem } from "../../../types/models";
import StatusIcon from "./StatusIcon";
import StatusInfo from "./StatusInfo";

type typeProps = { item: ResponseItem };

const SurveyItem = ({ item }: typeProps) => {
  const navigate = useNavigate();
  const { _id, title, completionStatus } = item.survey;

  return (
    <li
      className="responses__survey"
      onClick={() => navigate(`/response/${_id}`)}
    >
      <StatusIcon status={completionStatus} />
      <span className="responses__name">
        {title}
        {completionStatus === "new" && (
          <span className="responses__new-indicator">New</span>
        )}
      </span>
      <StatusInfo status={completionStatus} />
    </li>
  );
};

export default SurveyItem;
