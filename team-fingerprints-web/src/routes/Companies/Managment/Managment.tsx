import axios from "axios";
import times from "lodash/times";

import { Button, Group, Modal, Skeleton } from "@mantine/core";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Company, CompanyRole, Team, CompanyResponse } from "types/models";
import { useNavigate, useParams } from "react-router-dom";

import BackToScreen from "components/BackToScreen";
import CompanyForm from "components/Company/CompanyForm";
import EmailWhitelist from "components/EmailWhitelist/EmailWhitelist";
import EmailForm from "components/EmailForm";
import TeamForm from "components/Team/TeamForm/TeamForm";
import ColoredShape from "components/ColoredShape";
import useDefaultErrorHandler from "hooks/useDefaultErrorHandler";
import ErrorLoading from "components/ErrorLoading";

import { queryClient } from "App";

import "./styles.sass";

const CompaniesManagment = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addTeamModalVisible, setTeamModalVisible] = useState(false);
  const { onErrorWithTitle } = useDefaultErrorHandler();

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
  const companyFormInitialValues: Partial<Company> = {
    ...company,
    pointShape: company?.pointShape || "square",
    pointColor: company?.pointColor || "#ffffff",
  };
  const roles = data?.roles || ([] as CompanyRole[]);

  const addEmailToWhitelist = useMutation(
    (emails: string[]) => {
      return axios.post<string>(`/companies/${companyId}/member`, {
        emails,
      });
    },
    {
      onSuccess: () => {
        setWhitelistModalVisible(false);
        queryClient.invalidateQueries(`companies${companyId}`);
      },
      onError: onErrorWithTitle("Can not add member"),
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
      onError: onErrorWithTitle("Can not add new team"),
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
  if (error) {
    return <ErrorLoading title="Can't load company data" />;
  }

  return (
    <div className="company-panel">
      <BackToScreen name="your companies and roles" />
      <div className="company-panel__header">
        <h1 className="company-panel__title">
          Company Managment - {company?.name}
          <ColoredShape
            className="company-panel__company-shape"
            color={company?.pointColor}
            shape={company?.pointShape}
          />
        </h1>
        <Button
          onClick={() => {
            navigate(`surveys`);
          }}
          className="company-panel__add-button"
          color="green"
        >
          Show Results
        </Button>
        <Button
          onClick={() => setEditModalVisible(true)}
          className="company-panel__add-button"
        >
          Edit company
        </Button>
      </div>
      <h3 className="company-panel__description">
        <span className="company-panel__description-header">Description: </span>
        {company?.description}
      </h3>
      {company?.domain && (
        <h3 className="company-panel__domain">
          <span className="company-panel__domain-header">Domain:</span>{" "}
          {company?.domain}
        </h3>
      )}
      <EmailWhitelist
        onRemove={removeRole.mutate}
        roles={roles}
        teams={company?.teams}
      />
      <Button
        className="company-panel__add-user-button"
        onClick={() => setWhitelistModalVisible(true)}
      >
        Add user by email
      </Button>

      <Group className="teams">
        <h2> Teams </h2>
        <Button onClick={() => setTeamModalVisible(true)}>
          Create new team
        </Button>
      </Group>
      {company?.teams?.map((team) => (
        <Button
          key={team._id}
          onClick={() => navigate(`team/${team._id}`)}
          color="yellow"
          className="company-panel__team-button"
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
        title="Add user to the company"
      >
        <EmailForm
          onSubmit={(val) =>
            val.emails && addEmailToWhitelist.mutate(val.emails)
          }
        />
      </Modal>

      <Modal
        opened={addTeamModalVisible}
        onClose={() => setTeamModalVisible(false)}
        title="Add new team"
      >
        <TeamForm onSubmit={(values) => addNewTeam.mutate(values)} />
      </Modal>
    </div>
  );
};

export default CompaniesManagment;
