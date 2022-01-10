import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  flex1: {
    flex: 1,
  },
  flex0: {
    flex: 0,
  },
  loginButton: {
    flex: 0,
    marginRight: "10px",
    marginLeft: "10px",
    display: "flex",
    flexDirection: "row",
  },
  flexWrapper: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
}));
