import { roleOptions } from '../data/mockData.js';

function RoleSwitcher({ activeRole, onRoleChange, permissions }) {
  const capabilityList = [
    permissions.canAddTransaction ? 'Create transactions' : 'No write actions',
    permissions.canViewFlagged ? 'Can view flagged records' : 'Flagged records hidden',
    permissions.canExport ? 'Can export CSV reports' : 'Export disabled',
  ];

  return (
    <div className="role-switcher-shell">
      <div className="role-switcher" role="tablist" aria-label="Role switcher">
        {roleOptions.map((role) => (
          <button
            aria-selected={activeRole === role.id}
            className={`role-button ${activeRole === role.id ? 'is-active' : ''}`}
            key={role.id}
            onClick={() => onRoleChange(role.id)}
            role="tab"
            type="button"
          >
            <span>{role.label}</span>
            <small>{role.summary}</small>
          </button>
        ))}
      </div>
      <div className="permission-pills">
        {capabilityList.map((capability) => (
          <span className="permission-pill" key={capability}>
            {capability}
          </span>
        ))}
      </div>
    </div>
  );
}

export default RoleSwitcher;
