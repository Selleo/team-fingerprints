import PuffLoader from "react-spinners/PuffLoader";

import "./styles.sass";

const LoadingData = ({ title = "Loading profile data" }) => {
  return (
    <div className="loading">
      <h1 className="loading__headline">{title}</h1>
      <PuffLoader color={"#32A89C"} />
    </div>
  );
};

export default LoadingData;
