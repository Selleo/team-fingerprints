import axios from "axios";
import times from "lodash/times";

import { useState } from "react";
import { Button, Group, Modal, Skeleton } from "@mantine/core";
import { useMutation, useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";

import EmailWhitelist from "./EmailWhitelist";
import EmailForm from "components/EmailForm";
import TeamForm from "components/Team/TeamForm/TeamForm";
import useDefaultErrorHandler from "hooks/useDefaultErrorHandler";
import ErrorLoading from "components/ErrorLoading";
import ColoredShape from "components/ColoredShape";
import BackToScreen from "components/BackToScreen";

import { CompanyRole, Team } from "types/models";
import { queryClient } from "App";
import { useStyles } from "./styles";

type TeamResponse = {
  team: Team;
  roles: CompanyRole[];
};

const TeamManagment = () => {
  const navigation = useNavigate();
  const { onErrorWithTitle } = useDefaultErrorHandler();
  const params = useParams();
  const { classes } = useStyles();
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [whitelistModalVisible, setWhitelistModalVisible] = useState(false);

  const companyId = params.companyId;
  const teamId = params.teamId;

  const { isLoading, error, data } = useQuery<TeamResponse>(
    `team${teamId}`,
    async () => {
      const response = await axios.get<TeamResponse>(
        `/companies/${companyId}/teams/${teamId}`
      );
      return response.data;
    }
  );

  const team = data?.team;
  const roles = data?.roles || ([] as CompanyRole[]);

  const addEmailToWhitelist = useMutation(
    (emails: string[]) => {
      return axios.post<string>(
        `/companies/${companyId}/teams/${teamId}/member`,
        { emails }
      );
    },
    {
      onSuccess: () => {
        setWhitelistModalVisible(false);
        queryClient.invalidateQueries(`team${teamId}`);
      },
      onError: onErrorWithTitle("Can not add user to whitelist"),
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
      onError: onErrorWithTitle("Can not update company"),
    }
  );

  const deleteTeamMuatation = useMutation(
    () => axios.delete<string>(`/companies/${companyId}/teams/${teamId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`team${teamId}`);
        navigation(-1);
      },
      onError: onErrorWithTitle("Can not remove company"),
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
      onError: onErrorWithTitle("Can not setup a leader"),
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
      onError: onErrorWithTitle("Can not remove leadership"),
    }
  );

  const removeRole = useMutation(
    (roleId: string) => {
      return axios.delete<string>(`/role/${roleId}/remove`);
    },
    {
      onSuccess: () => {
        setWhitelistModalVisible(false);
        queryClient.invalidateQueries(`team${teamId}`);
      },
      onError: onErrorWithTitle("Can not remove role"),
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
  if (error) return <ErrorLoading title="Can't load team info and roles" />;

  return (
    <>
      <BackToScreen name="Company Management" />
      <div className={classes.header}>
        <h1 className={classes.headerTitle}>
          Team Managment
          <ColoredShape
            className={classes.teamShape}
            color={team?.pointColor}
            shape={team?.pointShape}
          />
        </h1>

        <Group>
          <Button
            onClick={() => navigation(`surveys`)}
            className={classes.addButton}
            color="green"
          >
            Show Results
          </Button>
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
        onRemove={removeRole.mutate}
        roles={roles}
        makeALeader={makeALeader.mutate}
      />
      <hr />
      <Button onClick={() => setWhitelistModalVisible(true)}>
        Add email to whitelist
      </Button>

      <Modal
        opened={whitelistModalVisible}
        onClose={() => setWhitelistModalVisible(false)}
        title="Add emails to whitelist"
      >
        <EmailForm
          onSubmit={(val) =>
            val.emails && addEmailToWhitelist.mutate(val.emails)
          }
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
