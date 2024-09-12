import { User } from '../../users/entities/user.entity';
import { SystemService } from '../../system/system.service';

/**
 * Adds computed fields to a user object.
 *
 * @param {User} user - The user object to be modified.
 * @param {SystemService} systemService - The system service instance.
 * @return {User} The modified user object with added computed fields.
 */
export async function addComputeFieldsToUser(
  user: User,
  systemService: SystemService,
) {
  const { rolesOverride, kubeConfig, email } = user;
  const [adminUserList, superUserList] = await Promise.all([
    systemService.getAdminUserList(),
    systemService.getSuperUserList(),
  ]);

  const hasRolesOverride = !!rolesOverride?.length;
  const hasKubeConfig = !!kubeConfig;

  const isSuperuser = superUserList?.includes(email ?? '');
  const isAdmin = adminUserList?.includes(email ?? '');

  return {
    ...user,
    hasRolesOverride,
    hasKubeConfig,
    isAdmin,
    isSuperuser,
  };
}
