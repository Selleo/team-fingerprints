import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { times } from "lodash";
import { Badge, Skeleton, List, Group, Text } from "@mantine/core";

import AddCategoryButton from "../../../components/Category/AddCategoryButton";
import AddQuestionButton from "../../../components/Question/AddQuestionButton";
import AddTrendButton from "../../../components/Trend/AddTrendButton";
import DeleteCategoryButton from "../../../components/Category/DeleteCategoryButton";
import DeleteQuestionButton from "../../../components/Question/DeleteQuestionButton";
import DeleteTrendButton from "../../../components/Trend/DeleteTrendButton";
import EditCategoryButton from "../../../components/Category/EditCategoryButton";
import EditQuestionButton from "../../../components/Question/EditQuestionButton";
import EditTrendButton from "../../../components/Trend/EditTrendButton/EditTrendButton";

import {
  Category,
  Question,
  SurveyDetails,
  Trend,
} from "../../../types/models";

import { CategoryIcon, PrimaryIcon, SecondaryIcon, TrendIcon } from "./Icons";
import ErrorLoading from "../../../components/ErrorLoading";

function Details() {
  const { id } = useParams();
  const {
    isLoading,
    error,
    data: survey,
  } = useQuery<SurveyDetails, Error>(`surveyOne${id}`, async () => {
    const { data } = await axios.get<SurveyDetails>(`/surveys/${id}`);
    return data;
  });

  if (error) return <ErrorLoading title="Can't load survey info" />;

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
        <Badge
          style={{ marginLeft: "10px", top: 0 }}
          variant={survey.isPublic ? "dot" : "outline"}
        >
          {survey.isPublic ? "Public" : "Not public"}
        </Badge>
      </h2>
      <AddCategoryButton surveyId={survey?._id} />
      <List style={{ padding: "10px" }}>
        {survey.categories.map((category: Category) => (
          <List.Item icon={<CategoryIcon />}>
            <Group>
              <Text>{category.title}</Text>
              <EditCategoryButton category={category} surveyId={survey?._id} />
              {!survey.isPublic && (
                <DeleteCategoryButton
                  categoryId={category._id}
                  surveyId={survey?._id}
                />
              )}
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
                      <Text color="#48bd66">
                        primary: <strong>{trend.primary}</strong>
                      </Text>
                      <Text color="#FEC92D">secondary: {trend.secondary}</Text>
                      <EditTrendButton
                        trend={trend}
                        surveyId={survey?._id}
                        categoryId={category._id}
                      />
                      {!survey?.isPublic && (
                        <DeleteTrendButton
                          trendId={trend._id}
                          surveyId={survey?._id}
                          categoryId={category._id}
                        />
                      )}
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
                            <Group>
                              <Text>{question.title}</Text>
                              <EditQuestionButton
                                question={question}
                                surveyId={survey._id}
                                trendId={trend._id}
                                categoryId={category._id}
                              />
                              {!survey?.isPublic && (
                                <DeleteQuestionButton
                                  questionId={question._id}
                                  surveyId={survey._id}
                                  trendId={trend._id}
                                  categoryId={category._id}
                                />
                              )}
                            </Group>
                          </List.Item>
                        );
                      })}
                    </List>
                  </List.Item>
                );
              })}
            </List>
          </List.Item>
        ))}
      </List>
    </div>
  );
}

export default Details;
