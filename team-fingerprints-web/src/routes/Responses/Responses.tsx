import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { isArray, isEmpty, times } from "lodash";
import { Skeleton, Table } from "@mantine/core";
import axios from "axios";

import { useStyles } from "./styles";
import { Survey } from "../../types/models";

import ResponseItem from "../../components/Response/ResponseItem";

const Responses = () => {
  const { classes: { emptyCopy, header, headerTitle } } = useStyles();
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
    <>
      <div className={header}>
        <h1 className={headerTitle}>Responses to surveys</h1>
      </div>
      <Table>
        {isArray(mappedData) &&
          (isEmpty(mappedData) ? (
            <span className={emptyCopy}>No responses yet</span>
          ) : (
            <tbody>
              {mappedData?.map((item) => (
                <ResponseItem key={item.survey._id} item={item} />
              ))}
            </tbody>
          ))}
      </Table>
    </>
  );
};

export default Responses;
