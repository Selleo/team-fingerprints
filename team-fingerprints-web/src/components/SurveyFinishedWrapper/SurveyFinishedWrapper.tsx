import { ReactNode } from "react";
import "./styles.sass";

type Props = {
  surveyTitle?: string;
  description: string;
  children: ReactNode;
};

const SurveyFinishedWrapper = ({
  surveyTitle,
  description,
  children,
}: Props) => {
  return (
    <div className="results">
      <h5 className="results__info">Results</h5>
      <h1 className="results__survey-name">{surveyTitle || "Survey Name"}</h1>
      <div className="results__description">{description}</div>
      {children}
    </div>
  );
};

export default SurveyFinishedWrapper;
