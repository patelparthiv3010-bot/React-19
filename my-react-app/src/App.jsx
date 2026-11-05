import { useState, useEffect } from 'react';
import { modules } from './modules/index.js';
import { useTheme } from './ThemeContext.jsx';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [selected, setSelected] = useState({ m: 0, t: 0 });
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('completed') || '{}'));
  const [query, setQuery] = useState('');

  useEffect(() => { localStorage.setItem('completed', JSON.stringify(completed)); }, [completed]);

  const mod = modules[selected.m];
  const topic = mod.topics[selected.t];

  const filteredModules = modules.map(m => ({
    ...m,
    topics: m.topics.filter(t => t.toLowerCase().includes(query.toLowerCase()))
  })).filter(m => m.topics.length > 0 || m.title.toLowerCase().includes(query.toLowerCase()));

  const key = `${selected.m}-${selected.t}`;
  const isDone = !!completed[key];
  const toggleDone = () => setCompleted(c => ({ ...c, [key]: !c[key] }));

  const total = modules.reduce((a, m) => a + m.topics.length, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>React Playground</h2>
        <input placeholder="Search topics" value={query} onChange={e => setQuery(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
        {filteredModules.map(m => (
          <div key={m.id}>
            <strong>{m.title}</strong>
            <ul style={{ listStyle: 'none', paddingLeft: 8 }}>
              {m.topics.map(t => {
                const mi = modules.findIndex(x => x.id === m.id);
                const ti = modules[mi].topics.indexOf(t);
                return (
                  <li key={t}>
                    <button className="btn" onClick={() => setSelected({ m: mi, t: ti })} style={{ fontSize: 13 }}>
                      {completed[`${mi}-${ti}`] ? '? ' : ''}{t}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <p>Progress: {pct}%</p>
      </aside>
      <main className="main">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h1>{mod.title} - {topic}</h1>
          <button className="btn toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '?? Light' : '?? Dark'}
          </button>
        </nav>
        <p>Module {mod.id} of {modules.length}. Topic {selected.t + 1} of {mod.topics.length}.</p>
        <button className="btn" onClick={toggleDone}>{isDone ? 'Mark Undone' : 'Mark Complete'}</button>
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Code Example</h3>
          <pre className="code">{`function Example() {\n  // ${topic}\n  return <h1>${topic}</h1>;\n}`}</pre>
          <p>Practice task: Try this concept in your own component.</p>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button className="btn" disabled={selected.t === 0 && selected.m === 0} onClick={() => {
            if (selected.t > 0) setSelected({ m: selected.m, t: selected.t - 1 });
            else if (selected.m > 0) setSelected({ m: selected.m - 1, t: modules[selected.m - 1].topics.length - 1 });
          }}>Previous</button>
          <button className="btn" disabled={selected.m === modules.length - 1 && selected.t === mod.topics.length - 1} onClick={() => {
            if (selected.t < mod.topics.length - 1) setSelected({ m: selected.m, t: selected.t + 1 });
            else if (selected.m < modules.length - 1) setSelected({ m: selected.m + 1, t: 0 });
          }}>Next</button>
        </div>
      </main>
    </div>
  );
}

export default App;