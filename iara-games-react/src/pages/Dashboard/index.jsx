import { Outlet } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <main className="dashboard-shell container">
      <Outlet />
    </main>
  );
}
