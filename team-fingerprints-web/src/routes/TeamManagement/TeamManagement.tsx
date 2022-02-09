import { Button, Group, Modal, Skeleton } from "@mantine/core";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import times from "lodash/times";

import { useStyles } from "./styles";
import axios from "axios";
import { Team, User } from "../../types/models";
import EmailWhitelist from "./EmailWhitelist";
import EmailForm from "../../components/EmailForm";
import { queryClient } from "../../App";
import { useParams } from "react-router-dom";
import TeamForm from "../../components/Team/TeamForm/TeamForm";
import { useNotifications } from "@mantine/notifications";

const TeamManagment = () => {
  const { showNotification } = useNotifications();
  const params = useParams();
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
      onError: (error: any) => {
        showNotification({
          color: "red",
          title: "Can not add user to whitelist",
          message: error?.response?.data?.message,
        });
      },
    }
  );

  const editTeamMuatation = useMutation(
    (team: Partial<Team>) => {
      return axios.patch<string>(`/companies/${companyId}/teams/${teamId}`, {
        name: team.name,
        description: team.description,
      });
    },
    {
      onSuccess: () => {
        setEditModalVisible(false);
        queryClient.invalidateQueries(`team${teamId}`);
      },
      onError: (error: any) => {
        showNotification({
          color: "red",
          title: "Can not update company",
          message: error?.response?.data?.message,
        });
      },
    }
  );

  const deleteTeamMuatation = useMutation(
    () => axios.delete<string>(`/companies/${companyId}/teams/${teamId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`team${teamId}`);
      },
      onError: (error: any) => {
        showNotification({
          color: "red",
          title: "Can not remove company",
          message: error?.response?.data?.message,
        });
      },
    }
  );

  const makeALeader = useMutation(
    (email: string) => {
      return axios.post<string>(
        `/companies/${companyId}/teams/${teamId}/leader`,
        { email }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`team${teamId}`);
      },
      onError: (error: any) => {
        showNotification({
          color: "red",
          title: "Can not setup a leader",
          message: error?.response?.data?.message,
        });
      },
    }
  );

  const removeLeaderRole = useMutation(
    (email: string) => {
      return axios.delete<string>(
        `/companies/${companyId}/teams/${teamId}/leader`,
        { data: { email } }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`team${teamId}`);
      },
      onError: (error: any) => {
        console.log(error?.response);
        showNotification({
          color: "red",
          title: "Can not remove leadership",
          message: error?.response?.data?.message,
        });
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

  if (isLoading || isLoadingUsers)
    return (
      <>
        {times(1, () => (
          <Skeleton height={40} mt={6} radius="xl" />
        ))}
      </>
    );
  if (error || isErrorUsers)
    return <div>'An error has occurred: ' + console.error;</div>;

  return (
    <>
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>Team Managment</h1>

        <Group>
          <Button
            onClick={() => setEditModalVisible(true)}
            className={classes.addButton}
          >
            Edit team
          </Button>
          <Button
            color="red"
            onClick={() => deleteTeamMuatation.mutate()}
            className={classes.addButton}
          >
            Remove team
          </Button>
        </Group>
      </div>
      <h2>Team Name: {team?.name}</h2>
      <h3>Team Description: {team?.description}</h3>
      <EmailWhitelist
        removeLeaderRole={removeLeaderRole.mutate}
        onRemove={removeEmailFromWhitelist.mutate}
        list={team?.emailWhitelist}
        users={users}
        teamLeader={team?.teamLeader}
        makeALeader={makeALeader.mutate}
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
