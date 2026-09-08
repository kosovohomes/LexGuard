# Product Requirements Document (PRD)
## LexGuard — Client-Side Attorney Accountability & Case Documentation Platform
### Jurisdictions: Texas (TX) and California (CA) — Phase 1

| Field | Value |
|---|---|
| Document version | 1.0 |
| Date | 2026-09-09 |
| Status | Draft for review |
| Product codename | LexGuard (working name) |
| Document type | Full PRD |
| Phase 1 jurisdictions | Texas, California (USA) |

---

## 1. Executive Summary

LexGuard is a **client-side, lawyer-free** web application that helps individuals who are dealing with (or have dealt with) an attorney to:

1. **Understand their rights** as legal clients in plain language, specific to their state (TX/CA).
2. **Document everything** — communications, payments, promises, documents, deadlines — in a structured, timestamped case journal.
3. **Detect potential misconduct patterns** through a neutral, rules-based red-flag engine that compares the client's facts against the Rules of Professional Conduct.
4. **Act** — by generating a complaint-ready evidence dossier and routing the user to the correct remedy channel (state bar discipline, Client Security Fund, fee arbitration/mediation, malpractice referral).

The product never requires lawyer participation, never publishes named accusations, and positions itself as a documentation-and-education tool — not an advocacy or rating platform. Its power comes from making scattered, under-documented victim complaints into precise, evidence-backed filings.

**Core thesis:** In the US, the machinery to hold corrupt attorneys accountable already exists (state bar discipline, Client Security Funds, fee arbitration). It fails mainly because victims don't know it exists and file vague, undocumented complaints. LexGuard fixes the information and documentation gap.

---

## 2. Problem Statement

### 2.1 The problem
- A minority of attorneys cause serious, documented harm: theft of client funds (the leading cause of disbarment), abandonment of cases, failure to communicate, unreasonable fees, settling without client authority.
- Victims are typically people at their most vulnerable (criminal charges, family law, personal injury, immigration) and least equipped to navigate accountability systems.
- Most victims do not know: that they own their complete client file; that every state maintains a Client Security Fund that can reimburse stolen money; that bar discipline exists; that fee disputes can go to free arbitration/mediation.
- Complaints that do get filed are often vague, late, or undocumented, and are dismissed.
- Victims feel isolated ("it's just me") and lawyers with patterns of misconduct face only scattered, individual complaints.

### 2.2 Evidence for the gap (verified, see Appendix B)
- Texas's Client Security Fund holds $3M+ and pays victims of lawyer theft — but requires the victim to have filed a grievance first (unless the lawyer is already disbarred/deceased), and applications must be filed within 18 months of the disciplinary judgment. Most victims miss these windows because they don't know they exist.
- California's Client Security Fund reimburses up to **$100,000** per claim for losses on/after Jan 1, 2009 — yet requires (in practice) a filed State Bar complaint, has a 4-year filing window from discovery, and excludes negligence/malpractice losses. Awareness among the general public is near zero.
- Signing a Texas grievance form **waives attorney-client privilege** for the subject matter — a fact every complainant should know before filing, and almost none do.

### 2.3 Why now
- Consumer legal-tech is mature and normalized.
- State bars are under public pressure to demonstrate consumer protection (CA's State Bar has been under sunset-review scrutiny repeatedly).
- Web technology (secure document storage, PDF generation, rules engines) makes a credible MVP cheap to build.

---

## 3. Vision & Guiding Principles

**Vision:** No client should be harmed by attorney misconduct without knowing their rights, without a documented record, and without a clear path to the remedy channel that fits their harm.

**Principles (binding on all features and content):**
1. **Neutral, professional, respectful tone at all times.** We describe facts and rules. We never call any lawyer "corrupt," "fraudulent," or "criminal." The platform says: "These facts may indicate a violation of Rule X; you may wish to consult..."
2. **No named public accusations.** The platform never displays attorney names publicly, never hosts a "wall of shame," and never allows user-generated public reviews in Phase 1.
3. **Education first, action second.** The user must always understand what a channel can and cannot do before we route them to it (e.g., Client Security Funds do NOT pay for malpractice or fee disputes).
4. **The client owns their data.** Full export, full deletion, at any time.
5. **No legal advice.** Everything is legal *information* with clear disclaimers. Where advice would be needed, we refer out (legal aid, bar referral services).
6. **Do no harm.** Safety features (quick exit, discreet mode) because users may share devices with abusers in family-law contexts.

---

## 4. Goals, Non-Goals, Success Criteria

### 4.1 Goals (Phase 1, 12 months)
- G1: Launch TX + CA educational content + case journal + dossier export (web app).
- G2: Achieve 5,000 registered users across TX/CA; 1,500 with at least one active case journal.
- G3: 300 generated dossiers; 100 self-reported filings (bar complaint / CSF / arbitration) via follow-up survey.
- G4: Establish at least 2 institutional partnerships (legal aid org, law school clinic, or bar consumer-protection arm).
- G5: Zero material legal incidents (defamation claims, data breaches, regulator actions).

### 4.2 Non-Goals (explicitly out of scope for Phase 1)
- Lawyer-facing features or any lawyer participation.
- Public directories, ratings, or reviews of named attorneys.
- Any promise of outcomes ("we will get your money back").
- Case-management workflow for active litigation strategy (we document; we do not litigate).
- Mobile native apps (responsive web only in Phase 1).
- States other than TX and CA.
- Automated malpractice-demand letter generation (legal-advice risk; deferred).
- Handling of active federal matters (immigration courts, federal criminal) beyond generic documentation — scope creep and specialized risk.

### 4.3 Success metrics (see §14).

---

## 5. Personas

| Persona | Description | Key needs |
|---|---|---|
| **P1 "Maria"** | TX, family-law client. Her lawyer stopped returning calls 3 months ago; she fears deadlines were missed. Limited English (ES primary). | Plain-language ES content; communication log; "what happens now" clarity; quick-exit safety. |
| **P2 "James"** | CA, personal-injury client. Settlement money passed through the attorney's trust account; the attorney keeps delaying disbursement. | Money/trust tracking; red-flag engine (Rule 1.15 / CA Rule 4-100); CSF route education. |
| **P3 "Denise"** | TX, small-business owner. Disputes a $14,000 bill; work billed was never done. | Fee agreement storage; billing log; fee reasonableness info; fee-dispute channel routing (not CSF — CSF excludes fee disputes). |
| **P4 "Ahmed"** | CA, former client of a lawyer now disbarred in another matter. His retainer was never returned. | Deadlines (4-year CSF window from discovery); step-by-step CSF application checklist. |
| **P5 "Rosa"** | TX, domestic-violence survivor in custody case; shares a device with her ex-spouse's circle. | Discreet mode, quick exit, neutral app naming, no email subjects that reveal content. |
| **P6 "Advocate"** | Staff at a legal-aid org or law school clinic. | Ability to help a client use the tool; export clean dossiers; aggregate anonymized statistics. |

---

## 6. Key User Flows

### 6.1 Flow A — Onboarding & education
1. User lands on state selector (or geo-detected) → TX or CA.
2. Chooses "I am currently dealing with a lawyer" / "I had a problem with a lawyer in the past" / "I want to learn my rights first."
3. Reads "Your Rights as a Client" guide (state-specific, plain language, ES available).
4. Optional account creation (email + password, or anonymous local mode — see §9.4).

**Acceptance criteria:** A first-time user can reach actionable state-specific rights content in ≤ 3 clicks; reading level ≤ grade 8; ES parity for all core content.

### 6.2 Flow B — Case journal
1. Create a case: attorney name (private), law firm, case type (family, PI, criminal-defense, immigration, probate, other), dates of engagement.
2. Log entries into categories:
   - **Communication log:** date/time, channel (call/email/text/letter/in-person), what you asked, what was said/promised, response time. Free text + structured fields.
   - **Money log:** payments made (amount, date, method, receipt upload), retainer/fee agreement (upload), invoices received (upload + parsed line items).
   - **Documents vault:** uploads (PDF/JPG/PNG/email exports), tagged by type (contract, invoice, court document, correspondence).
   - **Timeline:** auto-computed merged chronology of all entries; user can annotate.
   - **Promises & expectations:** what the lawyer said would happen and by when; whether it did.
3. Every entry is timestamped on creation (immutable audit trail).

**Acceptance criteria:** User can create a complete money trail (payment → invoice → agreement) in under 10 minutes; uploads up to 25MB per file, 500MB per case (Phase 1 limits); timeline renders chronologically with filtering by category and date range.

### 6.3 Flow C — Red-flag detection
1. Engine evaluates journal facts against the red-flag rule library (§8).
2. Output is a **neutral observations panel**, e.g.:
   - "You logged 6 attempts to contact your attorney over 45 days with no response. In Texas, Rule 1.03 of the Disciplinary Rules requires a lawyer to keep a client reasonably informed. Many complaints to the disciplinary system concern communication."
   - "A settlement amount was logged as received by the attorney 60+ days ago, and no disbursement to you has been logged. Lawyers in California must hold client funds in a trust account (Rule 4-100). Delayed disbursement of settlement funds is a frequent subject of discipline."
3. Each observation links to: the relevant rule (plain-language summary), the remedy channels that apply, and a pre-checklist of what evidence would strengthen a complaint.

**Acceptance criteria:** Every observation must (a) cite the rule, (b) use conditional non-accusatory language, (c) state which channels it does and does not map to. No observation may render legal conclusions ("your lawyer violated X"); it renders "facts consistent with a possible issue under Rule X."

### 6.4 Flow D — Remedy router
A guided questionnaire maps the user's situation to channel(s):
- **Discipline complaint** (TX: Chief Disciplinary Counsel via cdc.texasbar.com; CA: State Bar complaint form / Intake Unit).
- **Client Security Fund** (TX: requires grievance first, 18-month window after disciplinary judgment; CA: up to $100k, 4-year window from discovery).
- **Fee dispute** (TX: CAAP — Client-Attorney Assistance Program, voluntary mediation, available when a grievance is dismissed; CA: local bar association mandatory fee arbitration programs).
- **Malpractice civil claim** (informational only: statute-of-limitations warning + referral to legal aid/bar referral).

The router **explicitly warns** about limits: e.g., "Client Security Funds do not reimburse losses caused by negligence or malpractice, interest, or consequential damages" (CA); "The Fund does not address malpractice, fee disputes, or dissatisfaction with outcomes" (TX).

**Acceptance criteria:** Router output includes correct forms/links, deadlines, what evidence to attach, and what the process looks like (incl. TX privilege-waiver warning at the moment of filing a grievance, not before).

### 6.5 Flow E — Dossier generation & export
One-click generation of a PDF dossier:
- Cover page: case summary, parties (user's name optional/withhold), attorney and firm (as recorded by user).
- Section 1: Chronological timeline (all logged events).
- Section 2: Money trail (table + receipt thumbnails).
- Section 3: Communications summary (contact attempts, response gaps).
- Section 4: Red-flag observations (neutral wording).
- Section 5: Document index (filenames, dates, descriptions) — documents attached as appendix if user selects them.
- Section 6: Draft complaint narrative: first-person, factual, chronological — generated from structured data, fully editable by the user before use.

**Acceptance criteria:** Dossier PDF is generated in < 30 seconds for a case with ≤ 200 entries and ≤ 100 documents; user can regenerate at any time; PDF metadata scrubbed of platform branding that could prejudice (optional "unbranded export").

---

## 7. Functional Requirements (detailed)

### 7.1 FR-1 Content Management (Guides)
- **FR-1.1** State-scoped content: every guide is tagged to TX or CA; no generic-US content that contradicts state specifics.
- **FR-1.2** Guide library, Phase 1 minimum set:
  1. "Your Rights as a Legal Client" (state version)
  2. "You Are Entitled to Your File" (Rule 1.16(d); TX/CA equivalents) — incl. a template request letter
  3. "How Attorneys Must Handle Your Money" (trust accounts, retainer refunds)
  4. "Understanding Your Fee Agreement" (contingency vs. hourly vs. flat; fee reasonableness factors)
  5. "How to Fire Your Lawyer and Protect Yourself" (incl. getting the file, deadlines at risk, substitution of counsel basics)
  6. "The Discipline System Explained" (how the state bar investigates; realistic timelines; what discipline can and cannot do)
  7. "Client Security Funds: Getting Stolen Money Back" (state-specific eligibility, windows, exclusions)
  8. "Fee Disputes: Arbitration and Mediation"
  9. "When It Might Be Malpractice" (informational + referral only)
  10. "Warning Signs Checklist" (neutral red-flag descriptions)
- **FR-1.3** Bilingual: English + Spanish for all 10 guides; RTL not required in Phase 1.
- **FR-1.4** Reading level ≤ grade 8 (verified with readability tooling); legal terms defined inline.
- **FR-1.5** Every guide displays "last reviewed" date + reviewer (attorney volunteer or legal-aid partner).

### 7.2 FR-2 Case Journal
- **FR-2.1** Multi-case support (a user may have several attorneys/cases).
- **FR-2.2** Entry types: communication, payment, document, promise, note, deadline.
- **FR-2.3** Immutable timestamping on entry creation; edits create a visible "edited" marker (audit integrity for later evidentiary use).
- **FR-2.4** Document upload with OCR-extracted text (searchable vault); virus scanning on upload.
- **FR-2.5** Auto-reminders: user-set deadlines (e.g., "court date," "filing deadline," "follow up if no response in 14 days").
- **FR-2.6** Quick-log: one-screen fast entry for mobile (voice-note-to-text optional Phase 2).

### 7.3 FR-3 Red-Flag Rules Engine
- **FR-3.1** Declarative rule format (JSON/YAML) so non-engineers (lawyer volunteers) can author rules: trigger conditions over journal facts → observation text + rule citations + channel mapping.
- **FR-3.2** Phase 1 library: minimum 20 rules (see §8).
- **FR-3.3** Rules versioned; dossier records which rule version produced each observation (auditability).
- **FR-3.4** Engine output reviewed by a licensed attorney (TX + CA volunteers) before rules go live — documented sign-off stored.

### 7.4 FR-4 Remedy Router
- **FR-4.1** Decision tree per state with full channel metadata (deadlines, prerequisites, exclusions, links/forms, realistic timeline expectations).
- **FR-4.2** TX-specific: grievance via Chief Disciplinary Counsel (cdc.texasbar.com); privilege-waiver warning on grievance signing; CAAP mediation on dismissal.
- **FR-4.3** CA-specific: State Bar online complaint (available in multiple languages); CSF application window (4 years from discovery); superior-court review within 90 days of final decision.
- **FR-4.4** Output: personalized checklist + pre-filled narrative draft + links.

### 7.5 FR-5 Dossier & Export
- **FR-5.1** PDF generation per §6.5.
- **FR-5.2** JSON export (full data portability).
- **FR-5.3** "Unbranded export" toggle.
- **FR-5.4** Print-friendly formatting (many users will print for court/clinic visits).

### 7.6 FR-6 Safety & Discretion
- **FR-6.1** Quick-exit button (persistent on all screens) → instantly jumps to a neutral site (weather/news).
- **FR-6.2** Discreet mode: neutral app title in browser tab, no sensitive terms in email subject lines (subject: "Your account update" — never "Your attorney complaint").
- **FR-6.3** Optional PIN lock / session timeout.

### 7.7 FR-7 Referral Directory (lightweight)
- Static, vetted listings only: legal aid orgs (LSC grantees), state bar lawyer referral services, law school clinics, victim-compensation programs. No paid placement in Phase 1.

### 7.8 FR-8 Admin Panel (internal)
- Content management (guides, rules), user support tooling (account recovery, data export on request), abuse/flag review, analytics dashboard (aggregate only), rule sign-off workflow.

---

## 8. Red-Flag Rule Library (Phase 1, minimum 20 rules)

Each rule maps facts → Rules of Professional Conduct citations:

**Trust/money (most severe):**
1. Settlement received by attorney, no client disbursement logged within 30/60/90 days → TX Rule 1.14(b) / CA Rule 4-100; channel: discipline + CSF.
2. Retainer paid, minimal/no work logged, no refund on termination → unearned fee; TX CSF explicitly covers "failure to refund fees when no services performed"; CA CSF covers "failure to refund fees when the lawyer performed no services."
3. Cash payments requested without receipts; checks written to attorney personally for client expenses → trust-account concern.
4. Invoice line items that duplicate or describe work never logged in communications → fee reasonableness; TX Rule 1.04 / CA Rule 4-200.

**Diligence/abandonment:**
5. No substantive communication logged for 30+ days after repeated attempts → TX Rule 1.03 / CA Rule 1.4.
6. Court deadline or hearing date passed with no logged preparation or appearance → TX Rule 1.01 / CA Rule 1.3.
7. Attorney fails to appear at a scheduled event (user logs it) → immediate high-severity observation.
8. Case "dormant" > 90 days with no filings logged → abandonment pattern.

**Communication:**
9. Repeated calls/emails (> 3 logged attempts) with zero response in 14 days → communication rule.
10. Lawyer communicates only via paralegal/refuses direct contact despite client request → informed-consent rule (TX 1.03(b)/CA 1.4).

**Authority/conflict:**
11. Settlement terms logged as accepted without user's logged authorization → TX Rule 1.02 / CA Rule 1.2.
12. Lawyer refuses to return file after termination → Rule 1.16(d).
13. Lawyer represents opposing side or former opposing party in same matter → conflict rules (TX 1.06 / CA Rule 1.7) — "facts to raise with the bar."

**Fees:**
14. Fee exceeds agreement without logged explanation → fee rule.
15. Contingency percentage higher than logged agreement → fee rule.
16. Billing for clearly personal/unrelated tasks → fee reasonableness.
17. Vague "administrative fees" not in agreement → fee rule.

**Other:**
18. Lawyer asks client to lie to a court/insurer → mandatory-reporting info (serious crime/fraud).
19. Guarantee of outcome logged (outcome promises are prohibited solicitation/communication issues) → TX 7.02/CA 7.1 territory.
20. Missing/written-after-the-fact fee agreement where one is required → CA Rule 4-200 / TX 1.04 requirements.

**Rule governance:** each rule has: ID, title, state applicability, trigger logic, observation template (neutral), citations, channel mapping, severity tier, attorney-review sign-off, effective dates.

---

## 9. Non-Functional Requirements

### 9.1 Security
- Encryption in transit (TLS 1.3) and at rest (AES-256).
- Documents stored in isolated per-user encrypted storage (object storage with per-user keys).
- Optional client-side encryption (zero-knowledge mode) in Phase 2; Phase 1 standard server-side encryption + strict access controls.
- OWASP ASVS Level 2 as the security baseline; annual third-party penetration test before public launch.
- No third-party analytics trackers on authenticated pages; no ad networks, ever.

### 9.2 Privacy
- Privacy policy + terms reviewed by an attorney (media/privacy law) before launch.
- Collect minimum PII; separate identity data from case content where feasible.
- Deletion on request (full erasure within 30 days, backups purged on rotation).
- No sale of data — written into the privacy policy permanently.
- COPPA: not directed at children; age gate (16+) at signup with neutral wording.
- CCPA/CPRA compliance (CA users): access, deletion, portability rights implemented natively.
- Texas Data Privacy and Security Act (TDPSA) compliance (TX users).

### 9.3 Reliability & Performance
- 99.5% uptime target; status page.
- PDF generation < 30s (§6.5); page loads < 2s (P75) on 4G.
- Responsive web (mobile-first), WCAG 2.1 AA accessibility (this audience disproportionately needs accessibility).

### 9.4 Anonymity & trust modes
- **Mode A (standard):** email account, cloud storage.
- **Mode B (anonymous local):** no account; data stored in browser local storage; export to user-owned cloud (Google Drive/Dropbox) via OAuth; clear warnings about device sharing; quick-exit mandatory in this mode.
- Mode B addresses the safety persona (P5) and users who fear lawyers finding out they are documenting.

---

## 10. Data Model (core entities)

```
User (id, email_hash?, mode, state, locale, created_at, deleted_at)
Case (id, user_id, attorney_name_private, firm, case_type, state,
      engagement_start, engagement_end, status)
Entry (id, case_id, type, occurred_at, created_at, edited_at,
       title, body, channel?, amount?, method?)
Document (id, case_id, entry_id?, filename, mime, size, sha256,
          ocr_text, tags[])
Promise (id, case_id, description, promised_by, fulfilled?, notes)
Observation (id, case_id, rule_id, rule_version, generated_at,
             template_render, severity)
Dossier (id, case_id, created_at, spec_json, file_uri, unbranded_bool)
Rule (id, state, title, trigger_spec, template, citations, channels,
      severity, reviewer, effective_from, effective_to)
Channel (id, state, name, kind[discipline|csf|fee|malpractice],
         prerequisites, windows, exclusions, links, content_reviewed_at)
AuditEvent (id, actor, action, entity, at, ip_hash)
```

---

## 11. Legal & Compliance Considerations

1. **Defamation (the big one).** Phase 1 design eliminates almost all exposure: no public named content, no reviews, neutral language. Truth is a defense in US law, and TX and CA both have anti-SLAPP mechanisms, but avoidance beats defense. Pre-launch legal review of all templates.
2. **Unauthorized Practice of Law (UPL).** The line: information + document organization = OK; telling a user what they *should* do in their specific case = risk. Rules engine uses conditional language; router presents options with neutral descriptions; disclaimers on every action screen; pre-launch UPL review per state.
3. **Attorney-client privilege.** We warn (TX) that signing a grievance waives privilege for the subject matter; we never advise users about privileged strategy; content explains the trade-off neutrally.
4. **Disclaimers.** Everywhere applicable: "LexGuard provides legal information, not legal advice..."
5. **Entity & insurance.** Incorporate (Delaware C-corp or TX nonprofit-adjacent structure — decision needed); media liability / cyber insurance (E&O) before launch.
6. **Record authenticity.** We never promise that journal entries are admissible evidence; we describe them as organized records the user created. Timestamp integrity (immutable created_at) supports credibility without overclaiming.

---

## 12. Institutional Partnerships (Phase 1 targets)

- LSC-funded legal aid orgs in TX and CA (e.g., Lone Star Legal Aid, Bay Area Legal Aid) — validation, referrals, content review.
- Law school clinics (professional-responsibility/legal-ethics clinics) — rule library review, student research support.
- State bar consumer-protection/education arms — approached as "we help clients file better-documented complaints."
- Law-firm E&O insurers or plaintiffs'-bar groups (longer-term; optional).
- Legal-tech incubators (e.g., university-affiliated) for funding and mentorship.

---

## 13. Roadmap

| Phase | Timeline | Deliverables |
|---|---|---|
| 0 — Foundation | Months 0–2 | Entity formation; legal counsel retained; content drafts (10 guides × 2 states × EN/ES); threat model; partnership outreach begins. |
| 1 — MVP | Months 2–5 | Journal, documents, money log, timeline, 20 rules, router v1, dossier PDF, safety features; internal legal review; private beta with 2 legal-aid partners. |
| 2 — Public launch | Months 5–6 | TX + CA public launch; referral directory; accessibility audit; PR through partner orgs. |
| 3 — Deepening | Months 6–10 | OCR search quality, quick-log mobile, deadline intelligence (rules like "CA CSF 4-year window" auto-flagged when dates logged), outcome tracking surveys. |
| 4 — Deferred (needs counsel sign-off) | Months 10+ | Anonymized aggregate reporting ("N documented complaints concern fee practices in TX"), optional zero-knowledge encryption, additional states (FL/NY/AZ), lawyer-complaint-template generation per state bar form fields. |

---

## 14. Metrics & Measurement

**North-star metric:** number of completed dossiers exported (a proxy for real-world action readiness).

**Supporting metrics:**
- Activation: % new users who create a case + 3 entries within 7 days.
- Documentation depth: median entries per active case; % cases with money log complete.
- Action rate: self-reported filings (in-app follow-up at 30/90 days) / dossiers exported.
- Knowledge lift: pre/post 5-question quiz on rights (anonymous, aggregate).
- Safety: % users enabling discreet mode (health signal for the safety design).
- Equity: language split (ES usage), device mix (mobile %).
- Trust incident count: legal threats received, data incidents, content-correction requests (target: 0 severe).

**Explicitly NOT measured:** anything that would incentivize overclaiming — no "lawyers exposed" counters, no accusatory gamification.

---

## 15. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Defamation suit from a named attorney | High | No public names; neutral templates; anti-SLAPP counsel pre-retained; media-liability insurance. |
| UPL allegation | Medium | Conditional language standards; attorney review workflow; UPL opinion letter at launch. |
| Data breach of sensitive case files | High | Encryption, isolation, pen tests, minimal PII, breach-response plan, cyber insurance. |
| User harm: filing triggered prematurely (e.g., TX privilege waiver) | Medium | Warnings at decision points; "consider consulting legal aid first" interstitials; no one-click filing. |
| Users treat observations as legal conclusions | Medium | Language standards enforced in templates; disclaimer design; user testing for comprehension. |
| Lawyer retaliates against documenting client | Medium (real in small communities) | Discreet mode, anonymity guidance, safety-content warnings, local-resources links. |
| State bar views project as hostile | Medium | Professional partnership posture; offer complaint-quality tooling; never publish bar criticism. |
| Scope creep into advice territory | Medium | PRD non-goals; content review gate; feature flags requiring counsel sign-off. |
| Funding shortfall (nonprofit-style economics) | High | Early institutional partnerships; grant pipeline (LSC TIG grants, access-to-justice funders); keep burn low. |

---

## 16. Open Questions (decisions needed)

1. **Entity structure:** for-profit PBC vs. nonprofit 501(c)(3)? (Affects funding, liability, tax, and partnership options.) *Recommendation: evaluate 501(c)(3) fiscal sponsorship under an existing legal-aid org for Phase 1.*
2. **Content jurisdiction for rule library:** which licensed TX and CA attorneys will formally review rules, and on what engagement (volunteer vs. modest stipend)?
3. **Anonymous local mode (Mode B) security model:** acceptable residual risk for local-only storage, given shared-device realities?
4. **Email notifications:** how to balance reminder value vs. discreet-mode requirements (digest-only, neutral wording, user-controlled)?
5. **Data retention for deleted accounts:** immediate full purge vs. short soft-delete window for accidental deletion recovery?
6. **AI usage:** may the narrative-draft generator use an LLM (with strict templating + no free generation), or must Phase 1 be fully deterministic? (Legal-review dependent.)
7. **Which two legal-aid partners** sign on for private beta, and what co-branding is acceptable to them?

---

## Appendix A — Verified State-Specific Facts (as of 2026-09-09; re-verify at content publication)

### Texas
- Grievance filing: online via Chief Disciplinary Counsel system (cdc.texasbar.com) or by mail/fax to State Bar of Texas Chief Disciplinary Counsel's Office, Austin, TX; phone (866) 224-5999. Supporting documents: copies only, no originals, no staples.
- **Signing the grievance form waives attorney-client privilege** for the subject matter — must be disclosed to users at the point of decision.
- Client-Attorney Assistance Program (CAAP): voluntary mediation/dispute resolution; referral when a grievance is dismissed at any stage.
- Client Security Fund: $3M+ corpus; reimbursement discretionary; **requires a grievance resulting in findings that the lawyer stole money or failed to refund an unearned fee — unless the lawyer is already disbarred, resigned in lieu of discipline, deceased, or on indefinite disability suspension**; **application must be filed within 18 months after the disciplinary judgment is final**; does NOT cover malpractice, fee-amount disputes, or dissatisfaction with outcomes; subrogation/assignment required upon payment.
- Ethics rule citations: TX Disciplinary Rules of Professional Conduct (Rules 1.01 competence/diligence, 1.02 scope, 1.03 communication, 1.04 fees, 1.06 conflicts, 1.14 safekeeping property, 1.16 termination/file return, 7.02 communications).

### California
- Discipline complaint: State Bar of California online complaint form; also Intake Unit phone option; complaint form available in English, Spanish, Vietnamese, Korean, Russian, Chinese, Tagalog.
- Client Security Fund:
  - Max reimbursement **$100,000 per claim** for losses occurring on/after Jan 1, 2009 ($50,000 for earlier losses); cumulative cap per attorney.
  - Covers: theft of entrusted funds (e.g., personal-injury settlements), failure to refund fees when no services performed, lawyer borrowing without intent/ability to repay, investment-related dishonesty.
  - **Excludes:** negligence/malpractice/incompetence losses, interest, consequential damages, unproven transfers.
  - **Filing window: within 4 years after the loss was (or should have been) discovered.**
  - Attorney status requirement: disbarred, disciplined, resigned, deceased, adjudicated incompetent, judgment debtor, or convicted — with possible waiver.
  - Process: Tentative Decision → 30-day objection window → Final Decision; checks ~4–6 weeks after final decision; **superior-court review within 90 days** of the final decision; filing does not toll statutes of limitation.
  - Contact: Client Security Fund, 845 South Figueroa St., Los Angeles, CA 90017-2515; 213-765-1140.
- Ethics rule citations: CA Rules of Professional Conduct (Rules 1.1, 1.2, 1.3, 1.4, 1.7, 1.16, 4-100 trust accounts, 4-200 fees, 7.1).
- Fee disputes: local bar association fee arbitration programs (county-level; e.g., LA County Bar, SF Bar) — content must list major programs per region.

### Federal/common (both states)
- ABA Model Rules underpin both states' codes; client owns the file at termination (state equivalents of Rule 1.16(d)).

## Appendix B — Sources (verified 2026-09-09)
- State Bar of California — Client Security Fund reimbursement (calbar.ca.gov/public/file-complaints-claims/apply-reimbursement)
- State Bar of California — CSF Rules, Title 3 Div. 4 Ch. 1 (calbar.ca.gov PDF)
- State Bar of Texas — Client Security Fund (texasbar.com; sbotservices.texasbar.com/csf)
- TexasLawHelp — Attorney Complaint Information (texaslawhelp.org)
- University of Houston Law Center — Texas Attorney Ethics Complaints FAQ

*(All state-process facts must be re-verified by counsel/volunteer reviewers at content publication time; bar processes change.)*
