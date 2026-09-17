import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from 'react-router-dom'
import BrandMark from './components/BrandMark'
import { demoContactRequests, demoIdentities } from './data/demoData'
import { auth, db } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { loginUser, logoutUser, registerUser, resetPassword } from './services/auth'
import { createIdentity, listUserIdentities } from './services/identities'
import { generateIdentityPdf } from './services/pdf'
import { generateKinoraId } from './utils/kinora'
import './App.css'

const navigation = [
  { label: 'Search', to: '/search' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
]

const footerLinks = [
  { label: 'Search', to: '/search' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
]

const defaultIdentity = demoIdentities[0]
const relationshipOptions = ['Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Friend', 'Companion', 'Family', 'Partner', 'Other']
const categoryOptions = ['Pet', 'Device', 'Vehicle', 'Personal Item', 'Collectible', 'Other']

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const [user, setUser] = useState(null)
  const [identities, setIdentities] = useState(demoIdentities)
  const [contactRequests] = useState(demoContactRequests)
  const [authReady, setAuthReady] = useState(!auth)

  useEffect(() => {
    if (!auth) return undefined

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (nextUser && db) {
        try {
          setIdentities(await listUserIdentities(nextUser.uid))
        } catch (identityError) {
          console.error(identityError)
        }
      } else {
        setIdentities(demoIdentities)
      }
      setAuthReady(true)
    })
  }, [])

  const handleCreateIdentity = async (newIdentity) => {
    if (user && db) {
      await createIdentity(newIdentity, user.uid)
    }
    setIdentities((current) => [newIdentity, ...current])
  }

  const handleToggleLost = (identityId) => {
    setIdentities((current) =>
      current.map((item) =>
        item.id === identityId ? { ...item, isLost: !item.isLost } : item,
      ),
    )
  }

  const handleLogout = async () => {
    await logoutUser()
  }

  return (
    <div className="app-shell">
      <Header isAuthenticated={Boolean(user)} onLogout={handleLogout} />

      <main className="app-main">
        {!authReady && <div className="container section-block"><p>Loading KINORA...</p></div>}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage identities={identities} />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/identity/:kinoraId" element={<IdentityPage identities={identities} />} />
          <Route path="/login" element={<LoginPage isAuthenticated={Boolean(user)} onAuthenticate={loginUser} />} />
          <Route path="/signup" element={<SignupPage isAuthenticated={Boolean(user)} onAuthenticate={registerUser} />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage onReset={resetPassword} />} />
          <Route path="/dashboard" element={<DashboardPage identities={identities} onToggleLost={handleToggleLost} />} />
          <Route path="/create" element={<CreateIdentityPage onCreate={handleCreateIdentity} />} />
          <Route path="/contact-requests" element={<ContactRequestsPage requests={contactRequests} />} />
          <Route path="/settings" element={<SettingsPage user={user} />} />
          <Route path="/identity/:kinoraId/edit" element={<EditIdentityPage identities={identities} />} />
          <Route path="/identity/:kinoraId/download" element={<DownloadIdentityPage identities={identities} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function Header({ isAuthenticated, onLogout }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="KINORA home">
          <BrandMark className="brand-mark" />
          <span>KINORA</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary">My KINORA</Link>
              <button type="button" className="btn btn-ghost" onClick={onLogout}>Log out</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-secondary">Sign in</Link>
          )}
          <Link to="/create" className="btn btn-primary">Create a KINORA ID</Link>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand-block">
          <div className="brand brand-footer">
            <BrandMark className="brand-mark" />
            <span>KINORA</span>
          </div>
          <p className="footer-tagline">An identity for what matters.</p>
          <p className="footer-copy">A product by XNEON Technologies</p>
          <p className="footer-copy">Founder: Shivansh Ranjan Tripathi</p>
        </div>

        <div className="footer-links">
          {footerLinks.map((item) => (
            <Link key={item.to} to={item.to}>{item.label}</Link>
          ))}
        </div>

        <div className="footer-meta">
          <a href="https://xneon.store/" target="_blank" rel="noreferrer" className="btn btn-secondary btn-small">
            XNEON Technologies
          </a>
        </div>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <section className="hero container section-block">
        <div className="hero-copy">
          <p className="eyebrow">Private digital identity</p>
          <h1>An identity for what matters.</h1>
          <p className="lead">
            Give the pets and things that matter to you a digital identity of their own.
          </p>

          <div className="cta-row">
            <Link to="/create" className="btn btn-primary">Create a KINORA ID</Link>
            <Link to="/search" className="btn btn-secondary">Search a KINORA ID</Link>
          </div>

          <ul className="trust-list">
            <li>Private by default</li>
            <li>Built for belonging</li>
            <li>Not a government identity</li>
          </ul>
        </div>

        <div className="hero-visual">
          <IdentityCard identity={defaultIdentity} />
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <p className="eyebrow">A clearer kind of identity</p>
          <h2>Built for the things people love, keep close, and trust.</h2>
        </div>

        <div className="feature-grid">
          <article className="info-panel">
            <h3>Pets</h3>
            <p>Give a companion a private, lasting identity that can be searched and found.</p>
          </article>
          <article className="info-panel">
            <h3>Devices</h3>
            <p>Keep personal electronics documented without turning them into a registry.</p>
          </article>
          <article className="info-panel">
            <h3>Meaningful objects</h3>
            <p>Recognize personal items, collectibles, and belongings that carry emotional value.</p>
          </article>
        </div>
      </section>

      <section className="container section-block">
        <div className="inline-search-panel">
          <div>
            <p className="eyebrow">Search</p>
            <h2>Search a KINORA ID</h2>
          </div>
          <SearchBar initialValue="KR-7F4A-92KD8M" />
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading narrow">
          <p className="eyebrow">How it works</p>
          <h2>Private by design, simple in practice.</h2>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <span className="step-number">01</span>
            <h3>Create your account</h3>
            <p>Sign up with email and verify your address before creating an identity.</p>
          </article>
          <article className="step-card">
            <span className="step-number">02</span>
            <h3>Give something an identity</h3>
            <p>Add its name, generic type, relationship, and category information.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span>
            <h3>Keep it searchable and available</h3>
            <p>Share only what you choose while keeping private details protected.</p>
          </article>
        </div>
      </section>
    </>
  )
}

function SearchPage({ identities }) {
  return (
    <div className="container section-block narrow-page">
      <div className="section-heading">
        <p className="eyebrow">Public search</p>
        <h2>Search a KINORA ID</h2>
      </div>

      <SearchBar initialValue="" />

      <div className="search-result-shell">
        <IdentityCard identity={identities[0]} compact />
      </div>
    </div>
  )
}

function HowItWorksPage() {
  return (
    <div className="container section-block static-page">
      <div className="section-heading narrow">
        <p className="eyebrow">How it works</p>
        <h2>Make personal identity easy to keep and easy to share.</h2>
      </div>

      <div className="static-grid">
        <article className="content-panel">
          <h3>1. Create your account</h3>
          <p>Use email and password authentication with email verification enabled before you create any identity.</p>
        </article>
        <article className="content-panel">
          <h3>2. Register what matters</h3>
          <p>Choose a category, add its identity details, and decide what is public and what stays private.</p>
        </article>
        <article className="content-panel">
          <h3>3. Receive a permanent KINORA ID</h3>
          <p>Every identity gets a unique random KINORA ID. It is not sequential, not easy to guess, and does not change.</p>
        </article>
        <article className="content-panel">
          <h3>4. Keep it useful</h3>
          <p>Lost mode, contact requests, QR links, and downloadable PDFs help the identity stay practical when it matters most.</p>
        </article>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="container section-block static-page">
      <div className="section-heading narrow">
        <p className="eyebrow">About</p>
        <h2>People build deep bonds with their pets and things.</h2>
      </div>

      <div className="story-block">
        <p>
          KINORA gives meaningful things a private digital identity. It is a product by XNEON Technologies,
          created for people who want to keep a thoughtful, human connection with the things they care about.
        </p>
        <p>
          This is not a government identity, not an ownership registry, and not a surveillance system. It is an
          identity layer designed for privacy, trust, and belonging.
        </p>

        <div className="about-meta">
          <strong>Founder:</strong>
          <span>Shivansh Ranjan Tripathi</span>
        </div>

        <div className="about-meta">
          <strong>Parent technology brand:</strong>
          <a href="https://xneon.store/" target="_blank" rel="noreferrer">XNEON Technologies</a>
        </div>
      </div>
    </div>
  )
}

function PrivacyPage() {
  return (
    <div className="container section-block static-page">
      <div className="section-heading narrow">
        <p className="eyebrow">Privacy</p>
        <h2>Privacy Policy</h2>
      </div>

      <div className="story-block">
        <p>KINORA is privately operated and designed to keep personal information limited to what is necessary.</p>
        <p>Public identity information may include the name, category, generic type, relationship, and KINORA ID.</p>
        <p>Private data such as email addresses, contact preferences, and owner information are kept separate and never exposed to anonymous users.</p>
        <p>Contact requests are reviewed through trusted application logic and the owner email address is never revealed to a visitor.</p>
      </div>
    </div>
  )
}

function TermsPage() {
  return (
    <div className="container section-block static-page">
      <div className="section-heading narrow">
        <p className="eyebrow">Terms</p>
        <h2>Terms of Service</h2>
      </div>

      <div className="story-block">
        <p>KINORA identities are privately issued digital identities and are not government-issued identification documents.</p>
        <p>KINORA does not replace government identity documents and does not act as a legal ownership registry.</p>
        <p>Users remain responsible for the information they register and the accuracy of their contact details.</p>
      </div>
    </div>
  )
}

function IdentityPage({ identities }) {
  const { kinoraId } = useParams()
  const identity = identities.find((item) => item.id === kinoraId) ?? defaultIdentity

  return (
    <div className="container section-block narrow-page">
      <div className="profile-layout">
        <div className="profile-spotlight">
          <div className="profile-avatar">{identity.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="eyebrow">Verified identity</p>
            <h2>{identity.name}</h2>
            <p>{identity.genericName}</p>
            {identity.breed && <p>{identity.breed}</p>}
            <p>{identity.relationship}</p>
            <p>KINORA ID: {identity.id}</p>
            {identity.isLost && <span className="status-highlight">REPORTED LOST</span>}
          </div>
        </div>

        <aside className="profile-actions panel-box">
          <Link to="/contact-requests" className="btn btn-primary btn-block">Contact Registered Person</Link>
          <Link to="/dashboard" className="btn btn-secondary btn-block">Back to dashboard</Link>
        </aside>
      </div>
    </div>
  )
}

function LoginPage({ isAuthenticated, onAuthenticate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await onAuthenticate(email, password)
    } catch (authError) {
      setError(authError.message || 'Unable to log in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) {
    return (
      <div className="container section-block narrow-page">
        <div className="panel-box">
          <h2>You are already signed in.</h2>
          <Link to="/dashboard" className="btn btn-primary">Open dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section-block narrow-page">
      <div className="panel-box auth-box">
        <div className="section-heading compact">
          <p className="eyebrow">Access</p>
          <h2>Log in</h2>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log in'}</button>
          <div className="auth-links">
            <Link to="/forgot-password">Forgot password</Link>
            <Link to="/signup">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function SignupPage({ isAuthenticated, onAuthenticate }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await onAuthenticate({ name: formData.name, email: formData.email, password: formData.password })
    } catch (authError) {
      setError(authError.message || 'Unable to create the account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) {
    return (
      <div className="container section-block narrow-page">
        <div className="panel-box">
          <h2>Your account is active.</h2>
          <Link to="/dashboard" className="btn btn-primary">Continue</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section-block narrow-page">
      <div className="panel-box auth-box">
        <div className="section-heading compact">
          <p className="eyebrow">Create account</p>
          <h2>Sign up</h2>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" value={formData.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Your name" required />
          </label>
          <label>
            Email
            <input type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" value={formData.password} onChange={(event) => updateField('password', event.target.value)} placeholder="••••••••" minLength="8" required />
          </label>
          <label>
            Confirm Password
            <input type="password" value={formData.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} placeholder="Confirm password" minLength="8" required />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</button>
          <div className="auth-links">
            <Link to="/login">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function VerifyEmailPage() {
  return (
    <div className="container section-block narrow-page">
      <div className="panel-box">
        <p className="eyebrow">Verification</p>
        <h2>Check your email</h2>
        <p>Please verify your email address before creating a KINORA identity.</p>
        <Link to="/dashboard" className="btn btn-primary">Continue</Link>
      </div>
    </div>
  )
}

function ForgotPasswordPage({ onReset }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    try {
      await onReset(email)
      setMessage('If an account exists for that email, a reset link has been sent.')
    } catch (resetError) {
      setError(resetError.message || 'Unable to send a reset link.')
    }
  }

  return (
    <div className="container section-block narrow-page">
      <div className="panel-box auth-box">
        <div className="section-heading compact">
          <p className="eyebrow">Reset access</p>
          <h2>Forgot password</h2>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </label>
          {message && <p role="status">{message}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary">Send reset link</button>
        </form>
      </div>
    </div>
  )
}

function DashboardPage({ identities, onToggleLost }) {
  return (
    <div className="container section-block narrow-page">
      <div className="dashboard-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>My KINORA</h2>
        </div>
        <Link to="/create" className="btn btn-primary">+ Create Identity</Link>
      </div>

      <div className="dashboard-grid">
        {identities.map((identity) => (
          <article key={identity.id} className="dashboard-card panel-box">
            <div className="dashboard-card__top">
              <div className="mini-avatar">{identity.name.charAt(0).toUpperCase()}</div>
              <div>
                <h3>{identity.name}</h3>
                <p>{identity.genericName}</p>
                <p>{identity.breed || identity.model || identity.category}</p>
              </div>
            </div>
            <div className="dashboard-card__meta">
              <span>{identity.relationship}</span>
              <span>{identity.id}</span>
            </div>

            <div className="dashboard-actions">
              <Link to={`/identity/${identity.id}`} className="btn btn-secondary btn-small">View</Link>
              <Link to={`/identity/${identity.id}/edit`} className="btn btn-secondary btn-small">Edit</Link>
              <Link to={`/identity/${identity.id}/download`} className="btn btn-secondary btn-small">Download</Link>
              <button type="button" className="btn btn-secondary btn-small" onClick={() => onToggleLost(identity.id)}>
                {identity.isLost ? 'Mark as Found' : 'Report Lost'}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="panel-box narrow-box">
        <div className="section-heading compact">
          <p className="eyebrow">Contact requests</p>
          <h3>Recent requests</h3>
        </div>
        <div className="request-list">
          {demoContactRequests.map((request) => (
            <div key={request.id} className="request-item">
              <strong>{request.senderName}</strong>
              <span>{request.identityId}</span>
              <small>{request.status}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CreateIdentityPage({ onCreate }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    category: 'Pet',
    name: 'Bruno',
    genericName: 'Dog',
    relationship: 'Brother',
    breed: 'German Shepherd',
    brand: '',
    model: '',
    description: '',
    photo: '',
  })

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const generatedId = useMemo(() => generateKinoraId(), [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const identity = {
      id: generatedId,
      name: formData.name || 'Unnamed identity',
      genericName: formData.genericName || formData.category,
      category: formData.category,
      relationship: formData.relationship,
      breed: formData.breed || '',
      model: formData.model || '',
      photoUrl: formData.photo || '',
      isLost: false,
      verified: true,
      createdBy: 'Owner',
    }

    onCreate(identity)
    setCurrentStep(9)
  }

  return (
    <div className="container section-block narrow-page">
      <div className="section-heading compact">
        <p className="eyebrow">Create identity</p>
        <h2>Give something a KINORA identity</h2>
      </div>

      <div className="progress-bar" aria-label="Create identity progress">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
          <span key={step} className={step <= currentStep ? 'active' : ''} />
        ))}
      </div>

      <form className="form-stack panel-box" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <fieldset>
            <legend>Choose category</legend>
            <div className="choice-grid">
              {categoryOptions.map((item) => (
                <button type="button" key={item} className={`choice-pill ${formData.category === item ? 'selected' : ''}`} onClick={() => { updateField('category', item); setCurrentStep(2) }}>
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {currentStep === 2 && (
          <label>
            Name
            <input value={formData.name} onChange={(event) => updateField('name', event.target.value)} />
          </label>
        )}

        {currentStep === 3 && (
          <label>
            Generic Name
            <input value={formData.genericName} onChange={(event) => updateField('genericName', event.target.value)} />
          </label>
        )}

        {currentStep === 4 && (
          <fieldset>
            <legend>Relationship</legend>
            <div className="choice-grid">
              {relationshipOptions.map((item) => (
                <button type="button" key={item} className={`choice-pill ${formData.relationship === item ? 'selected' : ''}`} onClick={() => { updateField('relationship', item); setCurrentStep(5) }}>
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {currentStep === 5 && (
          <>
            {formData.category === 'Pet' && (
              <>
                <label>
                  Species
                  <input value={formData.genericName} onChange={(event) => updateField('genericName', event.target.value)} />
                </label>
                <label>
                  Breed
                  <input value={formData.breed} onChange={(event) => updateField('breed', event.target.value)} />
                </label>
              </>
            )}

            {(formData.category === 'Device' || formData.category === 'Vehicle') && (
              <>
                <label>
                  Brand
                  <input value={formData.brand} onChange={(event) => updateField('brand', event.target.value)} />
                </label>
                <label>
                  Model
                  <input value={formData.model} onChange={(event) => updateField('model', event.target.value)} />
                </label>
              </>
            )}

            {formData.category === 'Other' && (
              <label>
                Description
                <textarea rows="4" value={formData.description} onChange={(event) => updateField('description', event.target.value)} />
              </label>
            )}
          </>
        )}

        {currentStep === 6 && (
          <label>
            Photo (optional)
            <input type="url" value={formData.photo} onChange={(event) => updateField('photo', event.target.value)} placeholder="https://..." />
          </label>
        )}

        {currentStep === 7 && (
          <fieldset>
            <legend>Public information settings</legend>
            <label className="check-row"><input type="checkbox" defaultChecked /> Show name publicly</label>
            <label className="check-row"><input type="checkbox" defaultChecked /> Show relationship publicly</label>
            <label className="check-row"><input type="checkbox" defaultChecked /> Show category publicly</label>
            <label className="check-row"><input type="checkbox" /> Keep contact private</label>
          </fieldset>
        )}

        {currentStep === 8 && (
          <div className="review-box">
            <h3>Preview</h3>
            <IdentityCard identity={{ ...formData, id: generatedId, isLost: false, category: formData.category, relationship: formData.relationship }} compact />
          </div>
        )}

        {currentStep === 9 && (
          <div className="success-state">
            <h3>Ready to create</h3>
            <p>Your KINORA ID will be generated automatically: {generatedId}</p>
            <button type="submit" className="btn btn-primary">Create KINORA Identity</button>
          </div>
        )}

        {currentStep < 9 && (
          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep((value) => value - 1)}>Back</button>
            )}
            <button type="button" className="btn btn-primary" onClick={() => setCurrentStep((value) => Math.min(value + 1, 9))}>
              Continue
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

function ContactRequestsPage({ requests }) {
  return (
    <div className="container section-block narrow-page">
      <div className="section-heading compact">
        <p className="eyebrow">Inbox</p>
        <h2>Contact requests</h2>
      </div>

      <div className="request-stack panel-box">
        {requests.map((request) => (
          <article key={request.id} className="request-card">
            <div>
              <strong>{request.senderName}</strong>
              <p>{request.message}</p>
            </div>
            <div className="request-meta">
              <span>{request.identityId}</span>
              <small>{request.status}</small>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function SettingsPage({ user }) {
  const account = user ?? { name: '', email: '' }

  return (
    <div className="container section-block narrow-page">
      <div className="section-heading compact">
        <p className="eyebrow">Settings</p>
        <h2>Account</h2>
      </div>

      <div className="panel-box form-stack">
        <label>
          Name
          <input type="text" value={account.name || ''} readOnly />
        </label>
        <label>
          Email
          <input type="email" value={account.email || ''} readOnly />
        </label>
        <label>
          Verification
          <input type="text" value="Verified" readOnly />
        </label>
      </div>
    </div>
  )
}

function EditIdentityPage({ identities }) {
  const { kinoraId } = useParams()
  const identity = identities.find((item) => item.id === kinoraId) ?? defaultIdentity

  return (
    <div className="container section-block narrow-page">
      <div className="section-heading compact">
        <p className="eyebrow">Edit</p>
        <h2>Edit {identity.name}</h2>
      </div>

      <div className="panel-box form-stack">
        <label>
          Name
          <input type="text" value={identity.name} />
        </label>
        <label>
          Generic Name
          <input type="text" value={identity.genericName} />
        </label>
        <label>
          Relationship
          <input type="text" value={identity.relationship} />
        </label>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  )
}

function DownloadIdentityPage({ identities }) {
  const { kinoraId } = useParams()
  const identity = identities.find((item) => item.id === kinoraId) ?? defaultIdentity
  const [error, setError] = useState('')

  const handleDownload = async () => {
    setError('')
    try {
      await generateIdentityPdf(identity)
    } catch (downloadError) {
      setError(downloadError.message || 'Unable to generate the PDF.')
    }
  }

  return (
    <div className="container section-block narrow-page">
      <div className="panel-box">
        <p className="eyebrow">Download</p>
        <h2>Preparing your KINORA ID</h2>
        <p>Privately issued digital identity. Not a government-issued identification document.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="button" className="btn btn-primary" onClick={handleDownload}>Download PDF</button>
        <Link to={`/identity/${identity.id}`} className="btn btn-secondary">Open identity</Link>
      </div>
    </div>
  )
}

function SearchBar({ initialValue = '' }) {
  const [value, setValue] = useState(initialValue)

  return (
    <form className="search-form">
      <label className="sr-only" htmlFor="kinora-search">KINORA ID</label>
      <input
        id="kinora-search"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter KINORA ID"
      />
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  )
}

function IdentityCard({ identity, compact = false }) {
  const initials = identity.name ? identity.name.charAt(0).toUpperCase() : 'K'

  return (
    <article className={`identity-card ${compact ? 'identity-card--compact' : ''}`}>
      <div className="identity-card__head">
        <div>
          <p className="eyebrow card-eyebrow">KINORA ID</p>
          <strong>{identity.id}</strong>
        </div>
        <span className={`status-badge ${identity.isLost ? 'lost' : 'verified'}`}>
          {identity.isLost ? 'REPORTED LOST' : 'Verified Identity'}
        </span>
      </div>

      <div className="identity-card__body">
        <div className="avatar">{initials}</div>
        <div>
          <h3>{identity.name}</h3>
          <p>{identity.genericName}</p>
          {identity.breed ? <p>{identity.breed}</p> : null}
        </div>
      </div>

      <div className="identity-card__meta">
        <span>{identity.relationship}</span>
        <span>{identity.category}</span>
      </div>
    </article>
  )
}

export default App
