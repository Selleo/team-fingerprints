import { Company } from "types/models";

const CompanyItem = ({ item }: { item: Company }) => {
  return (
    <>
      <tr key={item._id}>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{item.domain}</td>
      </tr>
    </>
  );
};

export default CompanyItem;
