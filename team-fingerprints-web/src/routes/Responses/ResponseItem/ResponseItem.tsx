import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatusIcon from "./StatusIcon";
import StatusInfo from "./StatusInfo";
import OnboardingProfileModal from "components/OnboardingProfileModal";

import { ProfileContext } from "routes";
import { ResponseItem } from "types/models";

type typeProps = { item: ResponseItem };

const SurveyItem = ({ item }: typeProps) => {
  const navigate = useNavigate();
  const { _id, title, completionStatus } = item.survey;
  const { profile } = useContext(ProfileContext);
  const [visibleProfileModal, setVisibleProfileModal] = useState(false);

  return (
    <>
      <li
        className="responses__survey"
        onClick={() => {
          if (profile) {
            if (Object.keys(profile.userDetails).length < 7) {
              setVisibleProfileModal(true);
            } else {
              navigate(`/response/${_id}`);
            }
          }
        }}
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
      <OnboardingProfileModal
        visibleProfileModal={visibleProfileModal}
        setVisibleProfileModal={setVisibleProfileModal}
      />
    </>
  );
};

export default SurveyItem;
