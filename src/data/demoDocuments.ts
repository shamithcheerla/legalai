import { DocumentAnalysis, ComparisonResult } from '../types/legal';

export const DEMO_RENTAL_AGREEMENT_TEXT = `RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement (the "Agreement") is entered into as of September 1, 2026, by and between Apex Property Management LLC ("Landlord") and Jane Doe ("Tenant").

1. PREMISES & TERM
Landlord hereby leases to Tenant the residential property located at 742 Evergreen Terrace, Unit 4B, Springfield ("Premises"). The term of this Lease shall commence on October 1, 2026 (the "Effective Date") and continue through September 30, 2027 (the "Expiration Date"), unless terminated earlier in accordance with the provisions herein.

2. RENT & PAYMENT SCHEDULE
Tenant shall pay to Landlord a monthly rent of $2,400.00 USD, payable in advance on or before the first (1st) day of each calendar month. Payments received after the fifth (5th) calendar day shall incur a late charge penalty fee of $120.00 USD plus an additional interest fee of 1.5% per month on any outstanding balance until paid in full.

3. SECURITY DEPOSIT
Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of $4,800.00 USD (equivalent to two months' rent) as a refundable Security Deposit. The Security Deposit shall be returned to Tenant within forty-five (45) days after vacating the Premises, less any deductions for documented repairs exceeding ordinary wear and tear.

4. EARLY TERMINATION & NOTICE
Either party may terminate this Lease prior to the Expiration Date by providing not less than thirty (30) days' written notice to the other party, accompanied by an early termination buyout fee equal to two (2) months' rent ($4,800.00 USD).

5. AUTOMATIC RENEWAL
Upon expiration of the initial term, this Lease shall automatically renew for successive one-year terms at a rate adjusted to prevailing fair market value plus 5%, unless either party delivers written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.

6. REPAIRS & MAINTENANCE OBLIGATIONS
Tenant shall maintain the interior of the Premises in clean, sanitary condition. Tenant is strictly responsible for all minor plumbing, appliance clogs, and HVAC filter replacements under $200.00 per incident. Landlord shall be responsible for structural repairs and exterior roof maintenance, provided Tenant reports damage within forty-eight (48) hours of discovery.

7. PET POLICY & RESTRICTIONS
No pets or animals of any kind (including dogs, cats, or caged animals) shall be kept on the Premises without prior written authorization from Landlord and payment of a non-refundable pet deposit of $500.00 USD.

8. INDEMNIFICATION & LIABILITY
Tenant agrees to indemnify, defend, and hold harmless Landlord from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to Tenant's use of the Premises or any guest invited onto the property.

9. INVENTORY & MOVE-IN CONDITION
The condition of the Premises and all included appliances and fixtures is detailed in "Schedule A: Move-In Property Condition Report", which Tenant must inspect, sign, and return within seven (7) days of occupancy.

10. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by and construed in accordance with the laws of the State of Illinois, and any disputes shall be resolved exclusively in the municipal courts of Springfield.

11. INSPECTION & ENTRY
Landlord reserves the right to enter the Premises for inspection or repairs with at least twenty-four (24) hours' advance written or telephonic notice, except in cases of emergency where immediate access is permitted.

12. CANCELLATION FOR LEASE DEFAULT & INCONSISTENT NOTICE
In the event Tenant fails to comply with any material term of this Lease, Landlord may issue a written notice of default. Tenant shall have sixty (60) days from receipt of notice to cure such default or vacate the Premises immediately.`;

export const DEMO_RENTAL_ANALYSIS: DocumentAnalysis = {
  overview: {
    id: 'doc_rental_001',
    title: 'Residential Lease Agreement — 742 Evergreen Terrace',
    type: 'Residential Lease / Rental Contract',
    parties: ['Apex Property Management LLC (Landlord)', 'Jane Doe (Tenant)'],
    effectiveDate: 'October 1, 2026',
    expiryDate: 'September 30, 2027',
    jurisdiction: 'State of Illinois, United States',
    language: 'English',
    pageCount: 3,
    confidence: 0.98,
    analysisTimestamp: '2026-09-20T05:00:00.000Z',
    rawText: DEMO_RENTAL_AGREEMENT_TEXT
  },
  executiveSummary: {
    whatThisIs: 'A 12-month residential apartment lease agreement outlining tenant rights, landlord rules, financial schedules, maintenance boundaries, and termination conditions for an apartment in Springfield.',
    whoIsInvolved: 'Apex Property Management LLC (acting as Landlord) and Jane Doe (as Tenant).',
    expectedResponsibilities: 'The Tenant must pay rent on the 1st of each month, maintain interior sanitary conditions, pay for minor repairs under $200, and indemnify the landlord. The Landlord must maintain structural integrity, roofs, and handle major repairs with 24 hours notice for routine entry.',
    financialSummary: 'Monthly rent of $2,400.00 ($28,800/yr). Requires a $4,800.00 refundable security deposit upfront. Late fee of $120.00 plus 1.5%/month interest after the 5th. Early termination buyout fee of $4,800.00.',
    durationAndTerm: '12 months from October 1, 2026 to September 30, 2027. Automatically renews for 1-year terms unless 60 days notice is given prior to expiry.',
    howTerminationWorks: 'Early termination permitted with 30 days written notice and a 2-month rent buyout fee ($4,800). Landlord default notice specifies a 60-day cure period.',
    failureConsequences: 'Late payments trigger $120 penalty plus 1.5% interest. Uncured breaches after 60 days result in eviction notice and potential lease forfeiture.',
    keyThingsToReview: 'Significant notice contradiction between Section 4 (30 days) and Section 12 (60 days default cure). Missing "Schedule A" inventory sheet. Automatic renewal with market rate + 5% increase. Broad indemnity clause.'
  },
  clauses: [
    {
      id: 'c_rent_1',
      title: 'Premises & Term Duration',
      category: 'Term',
      originalText: 'The term of this Lease shall commence on October 1, 2026 (the "Effective Date") and continue through September 30, 2027 (the "Expiration Date"), unless terminated earlier...',
      plainExplanation: 'You have a fixed one-year tenancy starting October 1, 2026 and finishing September 30, 2027.',
      explain15: 'You get to live in this apartment for exactly one year, starting in October 2026 and ending in September 2027.',
      affects: 'Tenant & Landlord',
      userObligation: 'Occupy premises strictly according to the agreed 12-month calendar.',
      timeImpact: '12 calendar months (Oct 1, 2026 – Sep 30, 2027)',
      attentionLevel: 'Informational',
      whyItMatters: 'Establishes the binding start and end periods for your housing stability.',
      page: 1,
      section: 'Section 1',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 1. PREMISES & TERM',
        sourceText: 'The term of this Lease shall commence on October 1, 2026 (the "Effective Date") and continue through September 30, 2027 (the "Expiration Date")...',
        confidence: 0.99
      }
    },
    {
      id: 'c_rent_2',
      title: 'Rent Amount, Due Date & Late Penalties',
      category: 'Payments',
      originalText: 'Tenant shall pay to Landlord a monthly rent of $2,400.00 USD, payable in advance on or before the first (1st) day of each calendar month. Payments received after the fifth (5th) calendar day shall incur a late charge penalty fee of $120.00 USD plus an additional interest fee of 1.5% per month...',
      plainExplanation: 'Rent is $2,400 per month due on the 1st. If paid after the 5th, a $120 late fee plus 1.5% monthly interest is added.',
      explain15: 'Rent is $2,400 every month by the 1st. If you pay past the 5th, you are charged an extra $120 fee plus ongoing interest.',
      affects: 'Tenant',
      userObligation: 'Pay $2,400 on or before the 1st of every month.',
      financialImpact: '$2,400/month; late fee $120 + 1.5% interest',
      attentionLevel: 'Important',
      whyItMatters: 'Strict 5-day grace period with compounding interest penalty.',
      page: 1,
      section: 'Section 2',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 2. RENT & PAYMENT SCHEDULE',
        sourceText: 'Tenant shall pay to Landlord a monthly rent of $2,400.00 USD, payable in advance on or before the first (1st) day of each calendar month. Payments received after the fifth (5th) calendar day shall incur a late charge penalty fee of $120.00 USD plus an additional interest fee of 1.5% per month...',
        confidence: 0.99
      }
    },
    {
      id: 'c_rent_3',
      title: 'Security Deposit & Return Window',
      category: 'Payments',
      originalText: 'Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of $4,800.00 USD (equivalent to two months\' rent) as a refundable Security Deposit. The Security Deposit shall be returned to Tenant within forty-five (45) days after vacating...',
      plainExplanation: 'You must pay $4,800 upon signing (equal to 2 months rent). The landlord has 45 days after move-out to return it minus repair costs.',
      explain15: 'You have to hand over $4,800 upfront. You only get it back up to 45 days after moving out if the place is not damaged.',
      affects: 'Tenant & Landlord',
      financialImpact: '$4,800 upfront cash lockup',
      timeImpact: 'Returned within 45 days of vacancy',
      attentionLevel: 'Review',
      whyItMatters: '45 days is a long return window; state regulations often require 21-30 days.',
      page: 1,
      section: 'Section 3',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 3. SECURITY DEPOSIT',
        sourceText: 'Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of $4,800.00 USD (equivalent to two months\' rent) as a refundable Security Deposit. The Security Deposit shall be returned to Tenant within forty-five (45) days after vacating...',
        confidence: 0.98
      }
    },
    {
      id: 'c_rent_4',
      title: 'Early Termination Buyout & 30-Day Notice',
      category: 'Termination',
      originalText: 'Either party may terminate this Lease prior to the Expiration Date by providing not less than thirty (30) days\' written notice to the other party, accompanied by an early termination buyout fee equal to two (2) months\' rent ($4,800.00 USD).',
      plainExplanation: 'To break the lease early, you must give 30 days notice and pay a fee equal to two months rent ($4,800).',
      explain15: 'If you want to move out early, you have to tell them 30 days ahead of time AND pay a huge penalty of $4,800.',
      affects: 'Tenant',
      financialImpact: '$4,800 termination buyout fee',
      timeImpact: 'Minimum 30 days written notice',
      attentionLevel: 'High Attention',
      whyItMatters: 'Heavy financial penalty to exit early; conflicts with the 60-day notice requirement in Section 12.',
      page: 2,
      section: 'Section 4',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 4. EARLY TERMINATION & NOTICE',
        sourceText: 'Either party may terminate this Lease prior to the Expiration Date by providing not less than thirty (30) days\' written notice to the other party, accompanied by an early termination buyout fee equal to two (2) months\' rent ($4,800.00 USD).',
        confidence: 0.97
      }
    },
    {
      id: 'c_rent_5',
      title: 'Automatic Renewal with Market + 5% Adjustment',
      category: 'Renewal',
      originalText: 'Upon expiration of the initial term, this Lease shall automatically renew for successive one-year terms at a rate adjusted to prevailing fair market value plus 5%, unless either party delivers written notice of non-renewal at least sixty (60) days prior...',
      plainExplanation: 'The lease automatically rolls over into another full year with a price increase unless you give written notice 60 days before September 30, 2027.',
      explain15: 'If you do nothing, you get locked into another entire year at a higher price! You have to notify them 60 days before your year ends to avoid this.',
      affects: 'Tenant',
      financialImpact: 'Potential price hike to market rate + 5%',
      timeImpact: 'Notice due 60 days before Sep 30, 2027 (~Aug 1, 2027)',
      attentionLevel: 'High Attention',
      whyItMatters: 'Automatic renewal clauses can trap tenants into another binding full-year obligation without explicit sign-off.',
      page: 2,
      section: 'Section 5',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 5. AUTOMATIC RENEWAL',
        sourceText: 'Upon expiration of the initial term, this Lease shall automatically renew for successive one-year terms at a rate adjusted to prevailing fair market value plus 5%, unless either party delivers written notice of non-renewal at least sixty (60) days prior to the expiration...',
        confidence: 0.99
      }
    },
    {
      id: 'c_rent_6',
      title: 'Tenant Maintenance Responsibility Under $200',
      category: 'Responsibilities',
      originalText: 'Tenant is strictly responsible for all minor plumbing, appliance clogs, and HVAC filter replacements under $200.00 per incident.',
      plainExplanation: 'The tenant has to pay out of pocket for any plumbing, appliance, or filter repairs that cost under $200.',
      explain15: 'If a sink backs up or an appliance breaks and costs less than $200 to fix, you have to pay for it yourself, not the landlord.',
      affects: 'Tenant',
      financialImpact: 'Up to $200 per incident',
      attentionLevel: 'Review',
      whyItMatters: 'Shifts routine residential maintenance duties from landlord to tenant.',
      page: 2,
      section: 'Section 6',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 6. REPAIRS & MAINTENANCE OBLIGATIONS',
        sourceText: 'Tenant is strictly responsible for all minor plumbing, appliance clogs, and HVAC filter replacements under $200.00 per incident.',
        confidence: 0.98
      }
    },
    {
      id: 'c_rent_8',
      title: 'Broad Tenant Indemnification Clause',
      category: 'Indemnity',
      originalText: 'Tenant agrees to indemnify, defend, and hold harmless Landlord from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising out of or related to Tenant\'s use of the Premises or any guest...',
      plainExplanation: 'You agree to protect and pay for the landlord\'s legal fees and damages if someone gets hurt or makes a claim regarding your apartment or your visitors.',
      explain15: 'If someone slips or has an accident in your apartment and sues the landlord, you have to hire their lawyers and pay for it.',
      affects: 'Tenant',
      financialImpact: 'Potentially unlimited legal liability exposure',
      attentionLevel: 'High Attention',
      whyItMatters: 'One-sided indemnity can expose you to catastrophic financial liabilities if not backed by adequate renter insurance.',
      page: 2,
      section: 'Section 8',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 8. INDEMNIFICATION & LIABILITY',
        sourceText: 'Tenant agrees to indemnify, defend, and hold harmless Landlord from and against any and all claims, damages, liabilities, costs, and expenses (including reasonable attorneys\' fees)...',
        confidence: 0.96
      }
    }
  ],
  attentionItems: [
    {
      id: 'att_1',
      title: 'Conflicting Termination Notice Periods (30 vs 60 Days)',
      category: 'Conflicting Clauses',
      attentionLevel: 'High Attention',
      detectedIssue: 'Section 4 requires 30 days written notice for early termination, whereas Section 12 specifies a 60-day notice period for lease default and cure.',
      whyItDeservesAttention: 'If a dispute arises over moving out or an alleged default, the parties could disagree on whether 30 or 60 days applies, risking security deposit forfeiture.',
      whatUserShouldClarify: 'Clarify with landlord whether voluntary termination notice is strictly 30 days and get this confirmed in an addendum.',
      professionalReviewAdvice: 'A tenancy attorney or local housing clinic can advise on whether statutory tenant cure rights override this contradiction in Illinois.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 4 & Section 12',
        sourceText: 'Sec 4: "...thirty (30) days\' written notice..." vs Sec 12: "...sixty (60) days from receipt of notice to cure such default..."',
        confidence: 0.98
      }
    },
    {
      id: 'att_2',
      title: 'Automatic 1-Year Renewal with Price Escalation',
      category: 'Automatic Renewal',
      attentionLevel: 'High Attention',
      detectedIssue: 'The lease automatically renews for another full 12-month period at fair market value + 5% unless cancelled 60 days in advance.',
      whyItDeservesAttention: 'Missing the 60-day notification deadline (roughly August 1, 2027) legally locks the tenant into another year of rent payments.',
      whatUserShouldClarify: 'Request that the lease convert to a month-to-month tenancy upon expiration rather than a binding full year.',
      professionalReviewAdvice: 'Review local tenant laws regarding mandatory disclosure rules for automatic renewal provisions in residential leases.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 5. AUTOMATIC RENEWAL',
        sourceText: '...this Lease shall automatically renew for successive one-year terms at a rate adjusted to prevailing fair market value plus 5%...',
        confidence: 0.99
      }
    },
    {
      id: 'att_3',
      title: 'Missing Referenced Attachment: "Schedule A"',
      category: 'Missing Terms / Attachments',
      attentionLevel: 'Important',
      detectedIssue: 'Section 9 refers to "Schedule A: Move-In Property Condition Report", but the schedule was not attached to the document.',
      whyItDeservesAttention: 'Without Schedule A, there is no verified baseline of existing pre-existing damages, which jeopardizes the return of the $4,800 deposit.',
      whatUserShouldClarify: 'Do not sign or accept keys without a physical copy of Schedule A completed with high-resolution move-in photos.',
      professionalReviewAdvice: 'A tenant advocate can verify that a pre-occupancy walkthrough inspection report is required by state statute.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 9. INVENTORY & MOVE-IN CONDITION',
        sourceText: '...detailed in "Schedule A: Move-In Property Condition Report", which Tenant must inspect, sign, and return...',
        confidence: 0.97
      }
    },
    {
      id: 'att_4',
      title: 'One-Sided Tenant Indemnification Provision',
      category: 'Indemnification Exposure',
      attentionLevel: 'Important',
      detectedIssue: 'The tenant is obligated to indemnify and pay all legal costs for the landlord, but there is no reciprocal landlord indemnity.',
      whyItDeservesAttention: 'If a third party slips on an unmaintained icy common stairway, the landlord could try to pass the defense costs to the tenant.',
      whatUserShouldClarify: 'Verify that indemnity is limited strictly to tenant gross negligence inside the private apartment, and obtain comprehensive renter liability insurance.',
      professionalReviewAdvice: 'A lawyer may recommend striking the broad indemnification or adding mutual indemnification for landlord negligence.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 8. INDEMNIFICATION & LIABILITY',
        sourceText: 'Tenant agrees to indemnify, defend, and hold harmless Landlord from and against any and all claims, damages, liabilities...',
        confidence: 0.95
      }
    }
  ],
  obligations: [
    {
      id: 'ob_1',
      title: 'Monthly Rent Payment',
      responsibleParty: 'Tenant (Jane Doe)',
      deadline: '1st calendar day of each month',
      trigger: 'Start of calendar month',
      frequency: 'Monthly',
      amount: '$2,400.00 USD',
      consequence: '$120 late penalty fee plus 1.5%/month interest after 5th day',
      sourceClause: 'Section 2',
      confidence: 0.99,
      completed: false,
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'Tenant shall pay to Landlord a monthly rent of $2,400.00 USD, payable in advance on or before the first (1st) day...',
        confidence: 0.99
      }
    },
    {
      id: 'ob_2',
      title: 'Security Deposit Remittance',
      responsibleParty: 'Tenant (Jane Doe)',
      deadline: 'Upon execution of Agreement (before move-in)',
      trigger: 'Signing the lease',
      frequency: 'One-time',
      amount: '$4,800.00 USD',
      consequence: 'Keys withheld / tenancy not granted',
      sourceClause: 'Section 3',
      confidence: 0.99,
      completed: true,
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 3',
        sourceText: 'Upon execution of this Agreement, Tenant shall deposit with Landlord the sum of $4,800.00 USD...',
        confidence: 0.99
      }
    },
    {
      id: 'ob_3',
      title: 'Schedule A Inspection Return',
      responsibleParty: 'Tenant (Jane Doe)',
      deadline: '7 days from occupancy',
      trigger: 'Taking possession of the apartment',
      frequency: 'One-time',
      consequence: 'Acceptance of premises "as-is" with potential forfeit of deposit claims',
      sourceClause: 'Section 9',
      confidence: 0.96,
      completed: false,
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 9',
        sourceText: '...which Tenant must inspect, sign, and return within seven (7) days of occupancy.',
        confidence: 0.97
      }
    },
    {
      id: 'ob_4',
      title: 'Advance Notice for Landlord Entry',
      responsibleParty: 'Landlord (Apex Property Management)',
      deadline: 'At least 24 hours prior to entry',
      trigger: 'Non-emergency inspection or maintenance visit',
      frequency: 'As Needed',
      consequence: 'Unauthorized entry constitutes tenant breach of quiet enjoyment',
      sourceClause: 'Section 11',
      confidence: 0.95,
      completed: false,
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 3,
        section: 'Section 11',
        sourceText: 'Landlord reserves the right to enter the Premises for inspection or repairs with at least twenty-four (24) hours advance written or telephonic notice...',
        confidence: 0.98
      }
    },
    {
      id: 'ob_5',
      title: 'Non-Renewal Written Notice',
      responsibleParty: 'Tenant or Landlord',
      deadline: '60 days before September 30, 2027 (~August 1, 2027)',
      trigger: 'Upcoming end of lease term',
      frequency: 'One-time',
      consequence: 'Automatic renewal for another full year at market rate + 5%',
      sourceClause: 'Section 5',
      confidence: 0.98,
      completed: false,
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 5',
        sourceText: '...unless either party delivers written notice of non-renewal at least sixty (60) days prior to the expiration...',
        confidence: 0.98
      }
    }
  ],
  deadlines: [
    {
      id: 'dl_1',
      title: 'Lease Effective / Move-In Date',
      dateOrTimeline: 'October 1, 2026',
      isRelative: false,
      significance: 'Tenancy starts; keys handed over.',
      page: 1,
      section: 'Section 1',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 1',
        sourceText: 'commence on October 1, 2026 (the "Effective Date")',
        confidence: 0.99
      }
    },
    {
      id: 'dl_2',
      title: 'Monthly Rent Grace Period Cutoff',
      dateOrTimeline: '5th day of every calendar month',
      isRelative: true,
      relativeReference: '5 days after the 1st of each month',
      significance: 'After this day, $120 late fee + 1.5% interest takes effect.',
      page: 1,
      section: 'Section 2',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'Payments received after the fifth (5th) calendar day shall incur a late charge penalty fee of $120.00 USD...',
        confidence: 0.99
      }
    },
    {
      id: 'dl_3',
      title: 'Move-In Inspection Form Return Deadline',
      dateOrTimeline: '7 days from occupancy (approx. Oct 8, 2026)',
      isRelative: true,
      relativeReference: '7 days after taking possession',
      significance: 'Must return Schedule A to document pre-existing defects.',
      page: 2,
      section: 'Section 9',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 9',
        sourceText: 'sign, and return within seven (7) days of occupancy.',
        confidence: 0.97
      }
    },
    {
      id: 'dl_4',
      title: 'Non-Renewal Cancellation Window',
      dateOrTimeline: '60 days before expiration (August 1, 2027)',
      isRelative: true,
      relativeReference: '60 days prior to September 30, 2027',
      significance: 'Critical deadline to prevent automatic 1-year contract extension.',
      page: 2,
      section: 'Section 5',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 5',
        sourceText: 'at least sixty (60) days prior to the expiration of the then-current term.',
        confidence: 0.98
      }
    },
    {
      id: 'dl_5',
      title: 'Security Deposit Refund Cutoff',
      dateOrTimeline: '45 days after vacating premises',
      isRelative: true,
      relativeReference: '45 days post-move-out',
      significance: 'Landlord must remit refundable balance and itemized deductions.',
      page: 1,
      section: 'Section 3',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 3',
        sourceText: 'returned to Tenant within forty-five (45) days after vacating the Premises...',
        confidence: 0.98
      }
    }
  ],
  financialItems: [
    {
      id: 'fin_1',
      label: 'Monthly Base Rent',
      amount: '$2,400.00 / month',
      currency: 'USD',
      timingType: 'recurring',
      description: 'Regular recurring monthly lease obligation due on the 1st ($28,800.00 annual total).',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'monthly rent of $2,400.00 USD, payable in advance on or before the first (1st) day...',
        confidence: 0.99
      }
    },
    {
      id: 'fin_2',
      label: 'Security Deposit',
      amount: '$4,800.00',
      currency: 'USD',
      timingType: 'one-time',
      description: 'Upfront refundable security deposit equal to two months rent, held for damage deduction.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 3',
        sourceText: 'sum of $4,800.00 USD (equivalent to two months\' rent) as a refundable Security Deposit.',
        confidence: 0.99
      }
    },
    {
      id: 'fin_3',
      label: 'Late Rent Penalty Fee',
      amount: '$120.00 + 1.5% interest/mo',
      currency: 'USD',
      timingType: 'penalties',
      description: 'Charge applied if rent is not received by the 5th of the month.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'late charge penalty fee of $120.00 USD plus an additional interest fee of 1.5% per month...',
        confidence: 0.99
      }
    },
    {
      id: 'fin_4',
      label: 'Early Termination Buyout Fee',
      amount: '$4,800.00',
      currency: 'USD',
      timingType: 'conditional',
      description: 'Required fee equal to two months rent if the tenant terminates the lease early.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 4',
        sourceText: 'early termination buyout fee equal to two (2) months\' rent ($4,800.00 USD).',
        confidence: 0.98
      }
    },
    {
      id: 'fin_5',
      label: 'Minor Repairs Limit',
      amount: 'Up to $200.00 / incident',
      currency: 'USD',
      timingType: 'variable',
      description: 'Tenant is out-of-pocket for any plumbing or appliance issue under $200.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 6',
        sourceText: '...HVAC filter replacements under $200.00 per incident.',
        confidence: 0.97
      }
    },
    {
      id: 'fin_6',
      label: 'Pet Deposit (Optional)',
      amount: '$500.00',
      currency: 'USD',
      timingType: 'conditional',
      description: 'Non-refundable deposit if pet approval is sought and granted.',
      evidence: {
        documentId: 'doc_rental_001',
        documentName: 'Residential_Lease_Agreement.txt',
        page: 2,
        section: 'Section 7',
        sourceText: '...payment of a non-refundable pet deposit of $500.00 USD.',
        confidence: 0.98
      }
    }
  ],
  inconsistencies: [
    {
      id: 'inc_1',
      title: 'Contradictory Termination Notice (30 Days vs 60 Days)',
      description: 'The agreement gives conflicting notice windows for ending the lease between early termination and default cure.',
      provisionA: {
        section: 'Section 4 (Early Termination)',
        page: 2,
        text: 'Either party may terminate this Lease prior to the Expiration Date by providing not less than thirty (30) days\' written notice...'
      },
      provisionB: {
        section: 'Section 12 (Lease Default)',
        page: 3,
        text: 'Tenant shall have sixty (60) days from receipt of notice to cure such default or vacate the Premises immediately.'
      },
      whyInconsistent: 'Section 4 grants early exit on 30 days notice with a buyout fee, but Section 12 allows 60 days to vacate upon notice of default. This creates ambiguity regarding which notice period applies if a breach occurs.',
      recommendation: 'Request written clarification in a rider specifying that voluntary 30-day early termination is distinct and independent from 60-day default cure proceedings.'
    }
  ],
  missingInformation: [
    {
      id: 'miss_1',
      title: 'Missing Exhibit "Schedule A: Move-In Property Condition Report"',
      category: 'Referenced Exhibit Not Attached',
      missingElement: 'Schedule A (Move-In Inventory and Condition Form)',
      whyImportant: 'Section 9 states the tenant must return Schedule A within 7 days, but no inspection sheet is attached to the contract. Without a documented baseline, the tenant is vulnerable to unfair deposit deductions upon departure.',
      recommendation: 'Request the physical Schedule A document before signing, walk the apartment with the landlord, and take timestamped video evidence of all existing wear.'
    },
    {
      id: 'miss_2',
      title: 'Undefined Renewal Rate Ceiling',
      category: 'Pricing Ambiguity',
      missingElement: 'Formula or benchmark index for "fair market value"',
      whyImportant: 'Section 5 allows the landlord to reset rent to "fair market value plus 5%" on automatic renewal without specifying how fair market value is calculated or disputed.',
      recommendation: 'Specify an inflation cap (e.g., maximum 3-5% increase) or benchmark against local consumer price index (CPI).'
    }
  ],
  lawyerQuestions: [
    {
      id: 'lq_1',
      question: 'Does the 45-day security deposit return timeline in Section 3 comply with Illinois residential tenancy statutes?',
      rationale: 'Illinois Security Deposit Return Act (765 ILCS 710) often requires return within 30 to 45 days depending on property size and itemized repair receipts.',
      relatedSection: 'Section 3. SECURITY DEPOSIT',
      priority: 'High'
    },
    {
      id: 'lq_2',
      question: 'Is the broad tenant indemnity clause in Section 8 legally enforceable for injuries occurring in common building areas?',
      rationale: 'Landlords cannot typically contract away their common law duty to maintain safe premises for guests and tenants.',
      relatedSection: 'Section 8. INDEMNIFICATION & LIABILITY',
      priority: 'High'
    },
    {
      id: 'lq_3',
      question: 'How does the automatic renewal provision in Section 5 interact with local municipal tenant disclosure ordinances?',
      rationale: 'Many jurisdictions require landlords to provide a dedicated reminder notice 15-30 days before the automatic renewal deadline.',
      relatedSection: 'Section 5. AUTOMATIC RENEWAL',
      priority: 'Medium'
    },
    {
      id: 'lq_4',
      question: 'Can the landlord enforce the $200 minor repair threshold in Section 6 if the issue involves pre-existing wear or plumbing code standards?',
      rationale: 'Implied warranty of habitability prohibits shifting essential habitability repairs to tenants.',
      relatedSection: 'Section 6. REPAIRS & MAINTENANCE OBLIGATIONS',
      priority: 'Medium'
    }
  ]
};

export const DEMO_SERVICE_V1_TEXT = `MASTER SERVICES AGREEMENT (VERSION 1.0 - DRAFT)

Parties: CloudMatrix Solutions Inc. ("Provider") and Apex Retailers Corp. ("Client").
Effective Date: January 15, 2026.

1. FEES & INVOICING
Client agrees to pay Provider an annual subscription fee of $25,000.00 USD for the Cloud Analytics Platform. Invoices shall be payable within thirty (30) days of receipt (Net 30). Late payments incur a charge of 1.0% per month.

2. TERM & TERMINATION
This Agreement shall remain in effect for an initial term of twelve (12) months. Either party may terminate this Agreement without cause upon providing thirty (30) days' prior written notice.

3. LIMITATION OF LIABILITY
Neither party's total aggregate liability arising out of or related to this Agreement shall exceed the total amount paid by Client to Provider during the twelve (12) months preceding the incident.

4. INTELLECTUAL PROPERTY & INDEMNIFICATION
Provider shall retain all right, title, and interest in and to the platform. Provider shall indemnify Client against third-party copyright claims up to the maximum liability cap set forth in Section 3.

5. SERVICE LEVEL AGREEMENT (SLA)
Provider guarantees 99.5% monthly platform availability. For downtime exceeding 0.5%, Client is entitled to a 5% credit on the monthly prorated fee.`;

export const DEMO_SERVICE_V2_TEXT = `MASTER SERVICES AGREEMENT (VERSION 2.0 - FINAL NEGOTIATED)

Parties: CloudMatrix Solutions Inc. ("Provider") and Apex Retailers Corp. ("Client").
Effective Date: January 15, 2026.

1. FEES & INVOICING
Client agrees to pay Provider an annual subscription fee of $30,000.00 USD for the Cloud Analytics Platform. Invoices shall be payable within fifteen (15) days of receipt (Net 15). Late payments incur a charge of 2.0% per month.

2. TERM & TERMINATION
This Agreement shall remain in effect for an initial term of twenty-four (24) months. Either party may terminate this Agreement without cause upon providing sixty (60) days' prior written notice. The contract automatically renews unless non-renewal notice is served 60 days before expiry.

3. LIMITATION OF LIABILITY
Client's total liability is capped at 1x annual fees ($30,000). Provider's liability for data breaches, confidentiality breaches, and intellectual property infringement shall be UNCAPPED.

4. INTELLECTUAL PROPERTY & INDEMNIFICATION
Provider shall indemnify, defend, and hold harmless Client against any and all third-party intellectual property or patent claims with NO liability cap.

5. SERVICE LEVEL AGREEMENT (SLA)
Provider guarantees 99.9% monthly platform availability. For downtime exceeding 0.1%, Client is entitled to a 10% credit on the monthly prorated fee.`;

export const DEMO_SERVICE_COMPARISON: ComparisonResult = {
  docAId: 'doc_service_v1',
  docAName: 'Cloud Services Agreement v1.0 (Draft)',
  docBId: 'doc_service_v2',
  docBName: 'Cloud Services Agreement v2.0 (Final Negotiated)',
  overviewSummary: 'Comparing Version 1.0 against Version 2.0 reveals 7 substantial negotiated modifications. Annual fees increased by $5,000 (from $25,000 to $30,000), payment terms tightened from Net 30 to Net 15, contract duration doubled from 12 to 24 months with added automatic renewal, notice for termination lengthened to 60 days, and Provider liability caps for data breach/IP indemnification became uncapped while Client liability remains strictly limited.',
  stats: {
    totalChanges: 7,
    addedCount: 1,
    removedCount: 0,
    modifiedCount: 5,
    unchangedCount: 1,
    financialChanges: 2,
    deadlineChanges: 2,
    obligationChanges: 2,
    terminationChanges: 1
  },
  differences: [
    {
      id: 'diff_1',
      title: 'Annual Subscription Fee & Payment Terms',
      category: 'Payments',
      changeType: 'modified',
      beforeText: 'annual subscription fee of $25,000.00 USD... payable within thirty (30) days of receipt (Net 30). Late payments incur a charge of 1.0% per month.',
      afterText: 'annual subscription fee of $30,000.00 USD... payable within fifteen (15) days of receipt (Net 15). Late payments incur a charge of 2.0% per month.',
      summary: 'Annual fee increased by $5,000 (+20%). Invoicing window reduced from 30 days to 15 days, and late fee doubled to 2.0%/month.',
      practicalSignificance: 'Increases Client cash outlay by $5,000 annually and requires accounts payable to expedite processing to 15 days.',
      financialImpact: '+$5,000/yr ($30,000 vs $25,000)',
      attentionLevel: 'Important',
      evidenceBefore: {
        documentId: 'doc_service_v1',
        documentName: 'Service_Agreement_v1.txt',
        page: 1,
        section: 'Section 1. FEES & INVOICING',
        sourceText: 'annual subscription fee of $25,000.00 USD... payable within thirty (30) days of receipt (Net 30).',
        confidence: 0.99
      },
      evidenceAfter: {
        documentId: 'doc_service_v2',
        documentName: 'Service_Agreement_v2.txt',
        page: 1,
        section: 'Section 1. FEES & INVOICING',
        sourceText: 'annual subscription fee of $30,000.00 USD... payable within fifteen (15) days of receipt (Net 15).',
        confidence: 0.99
      }
    },
    {
      id: 'diff_2',
      title: 'Term Length & Termination Notice Window',
      category: 'Term & Termination',
      changeType: 'modified',
      beforeText: 'initial term of twelve (12) months. Either party may terminate this Agreement without cause upon providing thirty (30) days\' prior written notice.',
      afterText: 'initial term of twenty-four (24) months. Either party may terminate this Agreement without cause upon providing sixty (60) days\' prior written notice.',
      summary: 'Commitment duration doubled from 1 year (12 months) to 2 years (24 months). Termination notice increased from 30 days to 60 days.',
      practicalSignificance: 'Locks Client into a longer multi-year commercial commitment totaling $60,000 over 2 years instead of $25,000.',
      financialImpact: '$60,000 total commitment over 24 months',
      attentionLevel: 'High Attention',
      evidenceBefore: {
        documentId: 'doc_service_v1',
        documentName: 'Service_Agreement_v1.txt',
        page: 1,
        section: 'Section 2. TERM & TERMINATION',
        sourceText: 'initial term of twelve (12) months... thirty (30) days\' prior written notice.',
        confidence: 0.98
      },
      evidenceAfter: {
        documentId: 'doc_service_v2',
        documentName: 'Service_Agreement_v2.txt',
        page: 1,
        section: 'Section 2. TERM & TERMINATION',
        sourceText: 'initial term of twenty-four (24) months... sixty (60) days\' prior written notice.',
        confidence: 0.99
      }
    },
    {
      id: 'diff_3',
      title: 'Automatic Renewal Provision Added',
      category: 'Renewal',
      changeType: 'added',
      beforeText: 'No automatic renewal clause existed in v1.0.',
      afterText: 'The contract automatically renews unless non-renewal notice is served 60 days before expiry.',
      summary: 'Added an automatic evergreen renewal clause requiring affirmative 60 days notice to prevent extension.',
      practicalSignificance: 'Failure to calendar the 60-day cutoff date will automatically extend the service contract for another multi-year cycle.',
      attentionLevel: 'Important',
      evidenceAfter: {
        documentId: 'doc_service_v2',
        documentName: 'Service_Agreement_v2.txt',
        page: 1,
        section: 'Section 2. TERM & TERMINATION',
        sourceText: 'The contract automatically renews unless non-renewal notice is served 60 days before expiry.',
        confidence: 0.98
      }
    },
    {
      id: 'diff_4',
      title: 'Liability Cap Carve-Outs for Provider Data Breach & IP',
      category: 'Liability',
      changeType: 'modified',
      beforeText: 'total aggregate liability arising out of or related to this Agreement shall exceed the total amount paid by Client to Provider during the twelve (12) months preceding...',
      afterText: 'Client\'s total liability is capped at 1x annual fees ($30,000). Provider\'s liability for data breaches, confidentiality breaches, and intellectual property infringement shall be UNCAPPED.',
      summary: 'Mutual 1x cap was converted into an asymmetric cap: Client liability remains protected at 1x fees, while Provider bears uncapped risk for data breaches and IP infringement.',
      practicalSignificance: 'Substantially strengthens Client legal protection against third-party cybersecurity or IP claims.',
      attentionLevel: 'Review',
      evidenceBefore: {
        documentId: 'doc_service_v1',
        documentName: 'Service_Agreement_v1.txt',
        page: 1,
        section: 'Section 3. LIMITATION OF LIABILITY',
        sourceText: 'Neither party\'s total aggregate liability... shall exceed the total amount paid...',
        confidence: 0.97
      },
      evidenceAfter: {
        documentId: 'doc_service_v2',
        documentName: 'Service_Agreement_v2.txt',
        page: 1,
        section: 'Section 3. LIMITATION OF LIABILITY',
        sourceText: 'Provider\'s liability for data breaches, confidentiality breaches, and intellectual property infringement shall be UNCAPPED.',
        confidence: 0.98
      }
    },
    {
      id: 'diff_5',
      title: 'Uncapped IP Indemnification Protection',
      category: 'Indemnity',
      changeType: 'modified',
      beforeText: 'indemnify Client against third-party copyright claims up to the maximum liability cap set forth in Section 3.',
      afterText: 'Provider shall indemnify, defend, and hold harmless Client against any and all third-party intellectual property or patent claims with NO liability cap.',
      summary: 'Provider indemnity expanded from basic copyright to include patents with full defense obligations and zero dollar ceiling.',
      practicalSignificance: 'Client is fully insulated if Provider software infringes competitor patents.',
      attentionLevel: 'Review',
      evidenceBefore: {
        documentId: 'doc_service_v1',
        documentName: 'Service_Agreement_v1.txt',
        page: 1,
        section: 'Section 4',
        sourceText: '...up to the maximum liability cap set forth in Section 3.',
        confidence: 0.96
      },
      evidenceAfter: {
        documentId: 'doc_service_v2',
        documentName: 'Service_Agreement_v2.txt',
        page: 1,
        section: 'Section 4',
        sourceText: '...against any and all third-party intellectual property or patent claims with NO liability cap.',
        confidence: 0.99
      }
    },
    {
      id: 'diff_6',
      title: 'SLA Availability Guarantee Increased to 99.9%',
      category: 'Service Level Agreement',
      changeType: 'modified',
      beforeText: 'guarantees 99.5% monthly platform availability... 5% credit on the monthly prorated fee.',
      afterText: 'guarantees 99.9% monthly platform availability... 10% credit on the monthly prorated fee.',
      summary: 'Uptime guarantee increased from 99.5% to 99.9% (reducing allowed downtime from ~3.6 hrs to ~43 mins/mo). SLA penalty credit doubled to 10%.',
      practicalSignificance: 'Improves operational reliability and provides higher financial recourse for outages.',
      attentionLevel: 'Informational',
      evidenceBefore: {
        documentId: 'doc_service_v1',
        documentName: 'Service_Agreement_v1.txt',
        page: 1,
        section: 'Section 5. SLA',
        sourceText: 'guarantees 99.5% monthly platform availability... 5% credit',
        confidence: 0.98
      },
      evidenceAfter: {
        documentId: 'doc_service_v2',
        documentName: 'Service_Agreement_v2.txt',
        page: 1,
        section: 'Section 5. SLA',
        sourceText: 'guarantees 99.9% monthly platform availability... 10% credit',
        confidence: 0.99
      }
    }
  ]
};

export const DEMO_FREELANCE_ANALYSIS: DocumentAnalysis = {
  overview: {
    id: 'doc_freelance_002',
    title: 'Independent Contractor Consulting Agreement — TechVentures Inc',
    type: 'Consulting & Freelance Agreement',
    parties: ['TechVentures Inc. (Client)', 'Alex Morgan Consulting (Contractor)'],
    effectiveDate: 'November 1, 2026',
    expiryDate: 'April 30, 2027',
    jurisdiction: 'State of Delaware, United States',
    language: 'English',
    pageCount: 3,
    confidence: 0.97,
    analysisTimestamp: '2026-09-20T05:10:00.000Z',
    rawText: `INDEPENDENT CONTRACTOR CONSULTING AGREEMENT

This Agreement is made on November 1, 2026, between TechVentures Inc. ("Client") and Alex Morgan ("Contractor").

1. SCOPE OF WORK & DELIVERABLES
Contractor agrees to provide senior cloud architecture services as detailed in Statement of Work #1. Deliverables must meet acceptance criteria within ten (10) business days of submission.

2. COMPENSATION & PAYMENT TERMS
Client shall pay Contractor a fixed rate of $150.00 USD per hour, up to a maximum of 40 hours per week. Contractor shall submit bi-weekly invoices. Payment shall be due within Net-15 days of invoice date. Invoices unpaid after 30 days shall accrue interest at 1.0% per month.

3. INTELLECTUAL PROPERTY & WORK FOR HIRE
All inventions, code, designs, and work product created by Contractor shall be deemed "works made for hire" and owned exclusively by Client upon receipt of full payment. Contractor retains rights to pre-existing background IP.

4. NON-SOLICITATION & NON-COMPETE RESTRICTIONS
During the term of this Agreement and for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide consulting services to any direct competitor of Client in North America, nor solicit any employee or client of Client.

5. TERMINATION & CURE PERIOD
Either party may terminate this Agreement without cause upon fourteen (14) days' written notice. Client may terminate immediately for material breach if uncured after five (5) business days.

6. LIMITATION OF LIABILITY
Contractor's total cumulative liability under this Agreement shall not exceed the total fees actually received by Contractor during the preceding three (3) months ($36,000 USD cap), except for breaches of confidentiality.

7. GOVERNING LAW & ARBITRATION
This Agreement shall be governed by Delaware law. Any disputes shall be submitted to binding confidential arbitration before the American Arbitration Association in Wilmington, Delaware.`
  },
  executiveSummary: {
    whatThisIs: 'A 6-month commercial consulting agreement for hourly software architecture services ($150/hr), containing restrictive 24-month non-compete covenants, Net-15 payment terms, and Delaware arbitration.',
    whoIsInvolved: 'TechVentures Inc. (Client) and Alex Morgan (Contractor).',
    expectedResponsibilities: 'Consultant delivers software architecture milestones; client conducts acceptance review within 10 days and pays bi-weekly invoices Net-15.',
    durationAndTerm: 'Effective November 1, 2026 through April 30, 2027 (6 months), terminable on 14 days written notice.',
    financialSummary: '$150/hour, up to 40 hours/week (~$24,000/month maximum), paid bi-weekly Net-15.',
    howTerminationWorks: '14 days written notice for convenience by either party, or immediate termination upon 5 business days notice for uncured material breach.',
    failureConsequences: 'Late invoice penalty of 1.0%/month after 30 days; breach of non-compete or confidentiality exposes contractor to injunctive relief and legal fees.',
    keyThingsToReview: 'The 24-month post-termination non-compete clause across all of North America is unusually restrictive for an independent contractor and may be unenforceable or severely hinder future consulting work.'
  },
  clauses: [
    {
      id: 'c_free_1',
      title: 'Hourly Compensation & Net-15 Terms',
      section: 'Section 2. COMPENSATION & PAYMENT TERMS',
      page: 1,
      category: 'Payments',
      originalText: 'Client shall pay Contractor a fixed rate of $150.00 USD per hour, up to a maximum of 40 hours per week. Contractor shall submit bi-weekly invoices. Payment shall be due within Net-15 days of invoice date.',
      plainExplanation: 'You earn $150 per hour capped at 40 hours per week. Invoices are submitted every two weeks and the client has 15 days to pay you. Late invoices gain 1% interest per month after 30 days.',
      explain15: 'You get paid $150 an hour for your work, up to 40 hours a week. You send a bill every two weeks, and they must pay within 15 days.',
      attentionLevel: 'Informational',
      affects: 'Contractor and Client',
      financialImpact: '$150/hr (approx $6,000/week or $24,000/month)',
      timeImpact: 'Bi-weekly billing with Net-15 day payment terms',
      whyItMatters: 'Establishes steady cash flow, but requires tracking hours accurately and promptly following up on invoices.',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'Client shall pay Contractor a fixed rate of $150.00 USD per hour, up to a maximum of 40 hours per week. Contractor shall submit bi-weekly invoices. Payment shall be due within Net-15 days...',
        confidence: 0.99
      }
    },
    {
      id: 'c_free_2',
      title: 'Restrictive 24-Month Non-Compete & Non-Solicitation Covenant',
      section: 'Section 4. NON-SOLICITATION & NON-COMPETE',
      page: 2,
      category: 'Non-compete / non-solicit',
      originalText: '...for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide consulting services to any direct competitor of Client in North America...',
      plainExplanation: 'For 2 full years after this contract ends, you are legally barred from doing consulting work for any competitor of the client anywhere in North America.',
      explain15: 'For 2 whole years after you finish, they say you cannot work for any other tech company in the same business anywhere in the continent.',
      attentionLevel: 'High Attention',
      affects: 'Contractor only (heavy asymmetry)',
      financialImpact: 'Potential severe loss of consulting income in your specialized domain for 24 months',
      timeImpact: '24 months post-termination duration',
      whyItMatters: 'Broad non-compete clauses for independent contractors are often overbroad, difficult to enforce in many jurisdictions, and restrict your ability to earn a living.',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 2,
        section: 'Section 4',
        sourceText: '...for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide consulting services to any direct competitor of Client in North America...',
        confidence: 0.98
      }
    },
    {
      id: 'c_free_3',
      title: 'Work For Hire IP Assignment Conditioned on Payment',
      section: 'Section 3. INTELLECTUAL PROPERTY',
      page: 1,
      category: 'Intellectual Property',
      originalText: '...work product created by Contractor shall be deemed "works made for hire" and owned exclusively by Client upon receipt of full payment.',
      plainExplanation: 'Client owns all code and deliverables you write, but ownership only transfers to them upon receipt of full payment.',
      explain15: 'The client owns whatever code you make for them, but only after they actually pay you in full.',
      attentionLevel: 'Review',
      affects: 'Contractor and Client',
      financialImpact: 'Protects contractor against unpaid work',
      timeImpact: 'Transfers upon payment execution',
      whyItMatters: 'Conditioning assignment upon full payment is an essential safeguard for freelancers against non-paying clients.',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 1,
        section: 'Section 3',
        sourceText: '...work product created by Contractor shall be deemed "works made for hire" and owned exclusively by Client upon receipt of full payment.',
        confidence: 0.96
      }
    },
    {
      id: 'c_free_4',
      title: 'Liability Cap at 3 Months Fees',
      section: 'Section 6. LIMITATION OF LIABILITY',
      page: 2,
      category: 'Liability',
      originalText: 'Contractor\'s total cumulative liability under this Agreement shall not exceed the total fees actually received by Contractor during the preceding three (3) months...',
      plainExplanation: 'The maximum damages anyone can claim against you is limited to the money you received in the prior 3 months (approx $36,000), protecting your personal assets.',
      explain15: 'If something goes wrong, the most they can sue you for is what they paid you over the last 3 months.',
      attentionLevel: 'Important',
      affects: 'Contractor exposure',
      financialImpact: 'Capped at roughly $36,000 USD',
      timeImpact: 'Trailing 3-month lookback window',
      whyItMatters: 'Prevents unlimited catastrophic liability exposure from software bugs or system downtime.',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 2,
        section: 'Section 6',
        sourceText: 'Contractor\'s total cumulative liability under this Agreement shall not exceed the total fees actually received by Contractor during the preceding three (3) months...',
        confidence: 0.98
      }
    }
  ],
  attentionItems: [
    {
      id: 'att_free_1',
      title: 'Overbroad 24-Month Non-Compete Territory',
      category: 'Restrictive Covenants',
      attentionLevel: 'High Attention',
      detectedIssue: 'A 2-year non-compete covering all of North America is unusually restrictive for an independent contractor role.',
      whyItDeservesAttention: 'May prevent taking future consulting contracts with other software and cloud technology firms.',
      whatUserShouldClarify: 'Negotiate to completely strike the non-compete clause, limiting restrictions strictly to non-solicitation of active clients and employees.',
      professionalReviewAdvice: 'Have an employment lawyer review enforceability under your home state laws (e.g. California and several states render contractor non-competes void).',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 2,
        section: 'Section 4',
        sourceText: '...for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide consulting services to any direct competitor of Client in North America...',
        confidence: 0.98
      }
    }
  ],
  obligations: [
    {
      id: 'ob_free_1',
      title: 'Bi-Weekly Time & Invoice Submission',
      responsibleParty: 'Alex Morgan (Contractor)',
      deadline: 'Every two weeks',
      trigger: 'Completion of 2-week consulting cycle',
      frequency: 'On Event',
      amount: '$150/hr up to 40 hrs/wk',
      consequence: 'Delay in payment processing',
      sourceClause: 'Section 2',
      confidence: 0.99,
      completed: false,
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'Contractor shall submit bi-weekly invoices.',
        confidence: 0.99
      }
    },
    {
      id: 'ob_free_2',
      title: 'Invoice Payment within Net-15 Days',
      responsibleParty: 'TechVentures Inc. (Client)',
      deadline: '15 calendar days from invoice receipt',
      trigger: 'Receipt of contractor invoice',
      frequency: 'Monthly',
      amount: 'Billed hours * $150',
      consequence: '1.0% interest accrual per month after 30 days',
      sourceClause: 'Section 2',
      confidence: 0.98,
      completed: false,
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'Payment shall be due within Net-15 days of invoice date.',
        confidence: 0.98
      }
    }
  ],
  deadlines: [
    {
      id: 'dl_free_1',
      title: 'Deliverable Review & Acceptance Window',
      dateOrTimeline: 'Within 10 business days of submission',
      isRelative: true,
      significance: 'Client must approve or request revisions within 10 days; otherwise deliverables are deemed accepted.',
      page: 1,
      section: 'Section 1',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 1,
        section: 'Section 1',
        sourceText: 'Deliverables must meet acceptance criteria within ten (10) business days of submission.',
        confidence: 0.97
      }
    },
    {
      id: 'dl_free_2',
      title: 'Convenience Termination Notice',
      dateOrTimeline: '14 calendar days advance notice',
      isRelative: true,
      significance: 'Required written notice if either party desires to end the engagement before April 30, 2027.',
      page: 2,
      section: 'Section 5',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 2,
        section: 'Section 5',
        sourceText: 'Either party may terminate this Agreement without cause upon fourteen (14) days\' written notice.',
        confidence: 0.99
      }
    }
  ],
  financialItems: [
    {
      id: 'fin_free_1',
      label: 'Hourly Consulting Rate',
      amount: '$150.00 / hour',
      currency: 'USD',
      timingType: 'recurring',
      description: 'Standard hourly billable rate capped at 40 hours weekly.',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'fixed rate of $150.00 USD per hour, up to a maximum of 40 hours per week.',
        confidence: 0.99
      }
    },
    {
      id: 'fin_free_2',
      label: 'Late Payment Interest Penalty',
      amount: '1.0% per month',
      currency: 'USD',
      timingType: 'penalties',
      description: 'Interest charged on overdue invoices past 30 days.',
      evidence: {
        documentId: 'doc_freelance_002',
        documentName: 'Consulting_Agreement.txt',
        page: 1,
        section: 'Section 2',
        sourceText: 'Invoices unpaid after 30 days shall accrue interest at 1.0% per month.',
        confidence: 0.98
      }
    }
  ],
  inconsistencies: [],
  missingInformation: [
    {
      id: 'miss_free_1',
      title: 'Missing "Statement of Work #1"',
      missingElement: 'Statement of Work #1 (SOW #1)',
      category: 'Unattached Schedule',
      whyImportant: 'Section 1 refers to SOW #1 for the scope of work and deliverables, but the SOW is not attached.',
      recommendation: 'Attach and review SOW #1 before signing to ensure milestones, deliverables, and expectations are clearly defined.'
    }
  ],
  lawyerQuestions: [
    {
      id: 'lq_free_1',
      question: 'Is the 24-month North American non-compete enforceable against an independent contractor under Delaware and my local state law?',
      rationale: 'Non-compete provisions for contractors face increasing legal scrutiny and might be void or overbroad.',
      priority: 'High',
      relatedSection: 'Section 4'
    },
    {
      id: 'lq_free_2',
      question: 'Should we replace the Delaware arbitration clause with local municipal courts or mutual mediation?',
      rationale: 'Arbitration under AAA rules in Delaware can be expensive for an individual contractor if a payment dispute arises.',
      priority: 'Medium',
      relatedSection: 'Section 7'
    }
  ]
};

export const DEMO_DOCUMENTS = [
  {
    id: 'doc_rental_001',
    name: 'Residential Lease Agreement (Rental)',
    type: 'Lease Contract',
    size: '14.2 KB',
    pages: 3,
    analysis: DEMO_RENTAL_ANALYSIS
  },
  {
    id: 'doc_freelance_002',
    name: 'Independent Contractor Consulting Agreement',
    type: 'Consulting & IP Agreement',
    size: '10.5 KB',
    pages: 3,
    analysis: DEMO_FREELANCE_ANALYSIS
  },
  {
    id: 'doc_service_v1',
    name: 'Cloud Services Agreement v1.0 (Draft)',
    type: 'Master Services Agreement',
    size: '8.4 KB',
    pages: 2,
    rawText: DEMO_SERVICE_V1_TEXT
  },
  {
    id: 'doc_service_v2',
    name: 'Cloud Services Agreement v2.0 (Negotiated)',
    type: 'Master Services Agreement',
    size: '9.1 KB',
    pages: 2,
    rawText: DEMO_SERVICE_V2_TEXT
  }
];

