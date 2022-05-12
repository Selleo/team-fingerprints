import axios from "axios";
import { useEffect, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { isArray, isEmpty, times } from "lodash";
import { Skeleton } from "@mantine/core";

import { Survey } from "../../types/models";
import { ReactComponent as BGIcons } from "../../assets/BGIcons.svg";

import ResponseItem from "./ResponseItem";

import ErrorLoading from "../../components/ErrorLoading";
import "./styles.sass";

const Responses = () => {
  const navigation = useNavigate();

  const { isLoading, error, data } = useQuery<Survey[]>(
    "surveysAll",
    async () => {
      const response = await axios.get<Survey[]>("/surveys");
      return response.data;
    }
  );

  const filtredByPublic = data
    ?.filter((survey) => survey.isPublic)
    .filter((survey) => !survey.archived);

  useEffect(() => {
    if (data?.length === 1) {
      const surveyId = data[0]?._id;
      navigation("/response/" + surveyId);
    }
  }, [data, navigation]);

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

    const mappedData = filtredByPublic?.map((el) => ({
      survey: el,
    }));

    return (
      isArray(mappedData) &&
      (isEmpty(mappedData) ? (
        <h3 className="responses__empty">No available surveys yet</h3>
      ) : (
        <ul className="responses__surveys">
          {mappedData?.map((item) => (
            <ResponseItem key={item.survey._id} item={item} />
          ))}
        </ul>
      ))
    );
  }, [data, error, isLoading]);

  // TODO map responses together with surveys

  return (
    <div className="responses">
      <h1 className="responses__headline">Your surveys</h1>
      {content}
      <div className="svg-background">
        <BGIcons />
      </div>
    </div>
  );
};

export default Responses;
