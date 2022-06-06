import axios from "axios";

import { useMemo } from "react";
import { useQuery } from "react-query";
import { isArray, isEmpty, times } from "lodash";
import { Skeleton } from "@mantine/core";
import { useParams } from "react-router-dom";

import ErrorLoading from "../ErrorLoading";
import BackToScreen from "../BackToScreen";
import ResponseItem from "./ResponseItem";

import { Survey } from "../../types/models";
import { ReactComponent as BGIcons } from "../../assets/BGIcons.svg";

import "./styles.sass";

const SurveyList = () => {
  const { companyId, teamId } = useParams();
  const { isLoading, error, data } = useQuery<Survey[]>(
    "surveysAllPublic",
    async () => {
      const response = await axios.get<Survey[]>("/surveys/public");
      return response.data;
    }
  );

  const navigateUrl = useMemo(() => {
    if (teamId) {
      return `/companies/${companyId}/team/${teamId}/surveys/`;
    }
    if (companyId) {
      return `/companies/${companyId}/results/`;
    }
    return `/survey/`;
  }, [teamId, companyId]);

  const content = useMemo(() => {
    if (isLoading)
      return (
        <>
          {times(3, () => (
            <Skeleton height={73} width={560} mt={6} radius="md" animate />
          ))}
        </>
      );

    if (error) return <ErrorLoading title="Can't load responses" />;

    const mappedData = data?.map((el) => ({
      survey: el,
    }));

    return (
      isArray(mappedData) &&
      (isEmpty(mappedData) ? (
        <h3 className="responses__empty">No available surveys yet</h3>
      ) : (
        <ul className="responses__surveys">
          {mappedData?.map((item) => (
            <ResponseItem
              key={item.survey._id}
              item={item}
              companyId={companyId}
              teamId={teamId}
              navigateUrl={navigateUrl}
            />
          ))}
        </ul>
      ))
    );
  }, [data, error, isLoading]);

  const backToScreen = useMemo(() => {
    if (teamId) {
      return "Team Managment";
    }
    if (companyId) {
      return "Company Managment";
    }
    return "Login";
  }, [teamId, companyId]);

  return (
    <div className="responses">
      <BackToScreen name={backToScreen} />
      <h1 className="responses__headline">Surveys List</h1>
      {content}
      <div className="svg-background">
        <BGIcons />
      </div>
    </div>
  );
};

export default SurveyList;
