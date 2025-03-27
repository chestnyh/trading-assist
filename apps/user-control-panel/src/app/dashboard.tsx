import { useState } from 'react';

export function Dashboard() {
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
    return (
      <div>
        {isRegisteredUser ? (
          <h1>Dashboard</h1>
        ) : (
          <p>Please register to view the dashboard.</p>
        )}
      </div>
    );
}
  
export default Dashboard;