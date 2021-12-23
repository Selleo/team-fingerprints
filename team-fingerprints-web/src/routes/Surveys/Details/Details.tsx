import { Accordion, Badge, Skeleton } from "@mantine/core";
import axios from "axios";
import { times } from "lodash";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import AddCategoryButton from "../../../components/Category/AddCategoryButton";
import { SurveyDetails } from "../../../types/models";

function Details() {
  const params = useParams();
  const { isLoading, error, data } = useQuery<SurveyDetails, Error>(
    "surveyOne",
    async () => {
      const response = await axios.get<SurveyDetails>(`/survey/${params.id}`);
      return response.data;
    }
  );

  if (error) return <div>'An error has occurred: ' + console.error;</div>;
  if (isLoading || !data)
    return (
      <>
        {times(3, () => (
          <Skeleton height={80} mt={6} radius="xl" />
        ))}
      </>
    );

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
      <AddCategoryButton surveyId={data?._id} />
      <Accordion>
        {data.categories.map((category: any) => {
          return <Accordion.Item label={category.title}></Accordion.Item>;
        })}
      </Accordion>
    </div>
  );
}

export default Details;
