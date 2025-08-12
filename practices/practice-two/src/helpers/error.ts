// constants
import { ERROR_MESSAGE } from "@/constants";

//stores
import { useToastStore } from "@/stores";

export const showDefaultErrorToast = () => {
  const { showToast } = useToastStore.getState();

  showToast(ERROR_MESSAGE.DEFAULT, "error");
};
// -> error
