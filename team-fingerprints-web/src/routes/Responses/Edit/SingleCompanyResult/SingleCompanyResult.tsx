import axios from "axios";
import { values } from "lodash";
import { FC, useEffect } from "react";
import { useQuery } from "react-query";
import { Company } from "../../../../types/models";
import SingleTeamResult from "../SingleTeamResult";
import { SimpleTeamType } from "../SingleTeamResult/SingleTeamResult";

interface IProps {
  companyId: string;
  surveyId: string;
  setDataForCompany: (companyId: string, data: any, hidden: boolean) => void;
  setDataForTeam: (
    companyId: string,
    teamInfo: SimpleTeamType,
    data: any,
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
  const { data } = useQuery<any, Error>(
    `surveyResultsAll-${surveyId}-${companyId}`,
    async () => {
      const { data } = await axios.get<any>(
        `/survey-results/${surveyId}/companies/${companyId}`
      );
      return data;
    }
  );

  const { data: companyData } = useQuery<{ company: Company }, Error>(
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

  console.log(companyData);
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
