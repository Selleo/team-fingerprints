import { useNavigate } from "react-router-dom";
import { ResponseItem } from "../../../types/models";
import StatusIcon from "./StatusIcon";
import StatusInfo from "./StatusInfo";

const SurveyItem = ({ item }: { item: ResponseItem }) => {
  const navigate = useNavigate();
  const { _id, title, completeStatus } = item.survey;

  return (
    <li
      className="responses__survey"
      onClick={() => navigate(`/response/${_id}`)}
    >
      <StatusIcon status={completeStatus} />
      <span className="responses__survey__name">
        {title}
        {completeStatus === "new" &&
          <span className="responses__survey__new-indicator">New</span>}
      </span>
      <StatusInfo status={completeStatus} />
    </li>
  );
};

export default SurveyItem;
