import axios from "axios";
import { values } from "lodash";
import { FC, useEffect } from "react";
import { useQuery } from "react-query";

interface IProps {
  companyId: string;
  surveyId: string;
  setDataForTeam: (companyId: string, teamId: string, data: any) => void;
  teamId: string;
}

const SingleTeamResult: FC<IProps> = ({
  companyId,
  surveyId,
  setDataForTeam,
  teamId,
}) => {
  const { data } = useQuery<any, Error>(
    `surveyResultsAll-${surveyId}-${companyId}-${teamId}`,
    async () => {
      const { data } = await axios.get<any>(
        `/survey-results/${surveyId}/companies/${companyId}/teams/${teamId}`
      );
      return data;
    }
  );

  useEffect(() => {
    setDataForTeam(companyId, teamId, values(data));
  }, [data]);

  return null;
};

export default SingleTeamResult;
