'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitClaim } from '@/actions/claims'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ClaimFormProps {
  itemId: string
}

const initialState = { error: '' }

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit claim'}
    </Button>
  )
}

export function ClaimForm({ itemId }: ClaimFormProps) {
  const boundAction = submitClaim.bind(null, itemId)
  const [state, formAction] = useActionState(
    async (_prev: { error: string }, formData: FormData) => {
      const result = await boundAction(formData)
      if (!result.success) {
        return { error: result.error }
      }
      return { error: '' }
    },
    initialState
  )

  return (
    <form action={formAction} className="space-y-6">
      <div className="border-t border-border-default pt-5">
        <p className="text-caption mb-2">Private verification</p>
        <Label htmlFor="proof" className="text-h3">
          Your proof of ownership
        </Label>
        <p className="mt-3 text-small measure-default">
          Describe something only the owner would know: an engraving, a sticker, a scratch, or what
          was inside it. The finder compares this against their own private note.
        </p>
        <Textarea
          id="proof"
          name="proof"
          rows={6}
          minLength={20}
          maxLength={500}
          required
          aria-describedby="proof-help"
          placeholder="For example: my initials are scratched inside the case, and there is a small blue sticker on the lid."
          className="mt-4 resize-none"
        />
        <p id="proof-help" className="mt-2 text-caption">
          Between 20 and 500 characters. Required.
        </p>
      </div>

      <p className="text-small">
        Your proof is private. Only the finder can see it while reviewing this claim, and it is never
        shown on the public report.
      </p>

      {state.error && (
        <p role="alert" className="text-small text-status-lost">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
