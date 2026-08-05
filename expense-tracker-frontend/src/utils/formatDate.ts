export function formatDate(
  dateString: string
) {
  return new Date(
    dateString
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}