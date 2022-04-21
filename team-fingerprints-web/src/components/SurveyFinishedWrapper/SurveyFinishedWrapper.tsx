import "./styles.sass";

type Props = {
    surveyTitle?: string
    description: string
    children: any
}

const SurveyFinishedWrapper = ({ surveyTitle, description, children }: Props) => {
    return (
        <div className="survey-response__finished">
            <div className="survey-response__description">
                <h5 className="survey-response__description__info">Results</h5>
                <h1 className="survey-response__description__title">
                    {surveyTitle || "Survey Name"}
                </h1>
                <div className="survey-response__description__copy">
                    {description}
                </div>
                {children}
            </div>
        </div>
    )
}

export default SurveyFinishedWrapper