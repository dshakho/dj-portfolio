export function Footer() {
  const timezone = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    timeZoneName: 'short',
  })
    .formatToParts(new Date())
    .find((part) => part.type === 'timeZoneName')?.value ?? 'CET'

  return (
    <footer className="mt-auto flex shrink-0 items-center justify-center gap-4 px-4 py-3 text-xs text-neutral-500">
      <span>2026, all rights reserved</span>
      <span aria-hidden="true">|</span>
      <span>berlin</span>
      <span aria-hidden="true">|</span>
      <span>{timezone}</span>
    </footer>
  )
}
