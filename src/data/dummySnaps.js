export const DUMMY_SNAPS = [
  {
    id: 1,
    username: 'radha_k',
    title: 'Memoize expensive selectors with useMemo',
    language: 'javascript',
    created_at: '2026-06-11T14:22:00Z',
    code_content: `const filteredSnaps = useMemo(() => {
  return snaps.filter((snap) =>
    snap.title.toLowerCase().includes(query.toLowerCase())
  );
}, [snaps, query]);`,
  },
  {
    id: 2,
    username: 'debug_wizard',
    title: 'Fix race condition in async Supabase fetch',
    language: 'typescript',
    created_at: '2026-06-11T11:05:00Z',
    code_content: `useEffect(() => {
  let cancelled = false;

  async function loadSnaps() {
    const { data, error } = await supabase
      .from('dev_snaps')
      .select('*')
      .order('created_at', { ascending: false });

    if (!cancelled && data) setSnaps(data);
  }

  loadSnaps();
  return () => { cancelled = true; };
}, []);`,
  },
  {
    id: 3,
    username: 'sql_sage',
    title: 'Chronological index for feed hydration',
    language: 'sql',
    created_at: '2026-06-10T19:41:00Z',
    code_content: `CREATE INDEX idx_dev_snaps_created_at
  ON dev_snaps (created_at DESC);

SELECT id, username, title, code_content, language, created_at
FROM dev_snaps
ORDER BY created_at DESC
LIMIT 20;`,
  },
  {
    id: 4,
    username: 'rustacean',
    title: 'Safe concurrent snippet cache with Arc<RwLock>',
    language: 'rust',
    created_at: '2026-06-10T08:17:00Z',
    code_content: `use std::sync::{Arc, RwLock};

struct SnapCache {
  entries: Arc<RwLock<Vec<Snap>>>,
}

impl SnapCache {
  fn push(&self, snap: Snap) {
    self.entries.write().unwrap().push(snap);
  }
}`,
  },
  {
    id: 5,
    username: 'py_tinker',
    title: 'Parse AST tokens for syntax validation',
    language: 'python',
    created_at: '2026-06-09T16:33:00Z',
    code_content: `import ast

def validate_snippet(source: str) -> bool:
    try:
        ast.parse(source)
        return True
    except SyntaxError:
        return False`,
  },
]
