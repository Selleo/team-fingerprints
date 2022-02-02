import { Button, Modal, Skeleton, Table } from "@mantine/core";
import React, { useState } from "react";
import { useQuery } from "react-query";
import times from "lodash/times";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";

import { useStyles } from "./styles";
import axios from "axios";
import { Company } from "../../types/models";
import CompanyItem from "../../components/Company/CompanyItem";

const Companies = () => {
  const { classes } = useStyles();

  const { isLoading, error, data } = useQuery<Company[]>(
    "companiesAll",
    async () => {
      const response = await axios.get<Company[]>("/companies");
      return response.data;
    }
  );

  if (isLoading)
    return (
      <>
        {times(5, () => (
          <Skeleton height={20} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error) return <div>'An error has occurred: ' + console.error;</div>;

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>
          Companies - only SUPERADMIN can see it!
        </h1>
      </div>
      <Table>
        <thead>
          <tr>
            <th>title</th>
            <th>description</th>
            <th>domain</th>
          </tr>
        </thead>
        {isArray(data) &&
          (isEmpty(data) ? (
            <span className={classes.emptyCopy}>No companies yet</span>
          ) : (
            <tbody>
              {data?.map((item) => (
                <CompanyItem item={item} />
              ))}
            </tbody>
          ))}
      </Table>
    </>
  );
};

export default Companies;
