import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { each, isEmpty, keys } from "lodash";

import ColoredShape from "components/ColoredShape";
import Chart from "components/Chart";
import SurveyFinishedWrapper from "components/SurveyFinishedWrapper/SurveyFinishedWrapper";
import SingleCompanyResult from "./../SingleCompanyResult/SingleCompanyResult";

import {
  AdditionalData,
  ComplexRole,
  SurveyDetails,
  SurveyAnswers,
  CategoryResults,
} from "types/models";
import { Switch } from "components/Switch";
import { ProfileContext } from "routes";
import { ReactComponent as CircleIcon } from "assets/shapes/Circle.svg";
import { SimpleTeamType } from "./../SingleTeamResult/SingleTeamResult";

type ResultsPerCompany = {
  [key: string]: {
    role: ComplexRole;
    categoriesArray: CategoryResults[];
    team: boolean;
    hidden: boolean;
    teamInfo?: SimpleTeamType;
  };
};

type Props = {
  surveyFinished: { _id: string; surveysAnswers: SurveyAnswers };
  survey?: SurveyDetails;
};

const SurveyResults = ({ surveyFinished, survey }: Props) => {
  const [visibleData, setVisibleData] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { profile } = useContext(ProfileContext);
  const [showMyResults, setShowMyResults] = useState(true);
  const [companiesResults, setCompaniesResult] = useState<ResultsPerCompany>(
    {}
  );
  const usersTeams = profile?.privileges.reduce<string[]>((prev, curr) => {
    const teamId = curr.team?._id;
    if (teamId) {
      if (!prev.find((el) => teamId === el)) {
        return [...prev, teamId];
      }
    }
    return prev;
  }, []);

  const { surveyId } = useParams();

  const surveyResult = surveyFinished?.surveysAnswers?.[0].surveyResult;

  const additionalData = useMemo(() => {
    let tmp: AdditionalData[] = [];
    let visibility = {};

    if (!isEmpty(companiesResults)) {
      each(keys(companiesResults), (companyOrTeamId) => {
        const dataAndRoleForCompany = companiesResults[companyOrTeamId];

        if (dataAndRoleForCompany.teamInfo) {
          tmp.push({
            categories: dataAndRoleForCompany.categoriesArray,
            pointColor: dataAndRoleForCompany.teamInfo.pointColor,
            pointShape: dataAndRoleForCompany.teamInfo.pointShape,
            _id: dataAndRoleForCompany.teamInfo.teamId,
            name: `${dataAndRoleForCompany.role.company.name} / ${dataAndRoleForCompany.teamInfo.teamName}`,
          });
        } else {
          tmp.push({
            categories: dataAndRoleForCompany.categoriesArray,
            pointColor: dataAndRoleForCompany.role.company.pointColor,
            pointShape: dataAndRoleForCompany.role.company.pointShape,
            _id: companyOrTeamId,
            name: dataAndRoleForCompany.role.company.name,
          });
        }

        visibility = {
          ...visibility,
          [companyOrTeamId]: !dataAndRoleForCompany.hidden,
        };
      });
    }
    setVisibleData(visibility);
    return tmp;
  }, [companiesResults]);

  const filteredAdditionalData = useMemo(() => {
    return additionalData.filter((element) => {
      return visibleData[element._id];
    });
  }, [additionalData, visibleData]);

  const surveyIsFinished =
    surveyFinished?.surveysAnswers?.[0].completionStatus === "finished";

  const setDataForCompany =
    (role: ComplexRole) =>
    (
      companyId: string,
      categoriesArray: CategoryResults[],
      hidden: boolean
    ) => {
      setCompaniesResult((prev) => ({
        ...prev,
        [companyId]: { categoriesArray, role, team: false, hidden },
      }));
    };

  const setDataForTeam =
    (role: ComplexRole) =>
    (
      _companyId: string,
      teamInfo: SimpleTeamType,
      categoriesArray: CategoryResults[]
    ) => {
      setCompaniesResult((prev) => ({
        ...prev,
        [teamInfo.teamId]: {
          categoriesArray,
          role,
          team: true,
          hidden: !usersTeams?.find((el) => el === teamInfo.teamId),
          teamInfo,
        },
      }));
    };

  const surveyResults = useMemo(
    () => (
      <>
        <SurveyFinishedWrapper
          surveyTitle={survey?.title}
          description="Compare your results with the company, the world or other
          employees. To display the data on the chart, turn on the switch
          next to the category name."
        >
          <div className="results__legend">
            <div className="results__item">
              <div className="results__icon">
                <CircleIcon stroke={"#32A89C"} />
              </div>
              <span className="results__item-name">You</span>
              <Switch value={showMyResults} setValue={setShowMyResults} />
            </div>
            {keys(visibleData).map((key) => {
              const singleVisibleData = additionalData.find(
                (el) => el._id === key
              );
              return (
                <div className="results__item">
                  <div className="results__icon">
                    <ColoredShape
                      shape={singleVisibleData?.pointShape}
                      color={singleVisibleData?.pointColor}
                    />
                  </div>
                  <span className="results__item-name">
                    {singleVisibleData?.name}
                  </span>
                  <Switch
                    value={!!visibleData[key]}
                    setValue={() =>
                      setVisibleData({
                        ...visibleData,
                        [key]: !visibleData[key],
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
          <Chart
            surveyResult={surveyResult}
            additionalData={filteredAdditionalData}
            showMe={showMyResults}
          />
        </SurveyFinishedWrapper>
        {profile?.privileges.map((role) => (
          <>
            {surveyId && role.company?._id && (
              <SingleCompanyResult
                key={role.roleId}
                surveyId={surveyId}
                companyId={role.company?._id}
                setDataForCompany={setDataForCompany(role)}
                setDataForTeam={setDataForTeam(role)}
                teamId={role.team?._id}
                hidden
              />
            )}
          </>
        ))}
      </>
    ),
    [
      surveyIsFinished,
      survey?.title,
      showMyResults,
      visibleData,
      surveyResult,
      filteredAdditionalData,
      surveyId,
      additionalData,
    ]
  );

  return surveyResults;
};

export default SurveyResults;
