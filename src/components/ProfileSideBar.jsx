import React from 'react'

export default function ProfileSideBar({ user, showDetails = true, size = 64, overlay = false }) {
  const avatarUrl = `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user?.name || 'user')}`;

  // If overlay is true, render a relative container with the card and the avatar absolutely positioned
  if (overlay) {
    return (
      <div className="position-relative d-flex justify-content-center" style={{ paddingTop: size / 2 }}>
        <aside className="w3-card w3-white rounded-3 p-3" style={{ width: '100%' }}>
          {/* when overlaying render avatar overlapping the card and, if showDetails, show vertical info centered under it */}
          {showDetails && (
            <div className="text-center w-100 pt-2">
              <h5 className="mb-0 text-truncate">{user?.name || 'Nombre de Usuario'}</h5>
              <small className="text-secondary d-block text-truncate mb-2">{user?.email || 'Correo Electrónico'}</small>
              <hr />
              <ul className="list-unstyled small mb-0 text-start px-2">
                <li><strong>Programa:</strong> {user?.program || 'Programa del Usuario'}</li>
                <li><strong>Semestre:</strong> {user?.semester || 'Semestre del Usuario'}</li>
                <li><strong>Ciudad:</strong> {user?.city || 'Ubicación del Usuario'}</li>
              </ul>
            </div>
          )}
        </aside>

        <img
          src={avatarUrl}
          alt="User Avatar"
          className="rounded-circle shadow-sm"
          style={{
            width: size,
            height: size,
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '4px solid #fff',
          }}
        />
      </div>
    );
  }

  return (
    <aside className="w3-card w3-white rounded-3 p-3 d-flex align-items-center justify-content-center">
      {/* Vertical layout when showing details (avatar on top, info below) */}
      {!overlay && showDetails ? (
        <div className="text-center w-100">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="rounded-circle mb-3 mx-auto d-block"
            style={{ width: size, height: size, objectFit: 'cover' }}
          />
          <h5 className="mb-0 text-truncate">{user?.name || 'Nombre de Usuario'}</h5>
          <small className="text-secondary d-block text-truncate mb-2">{user?.email || 'Correo Electrónico'}</small>
          <hr />
          <ul className="list-unstyled small mb-0 text-start px-2">
            <li><strong>Programa:</strong> {user?.program || 'Programa del Usuario'}</li>
            <li><strong>Semestre:</strong> {user?.semester || 'Semestre del Usuario'}</li>
            <li><strong>Ciudad:</strong> {user?.city || 'Ubicación del Usuario'}</li>
          </ul>
        </div>
      ) : (
        // existing behavior for overlay or avatar-only
        <div className={`d-flex ${showDetails ? 'align-items-center gap-3' : 'justify-content-center'}`}>
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="rounded-circle"
            style={{ width: size, height: size, objectFit: 'cover', flexShrink: 0 }}
          />

          {showDetails && (
            <div className="flex-grow-1 overflow-hidden">
              <h5 className="mb-0 text-truncate" style={{ maxWidth: '100%' }}>{user?.name || 'Nombre de Usuario'}</h5>
              <small className="text-secondary text-truncate d-block">{user?.email || 'Correo Electrónico'}</small>
            </div>
          )}
        </div>
      )}

      { /* overlay case already handled above; no extra list here */ }
    </aside>
  )
}
