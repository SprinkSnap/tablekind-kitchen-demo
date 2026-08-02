import { useEffect, useState } from 'react';
import { track } from '../../lib/analytics';

const STORAGE_KEY = 'tk-portfolio-bar-dismissed';

type Props = {
  caseStudyUrl: string;
};

export default function PortfolioBar({ caseStudyUrl }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') {
        document.documentElement.style.setProperty('--portfolio-offset', '0px');
        return;
      }
    } catch {
      /* ignore */
    }
    setVisible(true);
    document.documentElement.style.setProperty('--portfolio-offset', 'var(--portfolio-bar-height)');
  }, []);

  const dismiss = () => {
    setVisible(false);
    document.documentElement.style.setProperty('--portfolio-offset', '0px');
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div className="portfolio-bar" role="region" aria-label="Che Xu Studio portfolio notice">
      <p>Restaurant website concept designed by Che Xu Studio.</p>
      <div className="portfolio-bar__actions">
        <a
          href={caseStudyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('case_study_selected', { source: 'portfolio_bar' })}
        >
          View Case Study
        </a>
        <button
          type="button"
          className="linkish"
          onClick={() => {
            track('che_xu_cta_selected', { source: 'portfolio_bar' });
            document.dispatchEvent(new CustomEvent('tk:open-enquiry'));
          }}
        >
          Build a Website Like This
        </button>
        <button type="button" className="dismiss" onClick={dismiss} aria-label="Dismiss portfolio notice">
          Dismiss
        </button>
      </div>
      <style>{`
        .portfolio-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem 1rem;
          min-height: var(--portfolio-bar-height);
          padding: 0.45rem 1rem;
          background: #10271E;
          color: #F7F2E8;
          font-size: 0.9rem;
        }
        .portfolio-bar p { margin: 0; }
        .portfolio-bar__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: center;
        }
        .portfolio-bar a,
        .portfolio-bar .linkish,
        .portfolio-bar .dismiss {
          min-height: 36px;
          border-radius: 999px;
          padding: 0.25rem 0.75rem;
          border: 1px solid rgb(247 242 232 / 0.28);
          background: transparent;
          color: inherit;
          font: inherit;
          font-weight: 650;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .portfolio-bar a:hover,
        .portfolio-bar .linkish:hover {
          background: rgb(247 242 232 / 0.1);
        }
        .portfolio-bar .dismiss {
          border-color: transparent;
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}
