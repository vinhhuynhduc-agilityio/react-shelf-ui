const formatBorrowedDate = (date = new Date()) =>
  date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .replace("am", "AM")
    .replace("pm", "PM");

export { formatBorrowedDate };
