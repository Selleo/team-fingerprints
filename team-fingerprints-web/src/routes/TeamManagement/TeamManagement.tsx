import { Button, Group, Modal, Skeleton } from "@mantine/core";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import times from "lodash/times";

import { useStyles } from "./styles";
import axios from "axios";
import { Company, Team } from "../../types/models";
import EmailWhitelist from "../../components/EmailWhitelist/EmailWhitelist";
import EmailForm from "../../components/EmailForm";
import { queryClient } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import TeamForm from "../../components/Team/TeamForm/TeamForm";

const TeamManagment = () => {
  const params = useParams();
  console.log(params);
  const { classes } = useStyles();
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [whitelistModalVisible, setWhitelistModalVisible] = useState(false);

  const companyId = params.id;
  const teamId = params.teamId;

  const {
    isLoading,
    error,
    data: team,
  } = useQuery<Team>(`team${teamId}`, async () => {
    const response = await axios.get<Team>(
      `/companies/${companyId}/teams/${teamId}`
    );
    return response.data;
  });

  const addEmailToWhitelist = useMutation(
    (email: string) => {
      return axios.post<string>(
        `/companies/${companyId}/teams/${teamId}/member`,
        { email }
      );
    },
    {
      onSuccess: () => {
        setWhitelistModalVisible(false);
        queryClient.invalidateQueries(`team${teamId}`);
      },
    }
  );

  const editTeamMuatation = useMutation(
    (team: Partial<Team>) => {
      return axios.patch<string>(
        `/companies/${companyId}/teams/${teamId}`,
        team
      );
    },
    {
      onSuccess: () => {
        setEditModalVisible(false);
        queryClient.invalidateQueries(`team${teamId}`);
      },
    }
  );

  const removeEmailFromWhitelist = useMutation(
    (email: string) => {
      return axios.delete<string>(
        `/companies/${companyId}/teams/${teamId}/member`,
        {
          data: { email },
        }
      );
    },
    {
      onSuccess: () => {
        setWhitelistModalVisible(false);
        queryClient.invalidateQueries(`team${teamId}`);
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
  if (error) return <div>'An error has occurred: ' + console.error;</div>;

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>Team Managment</h1>

        <Button
          onClick={() => setEditModalVisible(true)}
          className={classes.addButton}
        >
          Edit team
        </Button>
      </div>
      <h2>Team Name: {team?.name}</h2>
      <h3>Team Description: {team?.description}</h3>
      <EmailWhitelist
        onRemove={removeEmailFromWhitelist.mutate}
        list={team?.emailWhitelist}
      />
      <hr />
      <Button onClick={() => setWhitelistModalVisible(true)}>
        Add email to whitelist
      </Button>

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
        opened={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Edit team"
      >
        <TeamForm
          initialValues={team}
          onSubmit={(values) => editTeamMuatation.mutate(values)}
        />
      </Modal>
    </>
  );
};

export default TeamManagment;
