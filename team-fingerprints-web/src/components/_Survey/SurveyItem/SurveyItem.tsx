import React from "react";
import { Survey } from "../../../types/models";

const SurveyItem = ({ item }: { item: Survey }) => (
  <tr key={item._id}>
    <td>{item.title}</td>
    <td>{item.public ? "public" : "not public"}</td>
  </tr>
);

export default SurveyItem;
