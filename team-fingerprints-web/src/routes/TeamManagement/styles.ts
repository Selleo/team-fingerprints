import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  addButton: {
    flex: 0,
    margin: "20px",
  },
  emptyCopy: {
    width: "100%",
    padding: "40px",
    fontWeight: "800",
    textAlign: "center",
  },
  header: {
    display: "flex",
  },
  headerTitle: {
    flex: 1,
  },
  teamButton: {
    marginBottom: "10px",
    marginRight: "10px",
  },
  teamShape: {
    marginLeft: "20px",
  },
}));
