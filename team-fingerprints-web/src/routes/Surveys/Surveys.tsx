import React from "react";
import { useQuery } from "react-query";

const Surveys = () => {
  const { isLoading, error, data } = useQuery("repoData", () =>
    fetch(`${process.env.REACT_APP_API_URL}`).then((res) => res.text())
  );
  if (isLoading) return <div>'Loading...'</div>;
  if (error) return <div>'An error has occurred: ' + console.error;</div>;

  return (
    <div>
      <h1>Data</h1>
      <h1>{data}</h1>
      <h2>{process.env.REACT_APP_API_URL}</h2>
    </div>
  );
};

export default Surveys;
