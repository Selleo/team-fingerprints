import { Button, Group, Modal, Skeleton } from "@mantine/core";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import times from "lodash/times";

import { useStyles } from "./styles";
import axios from "axios";
import { Company, CompanyRole, Team } from "../../../types/models";
import CompanyForm from "../../../components/Company/CompanyForm";
import EmailWhitelist from "../../../components/EmailWhitelist/EmailWhitelist";
import EmailForm from "../../../components/EmailForm";
import { queryClient } from "../../../App";
import { useNavigate, useParams } from "react-router-dom";
import TeamForm from "../../../components/Team/TeamForm/TeamForm";
import ColoredShape from "../../../components/ColoredShape";

type CompanyResponse = {
  company: Company;
  roles: CompanyRole[];
};

const CompaniesManagment = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { classes } = useStyles();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addTeamModalVisible, setTeamModalVisible] = useState(false);

  const [whitelistModalVisible, setWhitelistModalVisible] = useState(false);

  const companyId = params.id;

  const { isLoading, error, data } = useQuery<CompanyResponse>(
    `companies${companyId}`,
    async () => {
      const response = await axios.get<CompanyResponse>(
        `/companies/${companyId}`
      );
      return response.data;
    }
  );

  const company = data?.company;
  const companyFormInitialValues: any = {
    ...company,
    pointShape: company?.pointShape || "square",
    pointColor: company?.pointColor || "#ffffff",
  };
  const roles = data?.roles || ([] as CompanyRole[]);

  const addEmailToWhitelist = useMutation(
    (email: string) => {
      return axios.post<string>(`/companies/${companyId}/member`, { email });
    },
    {
      onSuccess: () => {
        setWhitelistModalVisible(false);
        queryClient.invalidateQueries(`companies${companyId}`);
      },
    }
  );

  const addNewTeam = useMutation(
    (team: Partial<Team>) => {
      return axios.post<Partial<Team>>(`/companies/${companyId}/teams`, team);
    },
    {
      onSuccess: () => {
        setTeamModalVisible(false);
        queryClient.invalidateQueries(`companies${companyId}`);
      },
    }
  );

  const removeRole = useMutation(
    (roleId: string) => {
      return axios.delete<string>(`/role/${roleId}/remove`);
    },
    {
      onSuccess: () => {
        setWhitelistModalVisible(false);
        queryClient.invalidateQueries(`companies${companyId}`);
      },
    }
  );

  if (isLoading)
    return (
      <>
        {times(1, () => (
          <Skeleton height={40} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error) {
    return <div>'An error has occurred: ' + console.error;</div>;
  }

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>
          Company Managment
          <ColoredShape
            className={classes.companyShape}
            color={company?.pointColor}
            shape={company?.pointShape}
          />
        </h1>

        <Button
          onClick={() => setEditModalVisible(true)}
          className={classes.addButton}
        >
          Edit company
        </Button>
      </div>
      <h2>
        {company?.name} - {company?.domain}
      </h2>
      <h3>{company?.description}</h3>
      <EmailWhitelist
        onRemove={removeRole.mutate}
        roles={roles}
        teams={company?.teams}
      />
      <hr />
      <Button onClick={() => setWhitelistModalVisible(true)}>
        Add email to whitelist
      </Button>

      <Group>
        <h2> Teams </h2>
        <Button onClick={() => setTeamModalVisible(true)}>
          Create new team
        </Button>
      </Group>
      {company?.teams.map((team) => (
        <Button
          onClick={() => navigate(`team/${team._id}`)}
          color="yellow"
          className={classes.teamButton}
        >
          {team.name}
        </Button>
      ))}

      <Modal
        opened={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Create Company"
      >
        <CompanyForm
          initialValues={companyFormInitialValues}
          onClose={() => setEditModalVisible(false)}
        />
      </Modal>

      <Modal
        opened={whitelistModalVisible}
        onClose={() => setWhitelistModalVisible(false)}
        title="Add email to whitelist"
      >
        <EmailForm
          onSubmit={(val) => val.email && addEmailToWhitelist.mutate(val.email)}
        />
      </Modal>

      <Modal
        opened={addTeamModalVisible}
        onClose={() => setTeamModalVisible(false)}
        title="Add new team"
      >
        <TeamForm onSubmit={(values) => addNewTeam.mutate(values)} />
      </Modal>
    </>
  );
};

export default CompaniesManagment;
