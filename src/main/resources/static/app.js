const { useState, useEffect } = React;

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [status, setStatus] = useState('');
    const [portal, setPortal] = useState(''); // '' | 'USER' | 'ADMIN'

    const showStatus = (msg, timeout = 2500) => {
        setStatus(msg);
        setTimeout(() => setStatus(''), timeout);
    };

    const logout = () => {
        setCurrentUser(null);
        setPortal('');
        showStatus('Logged out successfully');
    };

    return (
        <div>
            <header className="site-header">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>IVR Elderly Reminder</h1>
                        <p className="subtitle">Manage user profiles and automated voice reminders.</p>
                    </div>
                    {currentUser && (
                        <div>
                            <span style={{ marginRight: '15px' }}>Welcome, <strong>{currentUser.name}</strong> ({currentUser.role})</span>
                            <button className="btn" onClick={logout}>Logout</button>
                        </div>
                    )}
                </div>
            </header>
            
            <main className="container">
                {status && <div className="status" style={{ marginBottom: '20px' }} aria-live="polite">{status}</div>}
                
                {!currentUser && !portal && (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h2>Select Your Login Portal</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                            <button className="btn primary" style={{ padding: '20px 40px', fontSize: '1.2em' }} onClick={() => setPortal('USER')}>
                                User Portal
                            </button>
                            <button className="btn" style={{ padding: '20px 40px', fontSize: '1.2em', backgroundColor: '#333' }} onClick={() => setPortal('ADMIN')}>
                                Admin Portal
                            </button>
                        </div>
                    </div>
                )}

                {!currentUser && portal && (
                    <AuthView 
                        role={portal} 
                        onLogin={setCurrentUser} 
                        showStatus={showStatus} 
                        onBack={() => setPortal('')}
                    />
                )}

                {currentUser && currentUser.role === 'ADMIN' && <AdminDashboard showStatus={showStatus} />}
                {currentUser && currentUser.role === 'USER' && <UserDashboard currentUser={currentUser} showStatus={showStatus} />}
            </main>
            
            <footer className="site-footer">
                <div className="container">© IVR System Reminder Platform</div>
            </footer>
        </div>
    );
}

function AuthView({ role, onLogin, showStatus, onBack }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ email: '', password: '', name: '', phone: '', language: 'English', location: '' });

    const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email, password: form.password })
                });
                if (!res.ok) throw new Error('Invalid Credentials');
                const user = await res.json();
                
                // Enforce role separation if trying to log into the wrong portal
                if (user.role !== role) {
                    throw new Error(`Access Denied: You must use the ${user.role} portal.`);
                }

                onLogin(user);
                showStatus(`Welcome back, ${user.name}!`);
            } catch (err) {
                showStatus(err.message);
            }
        } else {
            try {
                const newUser = { ...form, role: role }; // Assign role based on portal
                const res = await fetch('/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });
                if (!res.ok) throw new Error('Registration failed. Email might be in use.');
                const savedUser = await res.json();
                onLogin(savedUser);
                showStatus('Registration successful!');
            } catch (err) {
                showStatus(err.message);
            }
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <button className="btn" onClick={onBack} style={{ marginBottom: '20px' }}>&larr; Back to Portals</button>
            <section className="card form-card" style={{ borderTop: role === 'ADMIN' ? '4px solid #333' : '4px solid #0056b3' }}>
                <h2>{role === 'ADMIN' ? 'Admin Gateway' : 'User Access'} - {isLogin ? 'Login' : 'Register'}</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <label>Email Address</label>
                        <input id="email" type="email" required value={form.email} onChange={handleChange} />
                    </div>
                    <div className="row">
                        <label>Password</label>
                        <input id="password" type="password" required value={form.password} onChange={handleChange} />
                    </div>
                    
                    {!isLogin && (
                        <>
                            <div className="row">
                                <label>Full Name</label>
                                <input id="name" required value={form.name} onChange={handleChange} />
                            </div>
                            <div className="row">
                                <label>Phone (+...)</label>
                                <input id="phone" required placeholder="+1234567890" value={form.phone} onChange={handleChange} />
                            </div>
                            {role === 'USER' && (
                                <>
                                    <div className="row">
                                        <label>Language</label>
                                        <input id="language" value={form.language} onChange={handleChange} />
                                    </div>
                                    <div className="row">
                                        <label>Location</label>
                                        <input id="location" value={form.location} onChange={handleChange} />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    
                    <div className="actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn primary" type="submit" style={{ backgroundColor: role === 'ADMIN' ? '#333' : '' }}>
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
                            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                        </a>
                    </div>
                </form>
            </section>
        </div>
    );
}

function AdminDashboard({ showStatus }) {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        try {
            const res = await fetch('/users');
            if (res.ok) setUsers(await res.json());
        } catch (e) { showStatus('Failed to load users'); }
    };

    useEffect(() => { loadUsers(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this user permanently?')) return;
        try {
            await fetch(`/users/${id}`, { method: 'DELETE' });
            showStatus('User deleted');
            loadUsers();
        } catch (e) { showStatus('Failed to delete'); }
    };

    return (
        <section className="card list-card" style={{ borderTop: '4px solid #333' }}>
            <div className="list-header">
                <h2>All Registered Users (Admin View)</h2>
                <button className="btn" onClick={loadUsers}>Refresh</button>
            </div>
            <div className="users" style={{ marginTop: '15px' }}>
                {users.length === 0 ? <p>No users found.</p> : users.map(u => (
                    <div key={u.id} className="user" style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                        <div className="meta">
                            <div className="name">{u.name} <strong style={{ color: u.role === 'ADMIN' ? 'red' : 'blue' }}>({u.role})</strong></div>
                            <div className="phone">{u.phone}</div>
                            <div style={{ fontSize: '0.85em', color: '#666' }}>ID: {u.id} | Email: {u.email} | Loc: {u.location || 'N/A'}</div>
                        </div>
                        <div className="actions">
                            <button className="btn danger" onClick={() => handleDelete(u.id)}>Delete User</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function UserDashboard({ currentUser, showStatus }) {
    const [reminders, setReminders] = useState([]);
    const [scheduleTime, setScheduleTime] = useState('');
    const [reason, setReason] = useState('');
    const [editingId, setEditingId] = useState(null);

    const loadReminders = async () => {
        try {
            const res = await fetch(`/reminders/user/${currentUser.id}`);
            if (res.ok) setReminders(await res.json());
        } catch (e) { showStatus('Failed to load reminders'); }
    };

    useEffect(() => { loadReminders(); }, []);

    const handleSaveReminder = async (e) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/reminders/${editingId}` : '/reminders';
            
            // Format HH:mm using the native time input
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, scheduleTime, reason })
            });

            if (!res.ok) throw new Error('Failed to save reminder');
            showStatus(editingId ? 'Daily reminder updated!' : 'Daily reminder scheduled!');
            setScheduleTime('');
            setReason('');
            setEditingId(null);
            loadReminders();
        } catch (err) {
            showStatus(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this reminder?')) return;
        try {
            await fetch(`/reminders/${id}`, { method: 'DELETE' });
            showStatus('Reminder deleted');
            loadReminders();
        } catch (e) { showStatus('Failed to delete reminder'); }
    };

    const handleEdit = (r) => {
        setScheduleTime(r.scheduleTime);
        setReason(r.reason || '');
        setEditingId(r.id);
    };

    return (
        <div className="grid">
            <section className="card form-card">
                <h2>{editingId ? 'Update Routine' : 'Set Daily Routine'}</h2>
                <form className="form" onSubmit={handleSaveReminder}>
                    <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
                        Set a time when the IVR system should automatically call <strong>{currentUser.phone}</strong> everyday. Add a custom reason that will be read aloud.
                    </p>
                    <div className="row">
                        <label>Daily Time</label>
                        <input 
                            type="time" 
                            required 
                            value={scheduleTime} 
                            onChange={(e) => setScheduleTime(e.target.value)} 
                        />
                    </div>
                    <div className="row">
                        <label>Reason / Message</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="e.g. Take your evening medication"
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)} 
                        />
                    </div>
                    <div className="actions">
                        <button className="btn primary" type="submit">{editingId ? 'Update Routine' : 'Create Routine'}</button>
                        {editingId && <button type="button" className="btn" onClick={() => { setEditingId(null); setScheduleTime(''); setReason(''); }}>Cancel Edit</button>}
                    </div>
                </form>
            </section>

            <section className="card list-card">
                <div className="list-header">
                    <h2>Your Daily Reminders</h2>
                    <button className="btn" onClick={loadReminders}>Refresh</button>
                </div>
                <div className="users" style={{ marginTop: '15px' }}>
                    {reminders.length === 0 ? <p>No daily routines found.</p> : reminders.map(r => (
                        <div key={r.id} className="user" style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                            <div className="meta">
                                <div className="name" style={{ fontSize: '1.2em' }}>
                                    Everyday at {r.scheduleTime}
                                </div>
                                <div style={{ fontSize: '0.9em', fontStyle: 'italic', marginTop: '5px' }}>
                                    "{r.reason}"
                                </div>
                            </div>
                            <div className="actions" style={{ flexDirection: 'column', gap: '5px' }}>
                                <button className="btn primary" onClick={() => {
                                    alert('We simulate IVR locally and deploy telephony using Twilio API');
                                    let msg = new SpeechSynthesisUtterance("Hello, this is your smart health assistant. Please " + r.reason);
                                    window.speechSynthesis.speak(msg);
                                }}>Simulate Fallback Call</button>
                                <button className="btn" onClick={() => handleEdit(r)}>Edit</button>
                                <button className="btn danger" onClick={() => handleDelete(r.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
