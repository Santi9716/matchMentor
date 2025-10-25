import React from 'react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ role, title, children }) {
  return (
    <div className="container py-4">
      <div className="row g-3">
        {/* Sidebar */}
        <div className="col-12 col-lg-3">
          <Sidebar role={role} />
        </div>

        {/* Contenido principal */}
        <div className="col-12 col-lg-9">
          <div className="vstack gap-3">
            {title && (
              <div className={`w3-container w3-padding ${role === 'mentor' ? 'w3-teal' : 'w3-blue'} rounded-3`}>
                <h5 className="mb-0 text-white">{title}</h5>
              </div>
            )}

            <div className="w3-card w3-white rounded-3 p-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
