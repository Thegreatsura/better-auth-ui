import type { ComponentType } from "react"
import { AuthDemo as HeroUIAuthDemo } from "./heroui/auth/auth"
import { ForgotPasswordDemo as HeroUIForgotPasswordDemo } from "./heroui/auth/forgot-password"
import { ResetPasswordDemo as HeroUIResetPasswordDemo } from "./heroui/auth/reset-password"
import { SignInDemo as HeroUISignInDemo } from "./heroui/auth/sign-in"
import { SignOutDemo as HeroUISignOutDemo } from "./heroui/auth/sign-out"
import { SignUpDemo as HeroUISignUpDemo } from "./heroui/auth/sign-up"
import { EmailChangedEmailDemo as HeroUIEmailChangedEmailDemo } from "./heroui/email/email-changed-email"
import { EmailVerificationEmailDemo as HeroUIEmailVerificationEmailDemo } from "./heroui/email/email-verification-email"
import { MagicLinkEmailDemo as HeroUIMagicLinkEmailDemo } from "./heroui/email/magic-link-email"
import { NewDeviceEmailDemo as HeroUINewDeviceEmailDemo } from "./heroui/email/new-device-email"
import { OtpEmailDemo as HeroUIOtpEmailDemo } from "./heroui/email/otp-email"
import { PasswordChangedEmailDemo as HeroUIPasswordChangedEmailDemo } from "./heroui/email/password-changed-email"
import { ResetPasswordEmailDemo as HeroUIResetPasswordEmailDemo } from "./heroui/email/reset-password-email"
import { MagicLinkDemo as HeroUIMagicLinkDemo } from "./heroui/magic-link/magic-link"
import { ManageAccountsDemo as HeroUIManageAccountsDemo } from "./heroui/multi-session/manage-accounts"
import { SwitchAccountSubmenuDemo as HeroUISwitchAccountSubmenuDemo } from "./heroui/multi-session/switch-account-submenu"
import { PasskeySignInDemo as HeroUIPasskeySignInDemo } from "./heroui/passkey/passkey-sign-in"
import { AccountSettingsDemo as HeroUIAccountSettingsDemo } from "./heroui/settings/account/account-settings"
import { ChangeEmailDemo as HeroUIChangeEmailDemo } from "./heroui/settings/account/change-email"
import { UserProfileDemo as HeroUIUserProfileDemo } from "./heroui/settings/account/user-profile"
import { ActiveSessionsDemo as HeroUIActiveSessionsDemo } from "./heroui/settings/security/active-sessions"
import { ChangePasswordDemo as HeroUIChangePasswordDemo } from "./heroui/settings/security/change-password"
import { DangerZoneDemo as HeroUIDangerZoneDemo } from "./heroui/settings/security/danger-zone"
import { LinkedAccountsDemo as HeroUILinkedAccountsDemo } from "./heroui/settings/security/linked-accounts"
import { PasskeysDemo as HeroUIPasskeysDemo } from "./heroui/settings/security/passkeys"
import { SecuritySettingsDemo as HeroUISecuritySettingsDemo } from "./heroui/settings/security/security-settings"
import { SettingsDemo as HeroUISettingsDemo } from "./heroui/settings/settings"
import { AppearanceDemo as HeroUIAppearanceDemo } from "./heroui/theme/appearance"
import { ThemeToggleItemDemo as HeroUIThemeToggleItemDemo } from "./heroui/theme/theme-toggle-item"
import { UserAvatarDemo as HeroUIUserAvatarDemo } from "./heroui/user/user-avatar"
import { UserButtonDemo as HeroUIUserButtonDemo } from "./heroui/user/user-button"
import { UserButtonIconDemo as HeroUIUserButtonIconDemo } from "./heroui/user/user-button-icon"
import { UserViewDemo as HeroUIUserViewDemo } from "./heroui/user/user-view"
import { AuthDemo as ShadcnAuthDemo } from "./shadcn/auth/auth"
import { ForgotPasswordDemo as ShadcnForgotPasswordDemo } from "./shadcn/auth/forgot-password"
import { ResetPasswordDemo as ShadcnResetPasswordDemo } from "./shadcn/auth/reset-password"
import { SignInDemo as ShadcnSignInDemo } from "./shadcn/auth/sign-in"
import { SignOutDemo as ShadcnSignOutDemo } from "./shadcn/auth/sign-out"
import { SignUpDemo as ShadcnSignUpDemo } from "./shadcn/auth/sign-up"
import { EmailChangedEmailDemo as ShadcnEmailChangedEmailDemo } from "./shadcn/email/email-changed-email"
import { EmailVerificationEmailDemo as ShadcnEmailVerificationEmailDemo } from "./shadcn/email/email-verification-email"
import { MagicLinkEmailDemo as ShadcnMagicLinkEmailDemo } from "./shadcn/email/magic-link-email"
import { NewDeviceEmailDemo as ShadcnNewDeviceEmailDemo } from "./shadcn/email/new-device-email"
import { OtpEmailDemo as ShadcnOtpEmailDemo } from "./shadcn/email/otp-email"
import { PasswordChangedEmailDemo as ShadcnPasswordChangedEmailDemo } from "./shadcn/email/password-changed-email"
import { ResetPasswordEmailDemo as ShadcnResetPasswordEmailDemo } from "./shadcn/email/reset-password-email"
import { MagicLinkDemo as ShadcnMagicLinkDemo } from "./shadcn/magic-link/magic-link"
import { ManageAccountsDemo as ShadcnManageAccountsDemo } from "./shadcn/multi-session/manage-accounts"
import { SwitchAccountSubmenuDemo as ShadcnSwitchAccountSubmenuDemo } from "./shadcn/multi-session/switch-account-submenu"
import { PasskeySignInDemo as ShadcnPasskeySignInDemo } from "./shadcn/passkey/passkey-sign-in"
import { AccountSettingsDemo as ShadcnAccountSettingsDemo } from "./shadcn/settings/account/account-settings"
import { ChangeEmailDemo as ShadcnChangeEmailDemo } from "./shadcn/settings/account/change-email"
import { UserProfileDemo as ShadcnUserProfileDemo } from "./shadcn/settings/account/user-profile"
import { ActiveSessionsDemo as ShadcnActiveSessionsDemo } from "./shadcn/settings/security/active-sessions"
import { ChangePasswordDemo as ShadcnChangePasswordDemo } from "./shadcn/settings/security/change-password"
import { DangerZoneDemo as ShadcnDangerZoneDemo } from "./shadcn/settings/security/danger-zone"
import { LinkedAccountsDemo as ShadcnLinkedAccountsDemo } from "./shadcn/settings/security/linked-accounts"
import { PasskeysDemo as ShadcnPasskeysDemo } from "./shadcn/settings/security/passkeys"
import { SecuritySettingsDemo as ShadcnSecuritySettingsDemo } from "./shadcn/settings/security/security-settings"
import { SettingsDemo as ShadcnSettingsDemo } from "./shadcn/settings/settings"
import { AppearanceDemo as ShadcnAppearanceDemo } from "./shadcn/theme/appearance"
import { ThemeToggleItemDemo as ShadcnThemeToggleItemDemo } from "./shadcn/theme/theme-toggle-item"
import { UserAvatarDemo as ShadcnUserAvatarDemo } from "./shadcn/user/user-avatar"
import { UserButtonDemo as ShadcnUserButtonDemo } from "./shadcn/user/user-button"
import { UserButtonIconDemo as ShadcnUserButtonIconDemo } from "./shadcn/user/user-button-icon"
import { UserViewDemo as ShadcnUserViewDemo } from "./shadcn/user/user-view"

export interface DemoItem {
  component: ComponentType
}

export const demos: Record<string, ComponentType> = {
  "heroui-account-settings": HeroUIAccountSettingsDemo,
  "heroui-active-sessions": HeroUIActiveSessionsDemo,
  "heroui-theme-appearance": HeroUIAppearanceDemo,
  "heroui-auth": HeroUIAuthDemo,
  "heroui-change-email": HeroUIChangeEmailDemo,
  "heroui-change-password": HeroUIChangePasswordDemo,
  "heroui-danger-zone": HeroUIDangerZoneDemo,
  "heroui-email-changed-email": HeroUIEmailChangedEmailDemo,
  "heroui-email-verification-email": HeroUIEmailVerificationEmailDemo,
  "heroui-forgot-password": HeroUIForgotPasswordDemo,
  "heroui-linked-accounts": HeroUILinkedAccountsDemo,
  "heroui-magic-link": HeroUIMagicLinkDemo,
  "heroui-magic-link-email": HeroUIMagicLinkEmailDemo,
  "heroui-manage-accounts": HeroUIManageAccountsDemo,
  "heroui-new-device-email": HeroUINewDeviceEmailDemo,
  "heroui-otp-email": HeroUIOtpEmailDemo,
  "heroui-passkey-sign-in": HeroUIPasskeySignInDemo,
  "heroui-passkeys": HeroUIPasskeysDemo,
  "heroui-password-changed-email": HeroUIPasswordChangedEmailDemo,
  "heroui-reset-password": HeroUIResetPasswordDemo,
  "heroui-reset-password-email": HeroUIResetPasswordEmailDemo,
  "heroui-security-settings": HeroUISecuritySettingsDemo,
  "heroui-settings": HeroUISettingsDemo,
  "heroui-sign-in": HeroUISignInDemo,
  "heroui-sign-out": HeroUISignOutDemo,
  "heroui-sign-up": HeroUISignUpDemo,
  "heroui-switch-account-submenu": HeroUISwitchAccountSubmenuDemo,
  "heroui-user-avatar": HeroUIUserAvatarDemo,
  "heroui-user-button": HeroUIUserButtonDemo,
  "heroui-user-button-icon": HeroUIUserButtonIconDemo,
  "heroui-user-profile": HeroUIUserProfileDemo,
  "heroui-theme-toggle-item": HeroUIThemeToggleItemDemo,
  "heroui-user-view": HeroUIUserViewDemo,
  "shadcn-account-settings": ShadcnAccountSettingsDemo,
  "shadcn-active-sessions": ShadcnActiveSessionsDemo,
  "shadcn-appearance": ShadcnAppearanceDemo,
  "shadcn-auth": ShadcnAuthDemo,
  "shadcn-change-email": ShadcnChangeEmailDemo,
  "shadcn-change-password": ShadcnChangePasswordDemo,
  "shadcn-danger-zone": ShadcnDangerZoneDemo,
  "shadcn-email-changed-email": ShadcnEmailChangedEmailDemo,
  "shadcn-email-verification-email": ShadcnEmailVerificationEmailDemo,
  "shadcn-forgot-password": ShadcnForgotPasswordDemo,
  "shadcn-linked-accounts": ShadcnLinkedAccountsDemo,
  "shadcn-magic-link": ShadcnMagicLinkDemo,
  "shadcn-magic-link-email": ShadcnMagicLinkEmailDemo,
  "shadcn-manage-accounts": ShadcnManageAccountsDemo,
  "shadcn-new-device-email": ShadcnNewDeviceEmailDemo,
  "shadcn-otp-email": ShadcnOtpEmailDemo,
  "shadcn-passkey-sign-in": ShadcnPasskeySignInDemo,
  "shadcn-passkeys": ShadcnPasskeysDemo,
  "shadcn-password-changed-email": ShadcnPasswordChangedEmailDemo,
  "shadcn-reset-password": ShadcnResetPasswordDemo,
  "shadcn-reset-password-email": ShadcnResetPasswordEmailDemo,
  "shadcn-security-settings": ShadcnSecuritySettingsDemo,
  "shadcn-settings": ShadcnSettingsDemo,
  "shadcn-sign-in": ShadcnSignInDemo,
  "shadcn-sign-out": ShadcnSignOutDemo,
  "shadcn-sign-up": ShadcnSignUpDemo,
  "shadcn-switch-account-submenu": ShadcnSwitchAccountSubmenuDemo,
  "shadcn-user-avatar": ShadcnUserAvatarDemo,
  "shadcn-user-button": ShadcnUserButtonDemo,
  "shadcn-user-button-icon": ShadcnUserButtonIconDemo,
  "shadcn-user-profile": ShadcnUserProfileDemo,
  "shadcn-user-view": ShadcnUserViewDemo,
  "shadcn-theme-toggle-item": ShadcnThemeToggleItemDemo
}
