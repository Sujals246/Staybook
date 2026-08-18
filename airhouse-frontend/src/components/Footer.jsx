import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-card)',
      padding: '24px 0',
      marginTop: 'auto',
      transition: 'var(--transition)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: spaceBetweenFlex(),
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ fontWeight: 600 }}>
          © {new Date().getFullYear()} <span style={{ color: 'var(--primary)' }}>Airhouse</span> Inc.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          Made with <Heart size={14} fill="var(--primary)" color="var(--primary)" /> for luxury stays
        </div>
        <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)' }}>
          <a href="#" className="hover-link">Privacy</a>
          <a href="#" className="hover-link">Terms</a>
          <a href="#" className="hover-link">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}

function spaceBetweenFlex() {
  return 'space-between';
}
