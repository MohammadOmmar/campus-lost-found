type ClaimStatus = 'pending' | 'approved' | 'rejected' | string

type StepState = 'done' | 'current' | 'todo' | 'stopped'

interface Step {
  label: string
  detail: string
  state: StepState
}

const STATE_TEXT: Record<StepState, string> = {
  done: 'Complete',
  current: 'In progress',
  todo: 'Pending',
  stopped: 'Closed',
}

function stepsFor(status: ClaimStatus): Step[] {
  if (status === 'approved') {
    return [
      { label: 'Claim submitted', detail: 'Your private verification was sent to the finder.', state: 'done' },
      { label: 'Finder review', detail: 'The finder reviewed your identifying detail.', state: 'done' },
      { label: 'Ownership approved', detail: 'The finder confirmed this item belongs to you.', state: 'done' },
      { label: 'Arrange a safe handoff', detail: 'Contact the finder and agree on a campus meeting point, then confirm the return.', state: 'current' },
    ]
  }

  if (status === 'rejected') {
    return [
      { label: 'Claim submitted', detail: 'Your private verification was sent to the finder.', state: 'done' },
      { label: 'Finder review', detail: 'The finder reviewed your identifying detail.', state: 'done' },
      { label: 'Not approved', detail: 'The finder declined this claim. You can continue browsing other reports.', state: 'stopped' },
    ]
  }

  return [
    { label: 'Claim submitted', detail: 'Your private verification was sent to the finder.', state: 'done' },
    { label: 'Finder review', detail: 'The finder reviews your detail and decides whether to approve or decline.', state: 'current' },
    { label: 'Decision', detail: 'You will see the outcome here and on your claims page.', state: 'todo' },
    { label: 'Arrange a safe handoff', detail: 'If approved, agree on a campus meeting point and confirm the return.', state: 'todo' },
  ]
}

export function ClaimTimeline({ status }: { status: ClaimStatus }) {
  const steps = stepsFor(status)

  return (
    <ol aria-label="Claim progress" className="border-t border-border-default">
      {steps.map((step, index) => (
        <li key={step.label} className="grid gap-1 border-b border-border-default py-3 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4">
          <span aria-hidden="true" className="text-caption text-text-muted">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {step.label}
              <span className="ml-2 text-xs font-normal text-text-secondary">{STATE_TEXT[step.state]}</span>
            </p>
            <p className="text-small mt-1">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
