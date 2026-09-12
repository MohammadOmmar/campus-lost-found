'use client'



import { useActionState } from 'react'

import { useFormStatus } from 'react-dom'

import { submitClaim } from '@/actions/claims'

import { Button } from '@/components/ui/button'

import { Textarea } from '@/components/ui/textarea'

import { Label } from '@/components/ui/label'

import { FadeUp } from '@/lib/motion'

import { ShieldCheck } from 'lucide-react'



interface ClaimFormProps {

  itemId: string

}



const initialState = { error: '' }



function SubmitButton() {

  const { pending } = useFormStatus()

  return (

    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>

      {pending ? 'Submitting—¦' : 'Submit claim'}

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

    <FadeUp delay={0.1}>

      <form action={formAction} className="space-y-6">

        <div className="space-y-3">

          <Label htmlFor="proof" className="text-h3">

            Your proof of ownership

          </Label>

          <p className="text-small text-text-muted measure-default">

            Describe something only the owner would know —" an engraving, a sticker, a dent,

            what was inside it. The finder will compare this against their private note.

          </p>

          <Textarea

            id="proof"

            name="proof"

            rows={6}

            minLength={20}

            maxLength={500}

            required

            placeholder="e.g. My initials are scratched under the left earbud case, and there's a small blue star sticker on the lid—¦"

            className="resize-none text-body"

          />

          <p className="text-caption text-text-muted">20—"500 characters.</p>

        </div>



        <div className="flex items-start gap-3 rounded-lg border border-border-subtle bg-base-700/30 px-5 py-4">

          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

          <p className="text-small text-text-muted">

            Your proof is private. Only the finder can see it while reviewing your claim. It is

            never shown publicly.

          </p>

        </div>



        {state.error && (

          <p role="alert" className="text-small text-status-lost">

            {state.error}

          </p>

        )}



        <SubmitButton />

      </form>

    </FadeUp>

  )

}

