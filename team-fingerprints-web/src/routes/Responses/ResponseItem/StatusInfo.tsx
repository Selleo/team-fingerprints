import { ReactComponent as RightArrowIcon } from "../../../assets/RightArrow.svg";
import { ReactComponent as Chart } from "../../../assets/Chart.svg";

const StatusInfo = ({ status }: { status: string }) => {

    const getInfo = () => {
        switch (status) {
            case "finished": return <><Chart /> <span>Check results</span></>
            case "pending": return <><span>Return to filling</span> <RightArrowIcon /></>
            case "new": return <><span>Start filling</span> <RightArrowIcon /></>
            default: return null;
        }
    }

    return (
        <div className="responses__surveys__survey__status-info-wrapper">
            {getInfo()}
        </div>
    )

}

export default StatusInfo