import axios, { AxiosError } from "axios";
import { values } from "lodash";
import { FC, useEffect } from "react";
import { useQuery } from "react-query";
import SingleTeamResult from "../SingleTeamResult";
import { Company, CategoryResults } from "types/models";
import { SimpleTeamType } from "../SingleTeamResult/SingleTeamResult";

interface IProps {
  companyId: string;
  surveyId: string;
  setDataForCompany: (
    companyId: string,
    data: CategoryResults[],
    hidden: boolean
  ) => void;
  setDataForTeam: (
    companyId: string,
    teamInfo: SimpleTeamType,
    data: CategoryResults[],
    hidden: boolean
  ) => void;
  teamId: string;
  hidden?: boolean;
}

const SingleCompanyResult: FC<IProps> = ({
  companyId,
  surveyId,
  setDataForCompany,
  setDataForTeam,
  hidden = false,
}) => {
  const { data } = useQuery<{ [key: string]: CategoryResults }, AxiosError>(
    `surveyResultsAll-${surveyId}-${companyId}`,
    async () => {
      const { data } = await axios.get<{ [key: string]: CategoryResults }>(
        `/survey-results/${surveyId}/companies/${companyId}`
      );
      return data;
    }
  );

  const { data: companyData } = useQuery<{ company: Company }, AxiosError>(
    ["teams", companyId],
    async () => {
      const { data } = await axios.get<{ company: Company }>(
        `/companies/${companyId}`
      );
      return data;
    }
  );

  useEffect(() => {
    if (data) {
      setDataForCompany(companyId, values(data), hidden);
    }
  }, [data]);

  return (
    <>
      {companyData?.company?.teams?.map?.((team) => (
        <SingleTeamResult
          surveyId={surveyId}
          companyId={companyId}
          teamInfo={{
            teamId: team._id,
            teamName: team.name,
            pointColor: team.pointColor,
            pointShape: team.pointShape,
          }}
          setDataForTeam={setDataForTeam}
        />
      ))}
    </>
  );
};

export default SingleCompanyResult;
