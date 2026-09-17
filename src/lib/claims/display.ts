export function claimNextStep(status: string, itemStatus?: string) {
  if (status === 'approved' && itemStatus === 'RETURNED') return 'Return complete. No further action is needed.'
  if (status === 'approved') return 'Ownership approved. Arrange a safe handoff with the finder.'
  if (status === 'rejected') return 'The finder declined this claim. You can continue browsing other reports.'
   if (status === 'pending') return 'Awaiting the finder\'s review. Check back here for a decision.'
  return 'Provide a private identifying detail for the finder to review.'
}
