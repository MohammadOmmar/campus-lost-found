import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { matchItems, type MatchableItem } from '@/lib/matching'
import { FadeUp, StaggerContainer, StaggerItem } from '@/lib/motion'
import { MatchCandidateCard } from '@/components/matching/match-candidate-card'

interface MatchesPageProps {
	params: Promise<{ id: string }>
}

const PUBLIC_COLUMNS =
	'id, user_id, campus_id, type, title, description, category, location, date_lost_found, status'

export default async function MatchesPage({ params }: MatchesPageProps) {
	const { id } = await params
	const supabase = await createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/auth/login')
	}

	const { data: item } = await supabase
		.from('items')
		.select(PUBLIC_COLUMNS)
		.eq('id', id)
		.single()

	if (!item) {
		notFound()
	}

	if (item.user_id !== user.id) {
		redirect('/items')
	}

	const oppositeType = item.type === 'LOST' ? 'FOUND' : 'LOST'
	const { data: candidates } = await supabase
		.from('items')
		.select(PUBLIC_COLUMNS)
		.eq('campus_id', item.campus_id)
		.eq('type', oppositeType)
		.eq('status', 'OPEN')
		.neq('id', item.id)
		.order('created_at', { ascending: false })
		.limit(50)

	const source: MatchableItem = {
		id: item.id,
		type: item.type,
		title: item.title,
		description: item.description,
		category: item.category,
		location: item.location,
		date_lost_found: item.date_lost_found,
		status: item.status,
		campus_id: item.campus_id,
	}

	const matchables: MatchableItem[] = (candidates ?? []).map((candidate) => ({
		id: candidate.id,
		type: candidate.type,
		title: candidate.title,
		description: candidate.description,
		category: candidate.category,
		location: candidate.location,
		date_lost_found: candidate.date_lost_found,
		status: candidate.status,
		campus_id: candidate.campus_id,
	}))

	const { matches } = matchItems(source, matchables)

	return (
		<div className="container-tight page-shell">
			<Link
				href={`/items/${item.id}`}
				className="inline-flex items-center gap-2 text-small text-text-muted hover:text-text-primary transition-colors mb-8"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to report
			</Link>

			<FadeUp>
				<p className="text-caption text-text-muted mb-3">
					{item.type} &middot; {item.category}
				</p>
				<h1 className="text-h1 mb-3">Potential matches</h1>
				<p className="text-body-large text-text-muted max-w-[60ch]">
					These reports share characteristics with this item.
				</p>
			</FadeUp>

			<FadeUp delay={0.1} className="mt-10">
					<div className="bg-base-900 border border-border-default rounded-sm overflow-hidden">
					<div className="p-5 sm:p-6">
						<p className="text-caption text-text-muted mb-2">Your report</p>
						<h2 className="text-h3 mb-2">{item.title}</h2>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-text-muted">
							<span className="inline-flex items-center gap-1.5">
								<MapPin className="w-3.5 h-3.5" />
								{item.location}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Calendar className="w-3.5 h-3.5" />
								{formatDate(item.date_lost_found)}
							</span>
						</div>
					</div>
				</div>
			</FadeUp>

			<div className="mt-10">
				{matches.length === 0 ? (
					<FadeUp delay={0.15}>
									<div className="border border-border-default rounded-sm py-16 px-8 text-center">
							<p className="text-h3 mb-2">No potential matches yet</p>
							<p className="text-body text-text-muted max-w-[50ch] mx-auto">
								Check back later. New {oppositeType === 'FOUND' ? 'found' : 'lost'} reports
								are compared automatically when they are submitted.
							</p>
						</div>
					</FadeUp>
				) : (
					<StaggerContainer className="space-y-6" staggerDelay={0.08}>
						{matches.map((match, index) => (
							<StaggerItem key={match.candidate.id}>
								<MatchCandidateCard
									candidate={match.candidate}
									score={match.score}
									index={index}
								/>
							</StaggerItem>
						))}
					</StaggerContainer>
				)}
			</div>
		</div>
	)
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}
