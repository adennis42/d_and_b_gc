/* eslint-disable no-undef */
/* Raise Design & Build — UI Kit components */

const { useState, useEffect, useRef } = React;

/* ============== ICONS (inline SVG, lucide-style 1.25 stroke) ============== */
const Icon = ({ name, size = 18, stroke = 1.25 }) => {
  const paths = {
    arrowRight: <><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></>,
    arrowDownRight: <><path d="M7 7l10 10"/><path d="M17 7v10H7"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></>,
    menu: <><path d="M3 7h18M3 12h18M3 17h12"/></>,
    close: <><path d="M5 5l14 14M19 5L5 19"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <><path d="M5 12h14"/></>,
    pin: <><path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></>,
    phone: <><path d="M22 16.92V20a2 2 0 01-2.18 2 19 19 0 01-8.27-3.07 18.5 18.5 0 01-6-6A19 19 0 012.5 4.18 2 2 0 014.49 2h3.08a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.73a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2z"/></>,
    mail: <><path d="M22 16V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2z"/><path d="M2 8l10 6 10-6"/></>,
    chevDown: <><path d="M6 9l6 6 6-6"/></>,
    check: <><path d="M5 12l5 5 9-12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

/* ============== LOGO ============== */
const Logo = ({ inverted = false, compact = false }) => {
  const color = inverted ? '#FAF7F2' : '#1B1A17';
  const accent = '#A8804A';
  const sz = compact ? 22 : 26;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, color }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: sz, fontWeight: 400, letterSpacing: '0.01em' }}>Raise</span>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: sz, fontStyle: 'italic', fontWeight: 300, padding: '0 6px', letterSpacing: '0.01em' }}>Design</span>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: sz + 2, fontStyle: 'italic', color: accent, padding: '0 4px' }}>&amp;</span>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: sz, fontWeight: 400, letterSpacing: '0.01em' }}>Build</span>
    </div>
  );
};

/* ============== BUTTON ============== */
const Button = ({ children, variant = 'primary', size = 'md', onClick, href, icon = false }) => {
  const Tag = href ? 'a' : 'button';
  const sizes = {
    sm: { padding: '10px 18px', fontSize: 11 },
    md: { padding: '14px 28px', fontSize: 12 },
    lg: { padding: '18px 36px', fontSize: 13 },
  };
  const variants = {
    primary:   { background: '#1B1A17', color: '#FAF7F2', border: '1px solid #1B1A17' },
    secondary: { background: 'transparent', color: '#1B1A17', border: '1px solid #1B1A17' },
    inverted:  { background: '#FAF7F2', color: '#1B1A17', border: '1px solid #FAF7F2' },
    ghost:     { background: 'transparent', color: '#1B1A17', border: '1px solid transparent', padding: '6px 0', borderBottom: '1px solid #1B1A17' },
  };
  const v = variants[variant];
  return (
    <Tag href={href} onClick={onClick} className={`rb-btn rb-btn-${variant}`}
         style={{
           ...sizes[size], ...v,
           display: 'inline-flex', alignItems: 'center', gap: 10,
           fontFamily: "'Inter', sans-serif", fontWeight: 500,
           letterSpacing: '0.18em', textTransform: 'uppercase',
           cursor: 'pointer', textDecoration: 'none', transition: 'all 240ms ease',
         }}>
      <span>{children}</span>
      {icon && <Icon name="arrowRight" size={14} />}
    </Tag>
  );
};

/* ============== EYEBROW with serif numeral ============== */
const Eyebrow = ({ children, num }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: '#76726A' }}>
    {num && (
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                     fontSize: 18, color: '#A8804A' }}>{num}</span>
    )}
    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500,
                   letterSpacing: '0.22em', textTransform: 'uppercase' }}>
      {children}
    </span>
  </div>
);

/* ============== HEADER ============== */
const Header = ({ onNav, current = 'home' }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { id: 'work', label: 'Work' },
    { id: 'studio', label: 'Studio' },
    { id: 'process', label: 'Process' },
    { id: 'journal', label: 'Journal' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(245, 241, 234, 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(217, 209, 194, 0.6)' : '1px solid transparent',
      transition: 'all 320ms ease',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 96 }}>
        <a href="#" onClick={(e)=>{e.preventDefault(); onNav('home');}} style={{ flexShrink: 0 }}><Logo /></a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 40, flexShrink: 0 }}>
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`}
               onClick={(e)=>{e.preventDefault(); onNav(l.id);}}
               style={{
                 fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500,
                 letterSpacing: '0.22em', textTransform: 'uppercase',
                 color: current === l.id ? '#A8804A' : '#1B1A17',
                 textDecoration: 'none', transition: 'opacity 200ms ease',
               }}>
              {l.label}
            </a>
          ))}
          <Button variant="secondary" size="sm" onClick={()=>onNav('schedule')}>Schedule</Button>
        </nav>
      </div>
    </header>
  );
};

/* ============== FOOTER ============== */
const Footer = ({ onNav }) => (
  <footer style={{ background: '#1B1A17', color: '#F5F1EA', padding: '96px 32px 48px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 64, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Logo inverted />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                      fontSize: 22, lineHeight: 1.4, color: '#EFE3D0', maxWidth: 320 }}>
            A family of builders, designers, and millworkers shaping homes across Long Island since 1985.
          </p>
        </div>
        {[
          { h: 'Studio', items: ['About', 'Process', 'Journal', 'Press'] },
          { h: 'Work',   items: ['Kitchens', 'Bathrooms', 'Sunrooms', 'Millwork'] },
          { h: 'Contact', items: ['(631) 555-0184', 'studio@raisedesignbuild.com', 'Suffolk County, NY'] },
        ].map(col => (
          <div key={col.h} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
                          letterSpacing: '0.28em', textTransform: 'uppercase',
                          color: '#A8804A', paddingBottom: 12,
                          borderBottom: '1px solid rgba(245,241,234,0.18)' }}>
              {col.h}
            </div>
            {col.items.map(i => (
              <a key={i} href="#" style={{ color: '#F5F1EA', fontSize: 13, opacity: 0.78,
                                            textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}>{i}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 80, paddingTop: 24,
        borderTop: '1px solid rgba(245,241,234,0.18)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(245,241,234,0.5)',
        letterSpacing: '0.06em',
      }}>
        <span>© 2026 Raise Design &amp; Build · Design and craftsmanship since 1985</span>
        <a href="#" style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icon name="instagram" size={16} /> @raisedesignbuild
        </a>
      </div>
    </div>
  </footer>
);

/* ============== HERO ============== */
const Hero = ({ onSchedule }) => (
  <section style={{ position: 'relative', minHeight: '92vh', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: "url('../../assets/hero.jpg')",
      backgroundSize: 'cover', backgroundPosition: 'center',
    }} />
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(27,26,23,0.15) 0%, rgba(27,26,23,0.55) 100%)',
    }} />
    {/* Vertical credit line */}
    <div style={{
      position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%) rotate(180deg)',
      writingMode: 'vertical-rl',
      fontFamily: "'Inter', sans-serif", fontSize: 10,
      letterSpacing: '0.32em', textTransform: 'uppercase',
      color: 'rgba(245,241,234,0.7)',
    }}>
      No. 14 — North Fork Residence, 2024
    </div>
    <div style={{
      position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto',
      padding: '160px 32px 80px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end',
      minHeight: '92vh', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Eyebrow num="01">Kitchens · Baths · Sunrooms · Millwork</Eyebrow>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300, fontSize: 'clamp(56px, 8vw, 120px)',
          lineHeight: 0.95, letterSpacing: '-0.025em',
          color: '#FAF7F2', margin: 0,
        }}>
          Crafted<br/>
          by hand.<br/>
          <em style={{ fontWeight: 400, color: '#C5A47E' }}>Built for life.</em>
        </h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 16, alignItems: 'flex-start' }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.7,
          color: 'rgba(250,247,242,0.9)', maxWidth: 380, fontWeight: 300,
        }}>
          Three generations of millworkers and designers shaping kitchens,
          bathrooms, and sunrooms across Long Island's North &amp; South Forks.
        </p>
        <Button variant="inverted" size="lg" icon onClick={onSchedule}>Schedule a visit</Button>
      </div>
    </div>
  </section>
);

/* ============== EDITORIAL INTRO (after hero) ============== */
const EditorialIntro = () => (
  <section style={{ background: '#F5F1EA', padding: '128px 32px' }}>
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid',
                  gridTemplateColumns: 'auto 1fr', gap: 96, alignItems: 'start' }}>
      <Eyebrow num="i">Studio</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 'clamp(36px, 4.5vw, 64px)', lineHeight: 1.05,
          letterSpacing: '-0.02em', color: '#1B1A17', margin: 0,
        }}>
          Founded by a master carpenter,<br/>
          <em style={{ fontWeight: 400, color: '#A8804A' }}>continued by his children.</em>
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.75,
          color: '#2B2A26', fontWeight: 300, maxWidth: 620,
        }}>
          Paul Sr. learned the trade the old way — on the job, day after day,
          in the homes he was building. After thirty years framing houses, he
          turned to interior work: cabinetry, kitchens, baths. Today his son
          Paul Jr. works the bench beside him, and his daughter Jessica leads
          the design studio. Three perspectives, one set of hands.
        </p>
        <a href="#" style={{
          alignSelf: 'flex-start', fontFamily: "'Inter', sans-serif",
          fontSize: 11, fontWeight: 500, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: '#1B1A17',
          borderBottom: '1px solid #1B1A17', paddingBottom: 4,
          textDecoration: 'none',
        }}>Read our story →</a>
      </div>
    </div>
  </section>
);

/* ============== SERVICES — editorial grid ============== */
const services = [
  { id: 1, num: '01', title: 'Kitchens', img: 'linear-gradient(135deg,#3a2e22 0%,#6b5440 50%,#a08868 100%)',
    note: 'Full kitchen design, custom cabinetry, stone, and lighting.' },
  { id: 2, num: '02', title: 'Bathrooms', img: 'linear-gradient(135deg,#2a3640 0%,#516a78 60%,#a8b8c4 100%)',
    note: 'Spa-grade bathrooms with bench-built millwork details.' },
  { id: 3, num: '03', title: 'Sunrooms', img: 'linear-gradient(135deg,#3d4733 0%,#6b7a5e 60%,#c8cdb8 100%)',
    note: 'Year-round rooms designed around the way light moves.' },
  { id: 4, num: '04', title: 'Millwork', img: 'linear-gradient(135deg,#5b4a3a 0%,#8a6638 60%,#c5a47e 100%)',
    note: 'Built-ins, libraries, mantels, and bespoke furniture.' },
];

const Services = () => (
  <section style={{ background: '#EDE6DA', padding: '128px 32px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Eyebrow num="ii">What we make</Eyebrow>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em',
            color: '#1B1A17', margin: 0,
          }}>
            Four disciplines.<br/>
            <em style={{ fontWeight: 400 }}>One workshop.</em>
          </h2>
        </div>
        <a href="#" style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#1B1A17', borderBottom: '1px solid #1B1A17',
          paddingBottom: 4, textDecoration: 'none',
        }}>All work →</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 48 }}>
        {services.map((s, i) => (
          <a key={s.id} href="#" className="service-card" style={{
            display: 'flex', flexDirection: 'column', gap: 24, textDecoration: 'none',
            color: 'inherit', cursor: 'pointer',
          }}>
            <div style={{
              aspectRatio: i % 2 === 0 ? '5/6' : '5/7',
              background: s.img, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 24, left: 24,
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 24, color: 'rgba(245,241,234,0.85)',
              }}>{s.num}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
                fontSize: 38, letterSpacing: '-0.015em', color: '#1B1A17', margin: 0,
              }}>{s.title}</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7,
                color: '#4A4842', fontWeight: 300, maxWidth: 380, margin: 0,
              }}>{s.note}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

/* ============== FEATURED PROJECT (full-bleed) ============== */
const FeaturedProject = () => (
  <section style={{ background: '#F5F1EA', padding: '128px 32px' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid',
                  gridTemplateColumns: '5fr 4fr', gap: 80, alignItems: 'center' }}>
      <div style={{
        aspectRatio: '4/5',
        backgroundImage: "url('../../assets/hero.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        boxShadow: '0 32px 64px rgba(27, 26, 23, 0.18)',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Eyebrow num="No. 14">Featured Project</Eyebrow>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.05,
          letterSpacing: '-0.02em', color: '#1B1A17', margin: 0,
        }}>
          A North Fork kitchen<br/>
          <em style={{ fontWeight: 400, color: '#A8804A' }}>in cerused white oak</em>
        </h2>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 22, lineHeight: 1.5, color: '#2B2A26', fontWeight: 400,
        }}>
          "We wanted a working kitchen — not a showpiece. They drew it,
          built it, and we cook in it every night."
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, paddingTop: 16 }}>
          {[
            ['Location', 'Cutchogue, NY'],
            ['Completed', 'June 2024'],
            ['Materials', 'White oak, honed marble, oil-rubbed bronze'],
            ['Duration', 'Fourteen weeks'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{
                fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase', color: '#76726A',
              }}>{k}</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
                color: '#1B1A17', marginTop: 4,
              }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 8 }}>
          <Button variant="primary" icon>View project</Button>
        </div>
      </div>
    </div>
  </section>
);

/* ============== PROCESS — numbered steps ============== */
const Process = () => {
  const steps = [
    { n: '01', t: 'Conversation', d: 'We meet at your home, walk the space, and listen. No drawings yet — only questions.' },
    { n: '02', t: 'Design', d: 'Jessica leads the studio through layouts, finishes, and material selections, refined together.' },
    { n: '03', t: 'Build', d: 'Paul Sr. and Jr. lead the bench. Cabinetry built in our shop; installation by the same hands.' },
    { n: '04', t: 'Care', d: 'A walk-through, a season of follow-up, and a relationship that lasts beyond the project.' },
  ];
  return (
    <section style={{ background: '#1B1A17', color: '#F5F1EA', padding: '128px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 80 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Eyebrow num="iii">How we work</Eyebrow>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
              fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em',
              color: '#F5F1EA', margin: 0,
            }}>
              From conversation<br/>
              <em style={{ fontWeight: 400, color: '#C5A47E' }}>to completion.</em>
            </h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
                      borderTop: '1px solid rgba(245,241,234,0.2)' }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              padding: '40px 32px 0 0',
              borderRight: i < steps.length - 1 ? '1px solid rgba(245,241,234,0.2)' : 'none',
              paddingLeft: i > 0 ? 32 : 0,
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 32, color: '#A8804A', fontWeight: 400,
              }}>{s.n}</div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
                fontSize: 26, color: '#F5F1EA', margin: 0, letterSpacing: '-0.01em',
              }}>{s.t}</h3>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.7,
                color: 'rgba(245,241,234,0.7)', margin: 0, fontWeight: 300,
              }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============== TESTIMONIAL ============== */
const Testimonial = () => (
  <section style={{ background: '#EDE6DA', padding: '160px 32px' }}>
    <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        fontSize: 96, color: '#A8804A', lineHeight: 0.6, fontWeight: 300,
      }}>"</div>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: 'clamp(28px, 3vw, 44px)', lineHeight: 1.3,
        letterSpacing: '-0.015em', color: '#1B1A17', margin: 0,
      }}>
        After living through three contractors, finding Raise was a relief.
        They returned every call, drew every option, and built every detail
        the way they said they would.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 16 }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
          color: '#1B1A17', letterSpacing: '0.04em',
        }}>Margaret &amp; Daniel Lawrence</div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
          letterSpacing: '0.28em', textTransform: 'uppercase', color: '#76726A',
        }}>Full Kitchen + Sunroom · 2024</div>
      </div>
    </div>
  </section>
);

/* ============== CTA ============== */
const Cta = ({ onSchedule }) => (
  <section style={{ background: '#F5F1EA', padding: '160px 32px',
                    borderTop: '1px solid #D9D1C2' }}>
    <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
      <Eyebrow num="iv">Begin</Eyebrow>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: 'clamp(48px, 7vw, 104px)', lineHeight: 1.02,
        letterSpacing: '-0.025em', color: '#1B1A17', margin: 0,
        paddingBottom: 8,
      }}>
        Let's draw<br/>
        <em style={{ fontWeight: 400, color: '#A8804A' }}>your space.</em>
      </h2>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        fontSize: 22, lineHeight: 1.5, color: '#4A4842', maxWidth: 540,
      }}>
        A first conversation is always at no cost — at your home, around
        the table you'd like to redesign.
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <Button variant="primary" size="lg" icon onClick={onSchedule}>Schedule a visit</Button>
        <Button variant="ghost" size="lg">Or call (631) 555-0184</Button>
      </div>
    </div>
  </section>
);

/* ============== SCHEDULE FORM PAGE ============== */
const SchedulePage = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section style={{ background: '#F5F1EA', padding: '120px 32px 160px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr', gap: 96 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Eyebrow num="01">Schedule</Eyebrow>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1,
            letterSpacing: '-0.02em', color: '#1B1A17', margin: 0,
          }}>
            Begin with a<br/>
            <em style={{ fontWeight: 400, color: '#A8804A' }}>conversation.</em>
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.75,
            color: '#2B2A26', fontWeight: 300,
          }}>
            We meet at your home — typically 60–90 minutes — to see the
            space, understand how you live in it, and discuss what's
            possible. There's no fee, and no obligation.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            {[
              ['Phone', '(631) 555-0184'],
              ['Email', 'studio@raisedesignbuild.com'],
              ['Service area', 'Suffolk County · Nassau County · The Forks'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr',
                                    gap: 16, paddingBottom: 16, borderBottom: '1px solid #D9D1C2' }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
                  letterSpacing: '0.22em', textTransform: 'uppercase', color: '#76726A',
                }}>{k}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#1B1A17' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={(e)=>{e.preventDefault(); setSubmitted(true);}}
              style={{ background: '#FAF7F2', padding: 48, display: 'flex',
                       flexDirection: 'column', gap: 28, boxShadow: '0 12px 32px rgba(27,26,23,0.06)' }}>
          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '40px 0' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                            fontSize: 48, color: '#A8804A' }}>Thank you.</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#2B2A26', lineHeight: 1.7 }}>
                We've received your note and will respond within one business day —
                usually much sooner.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <Field label="First name" placeholder="Margaret" />
                <Field label="Last name" placeholder="Lawrence" />
                <Field label="Email" placeholder="margaret@example.com" />
                <Field label="Phone" placeholder="(631) 555-0123" />
              </div>
              <SelectField label="Project type"
                options={['Kitchen', 'Bathroom', 'Sunroom', 'Custom millwork', 'Combined / not sure yet']} />
              <Field label="Town" placeholder="Cutchogue, NY" />
              <Textarea label="Tell us about your space"
                placeholder="A 1990s kitchen we'd love to bring up to date — looking for cerused oak and honed marble…" />
              <div style={{ paddingTop: 12 }}>
                <Button variant="primary" size="lg" icon>Send to the studio</Button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

const Field = ({ label, placeholder, type = 'text' }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{
      fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
      letterSpacing: '0.22em', textTransform: 'uppercase', color: '#76726A',
    }}>{label}</span>
    <input type={type} placeholder={placeholder} className="rb-input" style={{
      background: 'transparent', border: 0, borderBottom: '1px solid #1B1A17',
      padding: '10px 0', fontFamily: "'Inter', sans-serif", fontSize: 15,
      color: '#1B1A17', outline: 'none',
    }} />
  </label>
);

const SelectField = ({ label, options }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{
      fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
      letterSpacing: '0.22em', textTransform: 'uppercase', color: '#76726A',
    }}>{label}</span>
    <select className="rb-input" style={{
      background: 'transparent', border: 0, borderBottom: '1px solid #1B1A17',
      padding: '10px 0', fontFamily: "'Inter', sans-serif", fontSize: 15,
      color: '#1B1A17', outline: 'none', appearance: 'none',
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231B1A17' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\")",
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center',
    }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </label>
);

const Textarea = ({ label, placeholder }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{
      fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 500,
      letterSpacing: '0.22em', textTransform: 'uppercase', color: '#76726A',
    }}>{label}</span>
    <textarea rows={4} placeholder={placeholder} style={{
      background: 'transparent', border: 0, borderBottom: '1px solid #1B1A17',
      padding: '10px 0', fontFamily: "'Inter', sans-serif", fontSize: 15,
      color: '#1B1A17', outline: 'none', resize: 'none',
    }} />
  </label>
);

/* Export to window */
Object.assign(window, {
  Logo, Button, Eyebrow, Icon,
  Header, Footer, Hero, EditorialIntro, Services, FeaturedProject,
  Process, Testimonial, Cta, SchedulePage,
});
