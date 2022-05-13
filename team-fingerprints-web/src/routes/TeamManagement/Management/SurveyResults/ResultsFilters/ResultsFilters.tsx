import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { isEmpty, omitBy, values as lodashValues } from "lodash";
import { useFormik } from "formik";
import { Button, ColorPicker, Select, TextInput } from "@mantine/core";
import ColoredShape from "../../../../../components/ColoredShape";
import ModalWrapper from "../../../../../components/Modals/ModalWrapper";

import FiltersSelect from "./FiltersSelect";
import { FilterSelect, Shape, FilterSets } from "../../../../../types/models";

type Props = {
  filterSet: any;
  currentFiltersValues: { [key: string]: Array<string> };
  surveyId?: string;
  changeFilterValue: any;
  setFilterSurveyResults: any;
  filterSurveyResults: any;
  teamId: string | undefined;
  companyId: string | undefined;
};

const ResultsFilters = ({
  currentFiltersValues,
  surveyId,
  changeFilterValue,
  filterSet,
  setFilterSurveyResults,
  filterSurveyResults,
  teamId,
  companyId,
}: Props) => {
  const [filterSetName, setFilterSetName] = useState("");
  const [filterSave, setFilterSave] = useState(false);
  const { handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: currentFiltersValues,
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      changeFilterValue({ ...filterSet, filters: valuesWithoutEmpties });
    },
  });

  const { data: surveyResult } = useQuery<any, Error>(
    ["chartData", surveyId, currentFiltersValues],
    async () => {
      const { data } = await axios.get<any>(
        `/survey-results/${surveyId}/companies`,
        { params: currentFiltersValues }
      );
      return data;
    }
  );

  useEffect(() => {
    const categoriesArray = lodashValues(surveyResult);
    setFilterSurveyResults({
      ...filterSurveyResults,
      [filterSet._id]: {
        id: filterSet._id,
        categories: categoriesArray,
        color: filterSet.pointColor,
        icon: filterSet.pointShape,
        visible: filterSet.visible,
      },
    });
    setFilterSetName(filterSet.name);
  }, [surveyResult, filterSave, surveyId, teamId, filterSet.visible]);

  useEffect(
    () => changeFilterValue({ ...filterSet, name: filterSetName }),
    [filterSetName]
  );

  const { data: availableFilters } = useQuery<any, Error>(
    ["surveyFiltersPublic", surveyId],
    async () => {
      const { data } = await axios.get<FilterSets>(
        `/survey-filters/${surveyId}/companies`
      );
      return data;
    }
  );

  return (
    <ModalWrapper
      modalVisible={filterSet.collapsed}
      setModalVisible={() => {
        changeFilterValue({
          ...filterSet,
          collapsed: !filterSet.collapsed,
        });
      }}
    >
      <div className="survey-response__selects">
        <div className="modal__header">
          <div className="modal__info">
            <div className="modal__icon">
              <ColoredShape
                shape={filterSet?.pointShape}
                color={filterSet?.pointColor}
              />
            </div>
            <div className="modal__name">{filterSet.name}</div>
          </div>
        </div>
        <div className="modal__config">
          <div>
            <TextInput
              label="Name"
              value={filterSetName}
              onChange={(e) => {
                setFilterSetName(e.target.value);
              }}
            />
            <Select
              style={{ marginTop: "20px" }}
              label="Shape"
              placeholder="Pick one"
              value={filterSet.pointShape}
              data={[
                { value: "triangle", label: "Triangle" },
                { value: "square", label: "Square" },
                { value: "circle", label: "Circle" },
                { value: "trapeze", label: "Trapeze" },
              ]}
              onChange={(e: Shape) =>
                changeFilterValue({ ...filterSet, pointShape: e })
              }
            />
          </div>
          <div>
            <label className="survey-response__selects__shapes-label">
              Shape's color
            </label>
            <ColorPicker
              style={{ width: "200px", height: "150px" }}
              format="hex"
              value={filterSet.pointColor}
              onChange={(e) => {
                changeFilterValue({ ...filterSet, pointColor: e });
              }}
              size="md"
            />
          </div>
        </div>
        {availableFilters?.map((filter: FilterSelect) => (
          <FiltersSelect
            key={filter._id}
            filter={filter}
            handleSubmit={handleSubmit}
            setFieldValue={setFieldValue}
            filterSet={filterSet}
          />
        ))}
        <div className="modal__footer">
          <Button
            onClick={() => {
              setFilterSave(!filterSave);
              changeFilterValue({
                ...filterSet,
                collapsed: !filterSet.collapsed,
              });
            }}
            className="modal__save"
          >
            SAVE
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ResultsFilters;
