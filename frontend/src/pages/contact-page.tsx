export function ContactPage() {
  return (
    <section className="section">
      <div className="container grid grid-2">
        <div className="surface jp-reveal-up" style={{ padding: "1.5rem" }}>
          <div className="eyebrow">Contact</div>
          <h1 className="headline" style={{ fontSize: "2.5rem", margin: "0.4rem 0" }}>Talk to the JobPlus team.</h1>
          <p className="helper">Use this page for support, employer onboarding questions, or partnership requests.</p>
        </div>
        <div className="surface jp-reveal-up" style={{ padding: "1.5rem" }}>
          <div className="stack">
            <div className="field">
              <label>Name</label>
              <input className="input" placeholder="Your name" />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea className="textarea" placeholder="How can we help?" />
            </div>
            <button className="btn btn-primary">Send message</button>
          </div>
        </div>
      </div>
    </section>
  );
}
