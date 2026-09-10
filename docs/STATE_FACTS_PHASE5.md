# LexGuard — Expansion-State Fact Sheet (Phase 5)

**States:** Florida (FL), New York (NY), Arizona (AZ)
**Verification date:** 2026-09-10 (public official sources; see per-section notes)
**Status:** Formal licensed-attorney review is **pending** for these states. Per PRD
Appendix A practice, every fact must be **re-verified at content publication**.

Sources consulted: The Florida Bar (floridabar.org — ACAP, Clients' Security Fund,
Legal Fee Arbitration), New York Unified Court System (nycourts.gov — Attorney
Grievance Committees, Part 137 FDRP), NY Lawyers' Fund for Client Protection
(nylawfund.org), State Bar of Arizona (azbar.org — Lawyer Regulation, ACAP intake,
Client Protection Fund info packet, Fee Arbitration). Direct site access was
partially blocked by bot protection; figures were cross-checked across multiple
search captures of the official pages and the Fund's own claim packets.

## Florida

- **Discipline intake:** The Florida Bar's Attorney Consumer Assistance Program
  (ACAP) is the central intake for complaints against all Florida lawyers;
  toll-free 1-866-352-0707; Inquiry/Complaint form online or by mail. ACAP reviews
  every complaint first; possible rule violations move to Disciplinary Counsel.
- **Clients' Security Fund:** reimburses losses from a lawyer's misappropriation,
  embezzlement, or other wrongful taking of funds. **Up to $50,000 per claim**
  (attorney-fee losses have smaller caps). **Claim within 2 years after the client
  knew or should have known of the loss.** Excludes negligence/malpractice and fee
  disputes. Restitution to the Fund is required from reimbursed lawyers.
- **Fee disputes:** The Florida Bar's Legal Fee Arbitration Program — free and
  voluntary; either party may initiate; both sides must agree to arbitrate.
- **Ethics rules:** Florida Rules of Professional Conduct (chapter 4 numbering):
  4-1.15 (safekeeping), 4-1.3 (diligence), 4-1.4 (communication), 4-1.5 (fees;
  4-1.5(c) written contingency agreements), 4-1.16(d) (file return on termination).
- **Malpractice limitations (informational):** generally 2 years from discovery,
  with a 4-year outer limit (Fla. Stat. ch. 95).

## New York

- **Discipline intake:** Attorney Grievance Committees of the Appellate Division,
  First through Fourth Judicial Departments — file in the department where the
  lawyer's office is located. Directory and complaint forms at
  nycourts.gov/attorney-grievance-committees.
- **Lawyers' Fund for Client Protection:** reimburses losses caused by a lawyer's
  dishonest conduct (larceny, embezzlement, fraud). **Up to $450,000 per client
  loss.** **Apply within 2 years after the loss or its discovery.** The Fund has
  no jurisdiction over neglect, malpractice, or fee disputes. Tel. 518-285-8350.
- **Fee disputes:** Part 137 Fee Dispute Resolution Program (22 NYCRR Part 137) —
  arbitration/conciliation through local bar programs. **Covers $1,000–$50,000**
  (outside the range only with both parties' consent); excludes criminal-matter
  fees and substantial legal questions; when the client initiates, the attorney
  must participate.
- **Ethics rules:** NY Rules of Professional Conduct (22 NYCRR Part 1200): 1.15
  (safekeeping), 1.3, 1.4, 1.5 (1.5(c) written contingency; Part 1215 engagement
  letter generally required over $3,000), 1.16(d) (file return).
- **Malpractice limitations (informational):** generally 3 years (CPLR 214).

## Arizona

- **Discipline intake:** State Bar of Arizona — Attorney/Consumer Assistance
  Program (ACAP) at 602-340-7280 encourages a call before filing; the online
  "charge of misconduct" form (tools.azbar.org) and written complaints go to the
  Lawyer Regulation Office.
- **Client Protection Fund:** reimburses losses from a lawyer's dishonest conduct.
  **Maximum $100,000 per claimant** (aggregate cap per lawyer). **Claim within 5
  years after the claimant knew or should have known of the loss** (per the Fund's
  rule text). Excludes negligence/malpractice and fee disputes.
- **Fee disputes:** State Bar of Arizona Fee Arbitration Program — free and
  voluntary; **disputes over $1,000**, including contingent fees.
- **Ethics rules:** Arizona Rules of Professional Conduct ("ER" numbering): ER
  1.15 (safekeeping), ER 1.3, ER 1.4, ER 1.5 (ER 1.5(c) written contingency), ER
  1.16(d) (file return).
- **Malpractice limitations (informational):** generally 2 years (A.R.S. 12-542).

## Where these facts live in the product

| Artifact | File |
|---|---|
| State registry (names, bars, verification dates, `expansion` flag) | `src/lib/lexguard/types.ts` (`STATES`) |
| Remedy channels (discipline / fund / fee arbitration / malpractice) | `src/lib/lexguard/channels-expansion.ts` |
| Fund windows + malpractice-limitations deadline intelligence | `src/lib/lexguard/deadlines.ts` (`FUND_WINDOWS`, `MALPRACTICE_SOL`) |
| Rule citations for the 20 red-flag patterns | `src/lib/lexguard/rules.ts` (`EXPANSION_CITATIONS`) |
| Complaint-worksheet per-state fields and notices | `src/lib/lexguard/formsheet.ts` (`STATE_FORMS`) |
| Router CSF gating per state | `src/lib/lexguard/channels.ts` (`CSF_ROUTE`) |
| Guide state notes | `src/lib/lexguard/guides-expansion.ts` |
| Referral directory entries | `src/lib/lexguard/directory.ts` |

## Re-verification checklist (before public launch in a new state)

1. Confirm each Fund's filing window, cap, and eligibility conditions against the
   official page.
2. Confirm the discipline intake path and phone numbers.
3. Have a licensed attorney in that state review the rule citations, guide notes,
   channel text, and worksheet notices (FR-1.5 / FR-3.4 sign-off).
4. Update `STATES[...].factsVerified` and clear the `expansion` flag when sign-off
   is complete.
