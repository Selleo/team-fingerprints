import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { isEmpty, omitBy, values as lodashValues } from "lodash";
import { useFormik } from "formik";
import { Button, ColorPicker, Select, TextInput } from "@mantine/core";
import { Switch } from "components/Switch";

import ColoredShape from "components/ColoredShape";
import ModalWrapper from "components/Modals/ModalWrapper";

import FiltersSelect from "./FiltersSelect";
import {
  CategoryResults,
  FilterSelect,
  Shape,
  FiltersSet,
  ChangeFilterValue,
  ChangeFilterDataValue,
} from "types/models";
import ModalConfirmTrigger from "components/Modals/ModalConfirmTrigger";

type Props = {
  filterSet: FiltersSet;
  currentFiltersValues: { [key: string]: Array<string> };
  changeFilterValue: ChangeFilterValue;
  handleSave: (filterSetData: FiltersSet) => void;
  handleDelete: (filterSet: FiltersSet) => void;
  apiUrl?: string;
  handleVisible: (filterSet: FiltersSet) => void;
};

const ResultsFilters = ({
  currentFiltersValues,
  changeFilterValue,
  filterSet,
  handleSave,
  handleDelete,
  apiUrl,
  handleVisible,
}: Props) => {
  const [filterSetData, setFilterSetData] = useState<FiltersSet>(filterSet);
  const [showModal, setShowModal] = useState(false);

  const changeFilterDataValue: ChangeFilterDataValue = (
    valueName,
    newValue
  ) => {
    setFilterSetData((prevFilterSet: FiltersSet) => {
      return { ...prevFilterSet, [valueName]: newValue };
    });
  };

  const { handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: currentFiltersValues,
    onSubmit: (values) => {
      const valuesWithoutEmpties = omitBy(values, isEmpty);
      changeFilterDataValue("filters", valuesWithoutEmpties);
    },
  });

  useQuery(
    [`chartData-${filterSet._id}`, apiUrl, currentFiltersValues, showModal],
    async () => {
      const { data } = await axios.get<{ [key: string]: CategoryResults }>(
        `/survey-results/${apiUrl}`,
        {
          params: currentFiltersValues,
        }
      );
      const categoriesArray = lodashValues(data);
      changeFilterValue(filterSet?._id, "categories", categoriesArray);
    }
  );

  const saveButton = (filterSetData: FiltersSet) => {
    handleSave(filterSetData);
    setShowModal(false);
  };

  const { data: availableFilters } = useQuery<FilterSelect[], AxiosError>(
    ["surveyAvailableFilters", apiUrl],
    async () => {
      const { data } = await axios.get<FilterSelect[]>(
        `/survey-filters/${apiUrl}`
      );
      return data;
    }
  );

  return (
    <React.Fragment key={filterSet?._id}>
      <div className="filters__item">
        <div className="filters__icon">
          <ColoredShape
            shape={filterSet?.pointShape}
            color={filterSet?.pointColor}
          />
        </div>
        <span
          className="filters__name"
          onClick={() => {
            setShowModal(true);
          }}
        >
          {filterSet?.name}
        </span>
        <Switch
          value={!!filterSet.visible}
          setValue={() => handleVisible(filterSet)}
        />
      </div>
      <ModalWrapper
        modalVisible={showModal}
        setModalVisible={() => {
          setShowModal(!showModal);
        }}
        className="filterset-modal"
      >
        <div className="filters__selects">
          <div className="filters__config">
            <div className="filters__appearance">
              <div className="filters__title">Appearance</div>
              <TextInput
                classNames={{
                  root: "filters__name",
                  input: "filters__name-input",
                  label: "filters__name-label",
                }}
                label="Name"
                value={filterSetData.name}
                onChange={(e) => {
                  changeFilterDataValue("name", e.target.value);
                }}
              />
              <div className="filters__shape-wrapper">
                <Select
                  classNames={{
                    root: "filters__shape",
                    input: "filters__shape-input",
                    label: "filters__shape-label",
                  }}
                  placeholder="Pick one"
                  label="Shape"
                  value={filterSetData.pointShape}
                  data={[
                    { value: "triangle", label: "Triangle" },
                    { value: "square", label: "Square" },
                    { value: "circle", label: "Circle" },
                    { value: "trapeze", label: "Trapeze" },
                  ]}
                  onChange={(e: Shape) =>
                    changeFilterDataValue("pointShape", e)
                  }
                />
                <div className="filters__shape">
                  <ColoredShape
                    shape={filterSetData?.pointShape}
                    color={filterSetData?.pointColor}
                  />
                </div>
              </div>
              <div className="filters__color">
                <label className="filters__color-label">Color</label>
                <ColorPicker
                  className="filters__color-picker"
                  format="hex"
                  value={filterSetData.pointColor}
                  size="md"
                  onChange={(e) => {
                    changeFilterDataValue("pointColor", e);
                  }}
                />
              </div>
            </div>
            <div className="filters__data">
              <div className="filters__title">Data</div>
              {availableFilters?.map((filter: FilterSelect) => (
                <FiltersSelect
                  key={filter._id}
                  filter={filter}
                  handleSubmit={handleSubmit}
                  setFieldValue={setFieldValue}
                  filterSet={filterSetData}
                />
              ))}
            </div>
          </div>
          <div className="filters__footer">
            <ModalConfirmTrigger
              modalMessage={`Are you sure you want to delete ${filterSetData.name}?`}
              onConfirm={() => {
                handleDelete(filterSet);
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
                saveButton(filterSetData);
              }}
              className="filters__button"
            >
              SAVE
            </Button>
          </div>
        </div>
      </ModalWrapper>
    </React.Fragment>
  );
};

export default ResultsFilters;
