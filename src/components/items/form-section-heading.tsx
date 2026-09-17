export function FormSectionHeading({ number, title, description }: { number: string; title: string; description: string }) {
  return <div className="flex items-start gap-4 border-t border-border-default pt-5 mb-5"><span className="text-sm text-heritage tabular-nums" aria-hidden="true">{number}</span><div><h2 className="text-base font-medium">{title}</h2><p className="text-sm text-text-secondary mt-1">{description}</p></div></div>
}
