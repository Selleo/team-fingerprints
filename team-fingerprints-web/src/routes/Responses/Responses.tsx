import { Skeleton, Table } from "@mantine/core";
import { useQuery } from "react-query";
import times from "lodash/times";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";

import { useStyles } from "./styles";

import axios from "axios";
import { Survey } from "../../types/models";
import ResponseItem from "../../components/Response/ResponseItem";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Responses = () => {
  const { classes } = useStyles();
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
  const mappedData = data?.map((el) => {
    return {
      survey: el,
    };
  });

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>Responses to surveys</h1>
      </div>
      <Table>
        {isArray(mappedData) &&
          (isEmpty(mappedData) ? (
            <span className={classes.emptyCopy}>No responses yet</span>
          ) : (
            <tbody>
              {mappedData?.map((item) => (
                <ResponseItem item={item} />
              ))}
            </tbody>
          ))}
      </Table>
    </>
  );
};

export default Responses;
