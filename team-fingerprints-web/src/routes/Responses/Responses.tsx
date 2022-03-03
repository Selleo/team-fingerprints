import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { isArray, isEmpty, times } from "lodash";
import { Skeleton } from "@mantine/core";
import axios from "axios";

import { Survey } from "../../types/models";
import { ReactComponent as BGIcons } from "../../assets/BGIcons.svg";

import ResponseItem from "./ResponseItem";

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

  useEffect(() => {
    if (data?.length === 1) {
      const surveyId = data[0]?._id;
      navigation("/response/" + surveyId);
    }
  }, [data, navigation]);

  if (isLoading)
    return (
      <>
        {times(5, () => (
          <Skeleton height={20} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error) return <div>'An error has occurred: ' + console.error;</div>;

  //TODO map responses together with surveys
  const mappedData = data?.map((el) => ({
    survey: el,
  }));

  return (
    <div className="responses">
      <h1 className="responses__headline">Your surveys</h1>
      {isArray(mappedData) &&
        (isEmpty(mappedData) ? (
          <h3 className="responses__empty">No available surveys yet</h3>
        ) : (
          <ul className="responses__surveys">
            {mappedData?.map((item) => (
              <ResponseItem key={item.survey._id} item={item} />
            ))}
          </ul>
        ))}
      <div className="svg-background">
        <BGIcons />
      </div>
    </div>
  );
};

export default Responses;
