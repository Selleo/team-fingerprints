import axios from "axios";
import { values } from "lodash";
import { FC, useEffect } from "react";
import { useQuery } from "react-query";

interface IProps {
  companyId: string;
  surveyId: string;
  setDataForCompany: (companyId: string, data: any) => void;
}

const SingleCompanyResult: FC<IProps> = ({
  companyId,
  surveyId,
  setDataForCompany,
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

  useEffect(() => {
    setDataForCompany(companyId, values(data));
  }, [data]);

  return null;
};

export default SingleCompanyResult;
