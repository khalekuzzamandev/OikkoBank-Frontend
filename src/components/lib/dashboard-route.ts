const dashboardRoles = new Set(["admin", "staff", "customer"]);

export const getDashboardHref = (role?: string | null): string => {
  const normalizedRole = role?.trim().toLowerCase();

  return normalizedRole && dashboardRoles.has(normalizedRole)
    ? `/dashboard/${normalizedRole}`
    : "/dashboard";
};
