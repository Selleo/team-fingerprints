import {
  Accordion,
  Badge,
  Skeleton,
  ThemeIcon,
  List,
  Group,
  Text,
} from "@mantine/core";
import {
  GridIcon,
  SliderIcon,
  CheckboxIcon,
  ResetIcon,
} from "@modulz/radix-icons";
import axios from "axios";
import { times } from "lodash";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import AddCategoryButton from "../../../components/Category/AddCategoryButton";
import DeleteCategoryButton from "../../../components/Category/DeleteCategoryButton";
import AddQuestionButton from "../../../components/Question/AddQuestionButton";
import DeleteQuestionButton from "../../../components/Question/DeleteQuestionButton";
import AddTrendButton from "../../../components/Trend/AddTrendButton";
import DeleteTrendButton from "../../../components/Trend/DeleteTrendButton";
import {
  Category,
  Question,
  SurveyDetails,
  Trend,
} from "../../../types/models";

const CategoryIcon = () => {
  return (
    <ThemeIcon size={30} color="violet" variant="light" radius="xl">
      <GridIcon />
    </ThemeIcon>
  );
};

const TrendIcon = () => {
  return (
    <ThemeIcon size={30} color="pink" variant="light" radius="xl">
      <SliderIcon />
    </ThemeIcon>
  );
};

const SecondaryIcon = () => {
  return (
    <ThemeIcon color="red" size={30} radius="xl">
      <ResetIcon />
    </ThemeIcon>
  );
};

const PrimaryIcon = () => {
  return (
    <ThemeIcon color="teal" size={30} radius="xl">
      <CheckboxIcon />
    </ThemeIcon>
  );
};
function Details() {
  const params = useParams();
  const {
    isLoading,
    error,
    data: survey,
  } = useQuery<SurveyDetails, Error>("surveyOne", async () => {
    const response = await axios.get<SurveyDetails>(`/survey/${params.id}`);
    return response.data;
  });

  if (error) return <div>'An error has occurred: ' + console.error;</div>;
  if (isLoading || !survey)
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
        {survey.title}
        {survey.public ? (
          <Badge variant="dot">Public</Badge>
        ) : (
          <Badge>Not public</Badge>
        )}
      </h2>
      <AddCategoryButton surveyId={survey?._id} />
      <List style={{ padding: "10px" }}>
        {survey.categories.map((category: Category) => {
          return (
            <List.Item icon={<CategoryIcon />}>
              <Group>
                <Text>{category.title}</Text>
                <DeleteCategoryButton
                  categoryId={category._id}
                  surveyId={survey?._id}
                />
              </Group>
              <Group style={{ marginTop: "10px" }}>
                <AddTrendButton
                  surveyId={survey?._id}
                  categoryId={category._id}
                />
              </Group>
              <List style={{ padding: "10px" }}>
                {category.trends.map((trend: Trend) => {
                  return (
                    <List.Item icon={<TrendIcon />}>
                      <Group>
                        <Text>{`${trend.primary} <=> ${trend.secondary}`}</Text>
                        <DeleteTrendButton
                          trendId={trend._id}
                          surveyId={survey?._id}
                          categoryId={category._id}
                        />
                      </Group>
                      <Group style={{ marginTop: "10px" }}>
                        <AddQuestionButton
                          trendId={trend._id}
                          surveyId={survey?._id}
                          categoryId={category._id}
                        />
                      </Group>
                      <List
                        style={{
                          padding: "10px",
                        }}
                        spacing="xs"
                        size="sm"
                        center
                        icon={<PrimaryIcon />}
                      >
                        {trend.questions.map((question: Question) => {
                          const icon = !question.primary
                            ? { icon: <SecondaryIcon /> }
                            : {};
                          return (
                            <List.Item {...icon}>
                              {`${question.title} ${
                                question.primary ? "(primary)" : "(secondary)"
                              }`}
                              <DeleteQuestionButton
                                questionId={question._id}
                                surveyId={survey._id}
                                trendId={trend._id}
                                categoryId={category._id}
                              />
                            </List.Item>
                          );
                        })}
                      </List>
                    </List.Item>
                  );
                })}
              </List>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
}

export default Details;
