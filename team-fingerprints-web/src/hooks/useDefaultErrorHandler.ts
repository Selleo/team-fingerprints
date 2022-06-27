import { useNotifications } from "@mantine/notifications";
import { Axios, AxiosError } from "axios";

const useDefaultErrorHandler = () => {
  const { showNotification } = useNotifications();

  const onErrorWithTitle = (title: string) => (error: AxiosError) => {
    showNotification({
      color: "red",
      title,
      message: error?.response?.data?.message,
    });
  };

  return { onErrorWithTitle };
};

export default useDefaultErrorHandler;
