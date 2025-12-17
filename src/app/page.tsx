import { supabase } from "@/lib/supabase";
import { createSrvrClient } from "@/lib/supabase-server";
import { UploadButton, LogoutButton } from "./client-nav";
import { SearchBar } from "./search-bar";

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }) {
  const { search, category } = await searchParams;

  let query = supabase.from('apps').select('*').order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data: apps, error } = await query;

  const serverSb = await createSrvrClient()
  const { data: { user } } = await serverSb.auth.getUser()

  if (error) {
    console.error("Error fetching apps", error);
  }

  const allApps = apps || [];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Navbar */}
      <nav className="glass" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '16px 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hena Store</h1>
            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)' }}>
              <a href="/" style={{ color: 'var(--text-primary)' }}>Home</a>
              <a href="#">Apps</a>
              <a href="#">Games</a>
              {user ? (
                <>
                  <a href="/upload" style={{ color: 'var(--accent-secondary)' }}>Upload (Admin)</a>
                  <LogoutButton />
                </>
              ) : (
                <a href="/login" style={{ fontSize: '0.9rem' }}>Login</a>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <SearchBar />
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)' }}></div>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: '100px' }}>
        {/* Hero Section - Only show if NOT searching */}
        {!search && (
          <div className="container" style={{ marginBottom: '60px' }}>
            {allApps.length > 0 ? (
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                height: '400px',
                backgroundImage: 'linear-gradient(to right, #0f0f11, transparent), url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  padding: '40px',
                  maxWidth: '600px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                }}>
                  <span style={{
                    background: 'var(--accent-primary)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'inline-block'
                  }}>FEATURED</span>
                  <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px', lineHeight: 1.1 }}>
                    {allApps[0].title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {allApps[0].description}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <a href={`/app/${allApps[0].id}`} className="btn btn-primary">View Details</a>
                    <button className="btn btn-glass">+ Add to Wishlist</button>
                  </div>
                </div>
              </div>
            ) : (
              allApps.length === 0 && (
                <div style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '400px',
                  backgroundImage: 'linear-gradient(to right, #0f0f11, transparent), url("https://images.unsplash.com/photo-1614726365723-498aa59ce5d1?q=80&w=2000&auto=format&fit=crop")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    padding: '40px',
                    maxWidth: '600px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                  }}>
                    <span style={{
                      background: 'var(--accent-primary)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                      display: 'inline-block'
                    }}>FEATURED</span>
                    <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px', lineHeight: 1.1 }}>Cyber Odyssey</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.1rem' }}>
                      Dive into a futuristic open world. customized your character and explore the neon city.
                    </p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button className="btn btn-primary">Install Now</button>
                      <button className="btn btn-glass">+ Add to Wishlist</button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Categories */}
        <div className="container" style={{ marginBottom: '40px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '10px' }}>
          {['All', 'Action', 'RPG', 'Strategy', 'Puzzle', 'Sports', 'Productivity', 'Social', 'Tools'].map((cat, i) => (
            <a key={i} href={`/?category=${cat}`} className={`btn ${category === cat || (!category && cat === 'All') ? 'btn-glass' : ''}`} style={{
              marginRight: '12px',
              background: (category === cat || (!category && cat === 'All')) ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: (category === cat || (!category && cat === 'All')) ? 'black' : 'var(--text-secondary)',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              {cat}
            </a>
          ))}
        </div>

        {/* Dynamic App Row: All Apps */}
        {allApps.length > 0 ? (
          <Section title={search ? `Results for "${search}"` : "New Arrivals"} apps={allApps} />
        ) : (
          <div className="container" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>No apps found {search ? `matching "${search}"` : 'Upload some apps via the Admin page'}.</p>
          </div>
        )}

        {/* Mock Data Row (to keep the aesthetic while empty) */}
        <Section title="Recommended for you (Mock)" apps={[
          { title: "Task Master", category: "Productivity", rating: 4.8, icon_url: null, color: "linear-gradient(135deg, #FF6B6B, #EE5D5D)" },
          { title: "FitLife Pro", category: "Health", rating: 4.6, icon_url: null, color: "linear-gradient(135deg, #4ECDC4, #556270)" },
          { title: "Neon Racer", category: "Racing", rating: 4.5, icon_url: null, color: "linear-gradient(135deg, #4286f4, #373B44)" },
        ]} />


        <footer style={{ marginTop: '80px', borderTop: '1px solid var(--glass-border)', padding: '60px 0 20px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '60px' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }} className="text-gradient">Hena Store</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The best place to discover and download premium Android applications and games.</p>
              </div>
              <div>
                <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Company</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <a href="#">About Us</a>
                  <a href="#">Careers</a>
                  <a href="#">Blog</a>
                </div>
              </div>
              <div>
                <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Support</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <a href="#">Help Center</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Privacy Policy</a>
                </div>
              </div>
              <div>
                <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Connect</h5>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['Twitter', 'Instagram', 'Discord'].map(social => (
                    <div key={social} className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                      {social[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
              &copy; 2024 Hena App Store. All rights reserved.
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}

function Section({ title, apps }: { title: string, apps: any[] }) {
  return (
    <div className="container" style={{ marginBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{title}</h3>
        <a href="#" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>See all</a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        {apps.map((app, i) => (
          <a key={i} href={`/app/${app.id}`} className="glass" style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            display: 'block'
          }}>
            <div style={{
              width: '100%',
              aspectRatio: '1/1',
              background: app.icon_url ? `url('${app.icon_url}') center/cover` : (app.color || 'var(--bg-tertiary)'),
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}></div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{app.title}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>★ {app.rating}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
