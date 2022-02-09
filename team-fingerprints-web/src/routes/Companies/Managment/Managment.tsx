import { Button, Group, Modal, Skeleton } from "@mantine/core";
import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import times from "lodash/times";

import { useStyles } from "./styles";
import axios from "axios";
import { Company, Team, User } from "../../../types/models";
import CompanyForm from "../../../components/Company/CompanyForm";
import EmailWhitelist from "../../../components/EmailWhitelist/EmailWhitelist";
import EmailForm from "../../../components/EmailForm";
import { queryClient } from "../../../App";
import { useNavigate, useParams } from "react-router-dom";
import TeamForm from "../../../components/Team/TeamForm/TeamForm";

const CompaniesManagment = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { classes } = useStyles();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addTeamModalVisible, setTeamModalVisible] = useState(false);

  const [whitelistModalVisible, setWhitelistModalVisible] = useState(false);

  const companyId = params.id;

  const {
    isLoading,
    error,
    data: company,
  } = useQuery<Company>(`companies${companyId}`, async () => {
    const response = await axios.get<Company>(`/companies/${companyId}`);
    return response.data;
  });

  const {
    isLoading: isLoadingUsers,
    error: isErrorUsers,
    data: users,
  } = useQuery<User[]>(`users${companyId}`, async () => {
    const response = await axios.get<User[]>(`/users/all`);
    return response.data;
  });

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

  const removeEmailFromWhitelist = useMutation(
    (email: string) => {
      return axios.delete<string>(`/companies/${companyId}/member`, {
        data: { email },
      });
    },
    {
      onSuccess: () => {
        setWhitelistModalVisible(false);
        queryClient.invalidateQueries(`companies${companyId}`);
      },
    }
  );

  if (isLoading || isLoadingUsers)
    return (
      <>
        {times(1, () => (
          <Skeleton height={40} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error || isErrorUsers) {
    console.warn(error || isErrorUsers);
    return <div>'An error has occurred: ' + console.error;</div>;
  }

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>Company Managment</h1>

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
        onRemove={removeEmailFromWhitelist.mutate}
        list={company?.emailWhitelist}
        users={users}
        // currentUserId={profile}
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
          initialValues={company}
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
