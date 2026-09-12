'use client'



import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { markReturned, closeItem } from '@/actions/claims'

import { Button } from '@/components/ui/button'



export function ReturnActions({ itemId, itemStatus }: { itemId: string; itemStatus: string }) {

  const router = useRouter()

  const [pending, setPending] = useState<'return' | 'close' | null>(null)

  const [error, setError] = useState('')



  async function handleReturn() {

    if (!window.confirm('Confirm this item has been returned to its owner?')) return

    setPending('return')

    setError('')

    const result = await markReturned(itemId)

    setPending(null)

    if (!result.success) {

      setError(result.error)

      return

    }

    router.refresh()

  }



  async function handleClose() {

    if (!window.confirm('Close this report? It will no longer accept claims.')) return

    setPending('close')

    setError('')

    const result = await closeItem(itemId)

    setPending(null)

    if (!result.success) {

      setError(result.error)

      return

    }

    router.refresh()

  }



  return (

    <div className="space-y-3">

      {itemStatus === 'CLAIMED' && (

        <Button onClick={handleReturn} disabled={pending !== null} className="w-full" size="lg">

          {pending === 'return' ? 'Confirming—¦' : 'Confirm item returned'}

        </Button>

      )}

      {itemStatus === 'OPEN' && (

        <Button

          variant="outline"

          onClick={handleClose}

          disabled={pending !== null}

          className="w-full"

        >

          {pending === 'close' ? 'Closing—¦' : 'Close report'}

        </Button>

      )}

      {error && (

        <p role="alert" className="text-small text-status-lost">

          {error}

        </p>

      )}

    </div>

  )

}

