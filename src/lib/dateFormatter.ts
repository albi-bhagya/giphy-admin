export default function format(
  primary: number,
  secondary: number,
  type: String
) {
  let response = "";
  const date = new Date();

  switch (type) {
    case "month":
      date.setMonth(primary - 1);
      date.setFullYear(secondary);
      break;
    case "week":
      response += secondary;
      break;
    case "day":
      date.setMonth(secondary - 1);
      response += `${primary < 10 ? "0" + primary : primary} `;
      break;
  }

  if (type === "month") {
    response += date.toLocaleString("en-in", {
      month: "short",
      year: "numeric",
    });
  } else if (type === "week") {
    response += `: Week ${primary}`;
  } else {
    response += date.toLocaleString("en-in", {
      month: "short",
    });
  }

  return response;
}
