import { SubscriptionStatus } from '@prisma/client';

export interface AccessFields {
  subscriptionStatus: SubscriptionStatus;
  paidAt:             Date | null;
  stripeSessionId:    string | null;
  subscriptionId:     string | null;
}

/**
 * One-time (lifetime) purchase: completed Checkout in 'payment' mode (session id
 * stored), or a legacy payment with no subscription attached. Older code also
 * set paidAt when a subscription activated, so paidAt alone is not proof.
 */
export function hasLifetimeAccess(u: AccessFields): boolean {
  return !!u.paidAt && (!!u.stripeSessionId || !u.subscriptionId);
}

/** Paid features: active subscription, grace period after a failed renewal, or lifetime. */
export function hasProAccess(u: AccessFields): boolean {
  return u.subscriptionStatus === SubscriptionStatus.ACTIVE
    || u.subscriptionStatus === SubscriptionStatus.PAST_DUE
    || hasLifetimeAccess(u);
}

export const ACCESS_SELECT = {
  subscriptionStatus: true,
  paidAt:             true,
  stripeSessionId:    true,
  subscriptionId:     true,
} as const;
