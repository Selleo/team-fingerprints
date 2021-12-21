import { Button } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Survey } from "../../../types/models";

const SurveyItem = ({ item }: { item: Survey }) => {
  const navigate = useNavigate();
  return (
    <tr key={item._id}>
      <td>{item.title}</td>
      <td>{item.public ? "public" : "not public"}</td>
      <td>
        <Button onClick={() => navigate(`/survey/${item._id}`)}>Show</Button>
      </td>
    </tr>
  );
};

export default SurveyItem;
