import { UserData } from "@/types";

const emailValidation = (defaultEmail: string) => {

  const isEmailDuplicate = (email: string, users: UserData[]) => {
    return users.some(
      (user) => user.email === email && user.email !== defaultEmail
    );
  };

  return { isEmailDuplicate };
};

const readFileAsBase64 = (
  file: File,
  onSuccess: (base64: string) => void
) => {
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onloadend = () => {
    onSuccess(reader.result as string);
  };
};

export {
  emailValidation,
  readFileAsBase64
};
