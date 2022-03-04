import { useNavigate } from "react-router-dom";
import { ResponseItem } from "../../../types/models";
import { ReactComponent as SurveyIcon } from "../../../assets/Survey.svg";
import { ReactComponent as RightArrowIcon } from "../../../assets/RightArrow.svg";

const SurveyItem = ({ item }: { item: ResponseItem }) => {
  const navigate = useNavigate();

  const isFinished = item;

  console.log(item);

  return (
    <li
      className="responses__surveys__survey"
      onClick={() => navigate(`/response/${item.survey._id}`)}
    >
      <SurveyIcon />
      <span className="responses__surveys__survey__name">
        {item.survey.title}
        <span className="responses__surveys__survey__new-indicator">New</span>
      </span>
      <div className="responses__surveys__survey__status-info-wrapper">
        <span>Return to filling</span>
        <RightArrowIcon />
      </div>
    </li>
  );
};

export default SurveyItem;
