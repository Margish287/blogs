export const getMembershipId = (planType) => {
  switch (planType) {
    case "professional":
      return 1;
    case "agency":
      return 2;
    default:
      return null;
  }
};
