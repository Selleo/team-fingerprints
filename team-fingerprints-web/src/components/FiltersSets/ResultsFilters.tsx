import axios, { AxiosResponse } from "axios";
import { useQuery, UseMutationResult } from "react-query";
import { findIndex, isEmpty, omitBy, values as lodashValues } from "lodash";
import { useFormik } from "formik";
import { Button, ColorPicker, Select, TextInput } from "@mantine/core";
import ColoredShape from "../ColoredShape";
import ModalWrapper from "../Modals/ModalWrapper";

import FiltersSelect from "./FiltersSelect";
import {
  FilterSelect,
  Shape,
  FiltersSet,
  ChangeFilterValue,
} from "../../types/models";
import ModalConfirmTrigger from "../Modals/ModalConfirmTrigger";

type Props = {
  filterSet: FiltersSet;
  currentFiltersValues: { [key: string]: Array<string> };
  changeFilterValue: ChangeFilterValue;
  handleSave: (filterSetId: string, index: number) => void;
  index: number;
  handleDelete: (filterSet: FiltersSet, index: number) => void;
  apiUrl?: string;
  isPublic?: boolean;
};

const ResultsFilters = ({
  currentFiltersValues,
  changeFilterValue,
  filterSet,
  handleSave,
  index,
  handleDelete,
  apiUrl,
  isPublic,
}: Props) => {
  const { handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: currentFiltersValues,
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      changeFilterValue(filterSet._id, "filters", valuesWithoutEmpties);
    },
  });

  useQuery<any, Error>(
    [`chartData-${filterSet._id}`, apiUrl, currentFiltersValues, filterSet],
    async () => {
      const { data } = await axios.get<any>(`/survey-results/${apiUrl}`, {
        params: currentFiltersValues,
      });
      const categoriesArray = lodashValues(data);
      changeFilterValue(filterSet._id, "categories", categoriesArray);
    }
  );

  const { data: availableFilters } = useQuery<any, Error>(
    ["surveyAvailableFilters", apiUrl],
    async () => {
      const { data } = await axios.get<FiltersSet>(`/survey-filters/${apiUrl}`);
      return data;
    }
  );

  const saveButton = (filterSet: FiltersSet) => {
    if (!isPublic) {
      handleSave(filterSet._id, index);
    }
    changeFilterValue(filterSet._id, "showModal", !filterSet.showModal);
  };

  return (
    <ModalWrapper
      modalVisible={filterSet.showModal}
      setModalVisible={() => {
        changeFilterValue(filterSet._id, "showModal", !filterSet.showModal);
      }}
      className="filterset-modal"
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
          <ModalConfirmTrigger
            modalMessage={`Are you sure you want to delete ${filterSet.name}?`}
            onConfirm={() => {
              handleDelete(filterSet, index);
            }}
            renderTrigger={(setModalVisible) => (
              <Button
                className="filters__button filters__delete"
                onClick={() => setModalVisible(true)}
              >
                DELETE
              </Button>
            )}
          />
          <Button
            onClick={() => {
              saveButton(filterSet);
            }}
            className="filters__button"
          >
            SAVE
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ResultsFilters;
