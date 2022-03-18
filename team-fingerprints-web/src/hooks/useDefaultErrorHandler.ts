import { useNotifications } from "@mantine/notifications";

const useDefaultErrorHandler = () => {
  const { showNotification } = useNotifications();

  const onErrorWithTitle = (title: string) => (error: any) => {
    showNotification({
      color: "red",
      title,
      message: error?.response?.data?.message,
    });
  };

  return { onErrorWithTitle };
};

export default useDefaultErrorHandler;
