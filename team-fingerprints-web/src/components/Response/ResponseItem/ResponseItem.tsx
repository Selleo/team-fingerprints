import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ResponseItem } from "../../../types/models";

const SurveyItem = ({ item }: { item: ResponseItem }) => {
  const navigate = useNavigate();

  return (
    <>
      <tr key={item.survey._id}>
        <td>{item.survey.title}</td>
        <td>
          <Button
            onClick={() => navigate(`/response/${item.survey._id}`)}
            color="green"
          >
            Answer Survey
          </Button>
        </td>
      </tr>
    </>
  );
};

export default SurveyItem;
