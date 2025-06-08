'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div>
      <h2>Oh no!</h2>
      <p>
        There was an issue with our storefront. This could be a temporary issue, please
        try your action again.
      </p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  )
}
