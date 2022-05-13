import { useMemo } from "react";
import { useQuery } from "react-query";
import { isArray, isEmpty, times } from "lodash";
import { Skeleton } from "@mantine/core";
import axios from "axios";

import ErrorLoading from "../../../../../components/ErrorLoading";
import BackToScreen from "../../../../../components/BackToScreen/BackToScreen";
import ResponseItem from "./ResponseItem";

import { useParams } from "react-router-dom";
import { Survey } from "../../../../../types/models";
import { ReactComponent as BGIcons } from "../../../../../assets/BGIcons.svg";

import "./styles.sass";

const SurveysList = () => {
  const { companyId } = useParams();
  const { isLoading, error, data } = useQuery<Survey[]>(
    "surveysAllPublic",
    async () => {
      const response = await axios.get<Survey[]>("/surveys/public");
      return response.data;
    }
  );

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
            />
          ))}
        </ul>
      ))
    );
  }, [data, error, isLoading]);

  return (
    <div className="responses">
      <BackToScreen name="Company Managment" />
      <h1 className="responses__headline">Public surveys</h1>
      {content}
      <div className="svg-background">
        <BGIcons />
      </div>
    </div>
  );
};

export default SurveysList;
