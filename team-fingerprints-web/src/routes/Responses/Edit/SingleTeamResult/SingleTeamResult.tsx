import axios from "axios";
import { values } from "lodash";
import { FC, useEffect } from "react";
import { useQuery } from "react-query";
import { Shape } from "../../../../types/models";

export type SimpleTeamType = {
  teamId: string;
  teamName: string;
  pointColor: string;
  pointShape: Shape;
};

interface IProps {
  companyId: string;
  surveyId: string;
  setDataForTeam: (
    companyId: string,
    teamInfo: SimpleTeamType,
    data: any,
    hidden: boolean
  ) => void;
  teamInfo: SimpleTeamType;
  hidden?: boolean;
}

const SingleTeamResult: FC<IProps> = ({
  companyId,
  surveyId,
  setDataForTeam,
  teamInfo,
  hidden = false,
}) => {
  const { data } = useQuery<any, Error>(
    `surveyResultsAll-${surveyId}-${companyId}-${teamInfo.teamId}`,
    async () => {
      const { data } = await axios.get<any>(
        `/survey-results/${surveyId}/companies/${companyId}/teams/${teamInfo.teamId}`
      );
      return data;
    }
  );

  useEffect(() => {
    if (data) {
      setDataForTeam(companyId, teamInfo, values(data), hidden);
    }
  }, [data]);

  return null;
};

export default SingleTeamResult;
