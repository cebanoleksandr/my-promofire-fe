const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/campaigns">Campaigns</a></li>
        <li><a href="/codes">Codes</a></li>
        <li><a href="/distributors">Distributors</a></li>
        <li><a href="/users">Users</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;