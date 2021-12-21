import { Accordion, Badge, Breadcrumbs, Skeleton, Title } from "@mantine/core";
import { times } from "lodash";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import AddCategoryButton from "../../../components/Category/AddCategoryButton";

function Details() {
  const params = useParams();
  const { isLoading, error, data } = useQuery("surveyOne", () =>
    fetch(`${process.env.REACT_APP_API_URL}/survey/${params.id}`).then((res) =>
      res.json()
    )
  );

  if (isLoading)
    return (
      <>
        {times(3, () => (
          <Skeleton height={80} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error) return <div>'An error has occurred: ' + console.error;</div>;

  return (
    <div>
      <h2>
        {data.title}{" "}
        {data.public ? (
          <Badge variant="dot">Public</Badge>
        ) : (
          <Badge>Not public</Badge>
        )}
      </h2>
      <AddCategoryButton surveyId={data._id} />
      <Accordion>
        <Accordion.Item label="category0"></Accordion.Item>

        <Accordion.Item label="category1"></Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Details;
