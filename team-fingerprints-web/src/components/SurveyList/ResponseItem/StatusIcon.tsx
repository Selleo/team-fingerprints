import { ReactComponent as SurveyIcon } from "../../../assets/Survey.svg";
import { ReactComponent as TwoPeopleIcon } from "../../../assets/TwoPeople.svg";

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "finished") {
    return <TwoPeopleIcon />;
  }

  return <SurveyIcon />;
};

export default StatusIcon;
