"use server";

const getQuotaByRole = (role: string): number => {
  switch (role) {
    case "premium":
    case "admin":
      return 2;
    case "superadmin":
      return 999;
    default:
      return 1;
  }
};

export default getQuotaByRole;
