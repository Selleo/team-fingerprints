import { ReactComponent as SurveyIcon } from "../../../assets/Survey.svg";
import { ReactComponent as TwoPeopleIcon } from "../../../assets/TwoPeople.svg";

const StatusIcon = ({ status }: { status: string }) => {

    if(status==="finished") {
        return <TwoPeopleIcon />
    }

    else {
        return <SurveyIcon />
    }

}

export default StatusIcon
