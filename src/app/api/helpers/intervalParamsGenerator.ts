export default function intervalParamsGenerator(
  interval: "month" | "week" | "day"
) {
  let params;
  switch (interval) {
    case "week":
      params = {
        primary: {
          $week: "$createdAt",
        },
        secondary: {
          $year: "$createdAt",
        },
      };
      break;
    case "day":
      params = {
        primary: {
          $dayOfMonth: "$createdAt",
        },
        secondary: {
          $month: "$createdAt",
        },
        tertiary: {
          $year: "$createdAt",
        },
      };
      break;
    default:
      params = {
        primary: {
          $month: "$createdAt",
        },
        secondary: {
          $year: "$createdAt",
        },
      };
  }

  return params;
}
