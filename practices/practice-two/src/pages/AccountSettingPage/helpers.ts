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

export { readFileAsBase64 };
