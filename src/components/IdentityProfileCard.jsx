function IdentityProfileCard({ identity, compact = false }) {
  const initials = identity.name ? identity.name.charAt(0).toUpperCase() : 'K'

  return (
    <article className={`identity-card ${compact ? 'compact' : ''}`}>
      <div className="identity-card__header">
        <div>
          <div className="eyebrow">KINORA ID</div>
          <strong>{identity.id}</strong>
        </div>
        <span className={`status-badge ${identity.isLost ? 'lost' : 'verified'}`}>
          {identity.isLost ? 'REPORTED LOST' : 'Verified Identity'}
        </span>
      </div>

      <div className="identity-card__profile">
        <div className="avatar">{initials}</div>
        <div>
          <h3>{identity.name}</h3>
          <p>{identity.genericName}</p>
          {identity.breed ? <p>{identity.breed}</p> : null}
        </div>
      </div>

      <div className="identity-card__meta">
        <span>{identity.relationship}</span>
        <span>{identity.category}</span>
      </div>
    </article>
  )
}

export default IdentityProfileCard
