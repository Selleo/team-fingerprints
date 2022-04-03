import { Modal } from "@mantine/core";
import axios from "axios";
import { groupBy, isEmpty, keys, map } from "lodash";
import { useContext, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import CompanyForm from "../../components/Company/CompanyForm";
import useDefaultErrorHandler from "../../hooks/useDefaultErrorHandler";
import { ProfileContext } from "../../routes";
import { ComplexRole } from "../../types/models";

import "./styles.sass";

export const RoleManagment = () => {
  const { profile, invalidateProfile } = useContext(ProfileContext);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const emptyRoles = useMemo(() => isEmpty(profile?.privileges), [profile]);
  const navigate = useNavigate();
  const { onErrorWithTitle } = useDefaultErrorHandler();

  const removeRoleMutation = useMutation(
    async (roleId: string) => {
      return axios.delete(`/role/${roleId}/leave`);
    },
    {
      onSuccess: () => invalidateProfile(),
      onError: onErrorWithTitle("Can not remove role"),
    }
  );

  const leaveRole = (item: any) => {
    removeRoleMutation.mutate(item.roleId);
  };

  const goToManage = (item: ComplexRole) => {
    switch (item.role) {
      case "SUPER_ADMIN":
        navigate("/admin/surveys");
        break;
      case "COMPANY_ADMIN":
        navigate(`/companies/${item.company?._id}`);
        break;
      case "TEAM_LEADER":
        navigate(`/companies/${item.company?._id}/team/${item.team?._id}`);
        break;
      default:
        break;
    }
  };

  const content = useMemo(() => {
    if (emptyRoles) {
      return (
        <span>
          You don't have any associated companies, you can create your own or
          ask any other user to invite you
        </span>
      );
    }

    const grouped = groupBy(profile?.privileges, "company._id");
    return map(keys(grouped), (companyId) => {
      const company = grouped[companyId][0]?.company;

      return (
        <div className="managment__company">
          <span className="managment__company__name">
            Company: {company?.name || "SUPER ADMIN RIGHTs"}
          </span>
          <ul className="managment__roles">
            {grouped[companyId].map(
              (item) =>
                item && (
                  <li className="managment__roles__role">
                    <span className="managment__roles__role__icon">
                      {item.team
                        ? `${item.role} OF TEAM ${item.team.name}`
                        : item.role}
                    </span>
                    <div>
                      {item.role !== "USER" && (
                        <a
                          onClick={() => goToManage(item)}
                          className="managment__roles__role__manage"
                        >
                          Manage
                        </a>
                      )}
                      <a
                        onClick={() => leaveRole(item)}
                        className="managment__roles__role__leave"
                      >
                        Leave
                      </a>
                    </div>
                  </li>
                )
            )}
          </ul>
        </div>
      );
    });
  }, [emptyRoles, goToManage, leaveRole, profile?.privileges]);

  return (
    <>
      <div className="managment">
        <a
          onClick={() => setCreateModalVisible(true)}
          className="managment__company-button"
        >
          Create company
        </a>
        <h1 className="managment__headline">Your companies and roles</h1>
        {content}
      </div>
      <Modal
        opened={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title="Create Company"
      >
        <CompanyForm onClose={() => setCreateModalVisible(false)} />
      </Modal>
    </>
  );
};

export default RoleManagment;
