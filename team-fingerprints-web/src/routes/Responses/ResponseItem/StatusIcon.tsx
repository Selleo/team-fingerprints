import { ReactComponent as SurveyIcon } from "../../../assets/Survey.svg";
import { ReactComponent as TwoPeopleIcon } from "../../../assets/TwoPeople.svg";

const StatusIcon = ({ status }: { status: string }) => {

    switch (status) {
        case "finished": return <TwoPeopleIcon />
        case "pending":
        case "new": return <SurveyIcon />
        default: return null
    }

}

export default StatusIcon