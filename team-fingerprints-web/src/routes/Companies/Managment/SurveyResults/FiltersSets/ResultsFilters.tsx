import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { isEmpty, omitBy, values as lodashValues } from "lodash";
import { useFormik } from "formik";
import { Button, ColorPicker, Select, TextInput } from "@mantine/core";
import ColoredShape from "../../../../../components/ColoredShape";
import ModalWrapper from "../../../../../components/Modals/ModalWrapper";

import FiltersSelect from "./FiltersSelect";
import {
  FilterSelect,
  Shape,
  FiltersSet,
  ChangeFilterValue,
} from "../../../../../types/models";

type Props = {
  filterSet: FiltersSet;
  currentFiltersValues: { [key: string]: Array<string> };
  surveyId?: string;
  changeFilterValue: ChangeFilterValue;
  companyId: string | undefined;
  handleSave: (filterSetId: string, index: number) => void;
  index: number;
  deleteMutation: any;
};

const ResultsFilters = ({
  currentFiltersValues,
  surveyId,
  changeFilterValue,
  filterSet,
  companyId,
  handleSave,
  index,
  deleteMutation,
}: Props) => {
  const { handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: currentFiltersValues,
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      changeFilterValue(filterSet._id, "filters", valuesWithoutEmpties);
    },
  });

  const { data: surveyResult } = useQuery<any, Error>(
    [`chartData-${filterSet._id}`, companyId, currentFiltersValues, filterSet],
    async () => {
      const { data } = await axios.get<any>(
        `/survey-results/${surveyId}/companies/${companyId}`,
        { params: currentFiltersValues }
      );
      const categoriesArray = lodashValues(data);
      changeFilterValue(filterSet._id, "categories", categoriesArray);
    }
  );

  const { data: availableFilters } = useQuery<any, Error>(
    ["surveyFiltersPublic", surveyId, companyId],
    async () => {
      const { data } = await axios.get<FiltersSet>(
        `/survey-filters/${surveyId}/companies/${companyId}`
      );
      return data;
    }
  );

  return (
    <ModalWrapper
      modalVisible={filterSet.showModal}
      setModalVisible={() => {
        changeFilterValue(filterSet._id, "showModal", !filterSet.showModal);
      }}
    >
      <div className="filters__selects">
        <div className="filters__config">
          <div className="filters__appearance">
            <div className="filters__section">Appearance</div>
            <TextInput
              className="filters__name-input"
              label="Name"
              value={filterSet.name}
              onChange={(e) => {
                changeFilterValue(filterSet._id, "name", e.target.value);
              }}
            />
            <div className="filters__shape-title">Shape</div>
            <div className="filters__shape-wrapper">
              <div className="filters__shape">
                <ColoredShape
                  shape={filterSet?.pointShape}
                  color={filterSet?.pointColor}
                />
              </div>
              <Select
                className="filters__shape"
                placeholder="Pick one"
                value={filterSet.pointShape}
                data={[
                  { value: "triangle", label: "Triangle" },
                  { value: "square", label: "Square" },
                  { value: "circle", label: "Circle" },
                  { value: "trapeze", label: "Trapeze" },
                ]}
                onChange={(e: Shape) =>
                  changeFilterValue(filterSet._id, "pointShape", e)
                }
              />
            </div>
            <div>
              <label className="filters__shapes-label">Color</label>
              <ColorPicker
                className="filters__color"
                format="hex"
                value={filterSet.pointColor}
                onChange={(e) => {
                  changeFilterValue(filterSet._id, "pointColor", e);
                }}
                size="md"
              />
            </div>
          </div>
          <div className="filters__data">
            <div>Data</div>
            {availableFilters?.map((filter: FilterSelect) => (
              <FiltersSelect
                key={filter._id}
                filter={filter}
                handleSubmit={handleSubmit}
                setFieldValue={setFieldValue}
                filterSet={filterSet}
              />
            ))}
          </div>
        </div>
        <div className="filters__footer">
          <Button
            className="filters__delete"
            onClick={() =>
              deleteMutation.mutate({ _id: filterSet._id, index: index })
            }
          >
            DELETE
          </Button>
          <Button
            onClick={() => {
              handleSave(filterSet._id, index);
              changeFilterValue(
                filterSet._id,
                "showModal",
                !filterSet.showModal
              );
            }}
            className="filters__save"
          >
            SAVE
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ResultsFilters;
