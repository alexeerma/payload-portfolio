'use client'

import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'

type ContactInfo = {
  availability?: string | null
  email?: string | null
  location?: string | null
  name?: string | null
  resumeUrl?: string | null
  siteName?: string | null
  socialLinks?: Array<{ id?: string | null; label: string; url: string }> | null
}

type ContactOverlayProps = {
  contact: ContactInfo
}

export function ContactOverlay({ contact }: ContactOverlayProps) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = data.get('name') as string
    const email = data.get('email') as string
    const message = data.get('message') as string
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:${contact.email || ''}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const overlay = open ? (
    <div
      className="overlay-backdrop"
      onClick={(e) => { if (e.target === backdropRef.current) setOpen(false) }}
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Contact"
    >
      <div className="overlay-panel">
        <button
          aria-label="Close contact"
          className="overlay-close"
          onClick={() => setOpen(false)}
          type="button"
        >
          ✕
        </button>

        <div className="overlay-info">
          <p className="eyebrow">Get in touch</p>
          <h2>{contact.name || 'Say hello'}</h2>
          <p>{contact.availability}</p>

          <div className="overlay-meta">
            {contact.location && (
              <div className="overlay-meta-item">
                <span>Location</span>
                <strong>{contact.location}</strong>
              </div>
            )}
            {contact.email && (
              <div className="overlay-meta-item">
                <span>Email</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            )}
            {contact.siteName && (
              <div className="overlay-meta-item">
                <span>Studio</span>
                <strong>{contact.siteName}</strong>
              </div>
            )}
          </div>

          {(contact.socialLinks?.length || contact.resumeUrl) && (
            <div className="overlay-links">
              {contact.resumeUrl && (
                <a href={contact.resumeUrl} rel="noreferrer" target="_blank">Resume</a>
              )}
              {contact.socialLinks?.map((link) => (
                <a href={link.url} key={link.id ?? link.url} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="overlay-form-wrap">
          {sent ? (
            <div className="overlay-sent">
              <p className="eyebrow">Message ready</p>
              <h3>Your mail client should have opened.</h3>
              <p>If nothing happened, email me directly at <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
              <button onClick={() => { setSent(false); setOpen(false) }} type="button">Close</button>
            </div>
          ) : (
            <form className="overlay-form" onSubmit={handleSubmit} noValidate>
              <p className="eyebrow">Send a message</p>
              <div className="form-field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" placeholder="Your name" required type="text" />
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" placeholder="you@example.com" required type="email" />
              </div>
              <div className="form-field">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" placeholder="Tell me about your project…" required rows={5} />
              </div>
              <button className="form-submit" type="submit">Send message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <button className="contact-trigger" onClick={() => setOpen(true)} type="button">
        Contact
      </button>
      {typeof document !== 'undefined' && createPortal(overlay, document.body)}
    </>
  )
}
