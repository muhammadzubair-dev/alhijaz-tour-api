function hasMenuAccess(
  authUser: { menuIds: string[] },
  menuId: string,
): boolean {
  if (!authUser?.menuIds || !Array.isArray(authUser.menuIds)) {
    return false;
  }

  return authUser.menuIds.includes(menuId);
}

export default hasMenuAccess;
