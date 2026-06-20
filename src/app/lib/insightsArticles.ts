// Full long-form Insights articles, rendered by ArticlePage at /insights/:slug
// Each article is a list of typed blocks so ArticlePage can style them consistently.

export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "ul"; items: string[] }
  | { type: "cta"; text: string; label: string };

export interface Article {
  slug: string;
  category: string;
  title: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;        // lead paragraph shown large under the title
  blocks: Block[];
}

export const insightsArticles: Article[] = [
  {
    slug: "edi-is-not-a-legacy-problem",
    category: "EDI Strategy",
    title: "EDI is not a legacy problem — it is a competitive advantage",
    readTime: "8 min read",
    metaTitle: "EDI Is Not A Legacy Problem | Exceptional Solutions",
    metaDescription:
      "EDI was supposed to die a decade ago. It didn't — because what it does cannot be replaced. The strategic case for treating EDI as a competitive advantage, not a burden.",
    intro:
      "EDI was supposed to die a decade ago. It didn't. There is a reason for that, and the reason matters.",
    blocks: [
      { type: "p", text: "For most of the last ten years, the consensus in enterprise integration has been clear: EDI is the past, APIs are the future, and the question for any sensible CIO is how quickly to move from one to the other. Whole modernization programs have been sold on this premise. Entire integration platforms have been positioned around it." },
      { type: "p", text: "The premise is wrong — and the enterprises that have believed it most enthusiastically are now paying for it." },
      { type: "p", text: "Industry data tells a different story than the marketing. Despite a decade of \"EDI is dead\" rhetoric, EDI still carries the dominant share of supply-chain B2B traffic. North America's EDI software market is firmly anchored by ANSI X12 — 38.31% of global revenue in 2024, according to Mordor Intelligence. The five largest retailers in the United States moved tens of billions of dollars of merchandise last year, and every one of them did it on EDI." },
      { type: "p", text: "This article makes a different case. EDI is not the burden it has been positioned as. Run well, it is a competitive advantage — and the gap between enterprises that have invested in their EDI estates and those that have neglected them is now wide enough to show up on the P&L." },
      { type: "h2", text: "The \"EDI is dead\" narrative — and what it has cost enterprises" },
      { type: "p", text: "The pitch most CIOs have been receiving for the better part of a decade goes something like this. EDI is old. EDI is batch. EDI is the protocol your grandfather used. Modern B2B is real-time, event-driven, API-led. Replatform now or fall behind." },
      { type: "p", text: "This pitch has done real damage. It has justified under-investment in EDI estates that now process more volume than ever. It has positioned EDI engineering as a career dead-end, hollowing out the talent base that keeps the platforms running. It has created modernization programs that ran for two years, replaced perfectly serviceable EDI infrastructure with API-first platforms, and then quietly added back EDI capability eighteen months later when trading partners refused to play along." },
      { type: "p", text: "The problem is not that APIs are bad. APIs are excellent — for the things they are good at. The problem is that the narrative confused two questions: \"what is the most modern integration pattern?\" and \"what does my business actually need?\" The answer to the first is APIs. The answer to the second, for any enterprise trading with a large external partner network, is still mostly EDI." },
      { type: "quote", text: "Every quarter, we are asked to clean up an estate where the API-first narrative was taken too literally. EDI is still 80 to 90 percent of the trading volume. The modernization conversation has to start there.", cite: "Exceptional Solutions Integration Practice" },
      { type: "h2", text: "What EDI is genuinely good at — and APIs aren't" },
      { type: "p", text: "The case for EDI is not a case against APIs. It is a case for understanding what each is built to do." },
      { type: "p", text: "EDI is good at mandated standards. A retailer doesn't care that you prefer REST. They send X12. Walmart's compliance program is built on X12. Costco made full EDI compliance mandatory for all suppliers in 2024. Amazon's vendor program runs on X12. These are not legacy decisions — they are operational decisions, made by enterprises that move billions of dollars of goods through their networks and need a common language that every partner can speak. Standards are the value." },
      { type: "p", text: "EDI is good at multi-party trading networks. A modern retail or logistics enterprise trades with hundreds to thousands of partners, each with different technical sophistication. The lowest common denominator across that network is EDI — and that is the value, because it is what makes the network function at all. APIs work brilliantly when both ends of the connection are within your control. They struggle when one end is a regional distributor whose IT team is two people and a managed service." },
      { type: "p", text: "EDI is good at auditability and compliance. SOX, HIPAA, OFTP2, CAQH CORE — the audit frameworks that govern enterprise trade have been built around EDI for decades. The transaction set is structured. The acknowledgment chain is built in. The audit trail is native. APIs can satisfy these requirements, but they don't satisfy them by default. EDI does." },
      { type: "p", text: "EDI handles the long tail. Roughly 20% of trading partners drive 80% of volume. The other 80% of partners are EDI-only, will remain EDI-only, and would cost more to migrate to APIs than the trade with them is worth. Any integration strategy that pretends otherwise will, eventually, be quietly amended." },
      { type: "h2", text: "Where APIs are the answer" },
      { type: "p", text: "APIs win, decisively, in three places. Intra-enterprise integration is API territory — connecting your ERP to your WMS, your CRM to your billing system, your data warehouse to your analytics platform. New trading partners with technical maturity are API candidates: if a partner has a modern API platform and the team to support it, opening an API connection is faster and more observable than provisioning an EDI map. And real-time use cases — inventory visibility, status updates, event-driven reconciliation — are API territory, because EDI is a transaction protocol, not designed for sub-second event flow." },
      { type: "p", text: "The modern integration estate is not EDI or APIs. It is EDI at the partner edge, APIs in the back office, managed file transfer between them, and a discipline that knows which to use where. Every enterprise we work with that does this well treats it as architecture, not religion." },
      { type: "h2", text: "Why EDI is becoming a competitive advantage again" },
      { type: "p", text: "The interesting development in 2025 and 2026 is that the compliance landscape around EDI is hardening, not softening. The penalties for getting it wrong are larger. The retailers enforcing them are stricter. And the enterprises that execute EDI well are pulling ahead of the ones that don't." },
      { type: "ul", items: [
        "Walmart's OTIF program assesses a 3% penalty on the cost of goods for shipments that miss its 98% compliance threshold — millions of dollars per year for a mid-size CPG supplier, deducted before payment.",
        "Amazon launched a new \"In Full Delivery\" chargeback in July 2025, adding another penalty layer on top of an already-stringent vendor compliance program.",
        "Costco made full EDI compliance mandatory in 2024, with thousands of suppliers required to test through SPS Commerce before going live.",
        "Home Depot imposes some of the highest per-incident penalties in the industry — $1,000 per missing ASN, $250 for a late one.",
      ] },
      { type: "p", text: "None of this is hypothetical. These are line-item deductions that appear on remittance advice, often weeks after the original shipment. The enterprises that have invested in their EDI estates — clean validation, accurate ASNs, correct labels, on-time transmission — are getting paid in full. The enterprises that haven't are losing margin every month and often don't know how much." },
      { type: "p", text: "This is the inversion that the \"EDI is dead\" narrative missed. EDI is no longer the cost of being in business. For enterprises that execute it well, it has become a source of margin protection — and for enterprises that execute it badly, a source of margin leakage." },
      { type: "h2", text: "The proof point — 5 years, 100+ partners, $1.3M+ saved" },
      { type: "p", text: "Exceptional Solutions has run a continuous EDI engagement with PSA BDP — one of the world's most complex logistics networks — for over 5 years. The numbers are real and approved:" },
      { type: "ul", items: [
        "5+ years of continuous partnership",
        "100+ trading partners onboarded",
        "0 critical outages during platform migrations",
        "$1.3M+ in annual operating costs avoided",
        "67% reduction in support FTE requirement",
        "98%+ EDI success rate",
      ] },
      { type: "p", text: "This is not despite EDI being EDI. It is because of it. The same operating discipline that produced these numbers — multi-platform depth across IBM Sterling, Oracle Integration Cloud, AS2 and SFTP; the managed-service model that protects production; the partner-onboarding framework that compresses weeks to days — is exactly what turns an EDI estate from cost center to competitive advantage." },
      { type: "quote", text: "5 years in, they still haven't dropped the ball on production.", cite: "PSA BDP Integration Leadership" },
      { type: "h2", text: "What CIOs should do next" },
      { type: "p", text: "Audit the assumption. If your integration strategy has been written around the premise that EDI is going away, revisit it — the premise has not held up. Quantify the exposure: run a 30-day chargeback audit and look at the deductions that have hit your remittance advice in the last quarter, by retailer and reason code. Separate the platform decision from the operating-model decision — a great platform run by an underfunded team produces poor outcomes. And treat EDI as architecture, not religion: use APIs where they win, EDI where it wins, managed file transfer between them." },
      { type: "cta", text: "Have a 60-minute strategy session with a senior integration architect. No obligation, no sales pitch. We will review the shape of your current estate and give you a clear, honest picture of where it is working, where it is at risk, and what would actually pay back.", label: "Book a strategy session" },
    ],
  },
  {
    slug: "cost-of-a-failed-edi-transaction",
    category: "Supply Chain",
    title: "What a single failed EDI transaction actually costs a retailer",
    readTime: "7 min read",
    metaTitle: "What A Single Failed EDI Transaction Actually Costs | Exceptional Solutions",
    metaDescription:
      "A failed EDI transaction is rarely just a failed transaction. It's a chargeback, a delayed payment, and a margin hit. The honest cost — calculated by retailer.",
    intro:
      "A single missed ASN at Home Depot costs $1,000. A single mismatched carton at Costco costs up to $10. A single OTIF miss at Walmart costs 3% of the cost of goods on that shipment. None of these are theoretical.",
    blocks: [
      { type: "p", text: "For most enterprises trading with major retailers, EDI failures are filed in IT's column on the responsibility chart. They are treated as technical incidents — something for the integration team to fix, something that never quite makes it onto the CFO's agenda." },
      { type: "p", text: "This is the wrong column. EDI failures are not a technical problem with a financial side-effect. They are a financial problem with a technical cause. And the cost — properly added up — is large enough, at most enterprises, to fund the modernization that would prevent it several times over." },
      { type: "p", text: "This article does the math. Retailer by retailer. Cost category by cost category. Using only verified penalty schedules and industry-benchmark data — no invented numbers, no fabricated client outcomes." },
      { type: "h2", text: "The four costs of a single failed EDI transaction" },
      { type: "p", text: "When an EDI transaction fails — a late ASN, a mismatched invoice, an incorrect GS1-128 label, an envelope rejected by the trading partner's system — the cost shows up in four places. Most enterprises see only the first." },
      { type: "ul", items: [
        "The direct cost is the compliance penalty itself — the line item that arrives on the remittance advice, deducted before payment. It is the only one of the four an enterprise sees clearly.",
        "The indirect cost is delayed payment and working-capital drag. A flagged invoice does not get paid on its original terms; the cost of that held capital is absorbed quietly.",
        "The hidden cost is the manual rework time of finance, supply chain, and IT teams. Industry data suggests IT teams alone spend 20 to 40 hours per partner managing EDI configurations and resolving errors.",
        "The strategic cost is the vendor scorecard impact. Persistent failures push your score down, affecting SKU allocation, launch support, and which suppliers get invited to compete for new categories. This cost is the largest and hardest to see.",
      ] },
      { type: "h2", text: "The penalty schedule — by major retailer" },
      { type: "p", text: "What follows is not commentary. It is the published, enforced penalty schedule of the five retailers most enterprises trade with." },
      { type: "p", text: "Walmart OTIF — the most consequential compliance program in retail. Walmart applies a 3% penalty on the cost of goods for shipments that miss its 98% compliance threshold, measured at the PO line level on both on-time delivery and in-full quantity. The ASN must be transmitted within a defined window, with strict labeling and packaging requirements." },
      { type: "p", text: "Costco made full EDI compliance mandatory for all suppliers in 2024. With 891 warehouses and $275.2 billion in FY25 revenue, the program is scaled to match. Late ASNs trigger penalties or shipping holds. Incorrect GS1-128 labels cost $5 to $10 per carton. Each supplier must test through SPS Commerce before going live." },
      { type: "p", text: "Amazon — penalties run $5 to $10 per carton for incorrect or unreadable GS1-128 labels. Late ASNs trigger chargebacks plus manual holds at receiving. In July 2025, Amazon added a new \"In Full Delivery\" chargeback for US and Canadian vendors." },
      { type: "p", text: "Home Depot has the highest per-ASN penalty in the industry. $1,000 per missing ASN. $250 per late ASN. $100 per incorrect or missing TMS Ship ID. A single shipment without an Advance Shipping Notice can cost more than many suppliers' monthly EDI platform fees." },
      { type: "p", text: "Target — increasingly stringent. New ASN Accuracy enforcement in 2025. EDI non-compliance penalties run 1% of invoice or $250, whichever is greater. Late invoices beyond 90 days of delivery: $200 per order." },
      { type: "quote", text: "These penalties were originally designed to recover the retailer's costs. They have evolved into significant profit centers. Most suppliers are still treating chargebacks as occasional accidents, not as a structural cost." },
      { type: "h2", text: "The honest unit economics" },
      { type: "p", text: "Three industry benchmarks set the size of the problem. Chargeback rates typically run 0.2% to 0.5% of all B2B retail transactions (BOLD VAN). At an enterprise processing 100,000 retail transactions per year, that is 200 to 500 chargebacks annually. At a conservative blended average of $300 per chargeback, that is roughly $100,000 to $150,000 per year in direct penalties alone — before working-capital drag, rework time, or scorecard impact." },
      { type: "p", text: "Retail chargebacks can consume up to 5% of a supplier's annual revenue (OrderEase) for suppliers with weak EDI operations. For a $500 million CPG enterprise, that is $25 million of margin exposure — annually, recurring, deductible against an integration estate that probably costs less than $2 million per year to modernize properly." },
      { type: "h2", text: "A worked example" },
      { type: "p", text: "Consider a mid-size enterprise — $1.2 billion of trade across major retailers, processing 240,000 EDI transactions annually. At a 0.4% failure rate, that is 960 chargebacks per year. At a blended average penalty of $400, the direct cost is $384,000 per year — roughly a third of the real cost." },
      { type: "p", text: "Add working-capital drag on delayed payments: a 15-day average delay across the affected trade is another $300,000 to $500,000 annually. Add the rework time: 20 to 40 hours per affected partner across 200 to 400 partners is 8,000 to 16,000 hours, or another $600,000 to $1.3M annually loaded at $80 per hour. Add the strategic scorecard cost — usually the largest of the four. The total, for an enterprise in the middle of the distribution, runs $1.3 to $2.5 million per year." },
      { type: "quote", text: "This is not a process problem. It is a systems problem. People are not the failure mode — the workflow that hands them broken data is the failure mode." },
      { type: "h2", text: "Why this is a systems problem, not a process problem" },
      { type: "p", text: "When an enterprise sees a chargeback pattern develop, the instinctive response is to add process — better training, more checklists, a weekly review meeting. None of this works, because the root causes are upstream of the people:" },
      { type: "ul", items: [
        "ASN data that does not match the shipment hierarchy (incorrect quantities, missing carton counts, wrong pallet structure).",
        "GS1-128 labels that do not match the ASN data.",
        "ASNs transmitted outside the retailer's required window relative to physical shipment.",
        "Invoice data that does not reconcile to the original PO or ASN.",
        "997 functional acknowledgments not received, indicating envelopes that never reached the partner's system.",
        "Mismatched GTINs or item numbers when SKUs are updated without synchronizing internal systems.",
      ] },
      { type: "p", text: "Each is a data integrity problem, not a human discipline problem. The intervention that works is upstream: real-time validation against retailer companion guides before transmission, pre-transmission compliance checks, automated reconciliation between the EDI estate and the order management system, and 997 monitoring that surfaces missing acknowledgments inside hours rather than weeks." },
      { type: "h2", text: "How to size your own exposure" },
      { type: "p", text: "A three-step calculation any CFO can run. Step 1: estimate your annual retail EDI transactions, summed across all major retailer relationships. Step 2: apply a failure rate — use 0.4% as a starting point. Step 3: apply a blended average penalty of $300 to $500 per chargeback, weighted by your retailer mix. The output is your direct cost; roughly triple it to estimate the all-in cost across direct, indirect, hidden, and strategic." },
      { type: "cta", text: "Run a 30-day chargeback audit with us. A senior architect reviews your current chargeback exposure across major retailers, identifies the concentration of failure modes, and gives you a quantified view of what current EDI failures are actually costing your business. No obligation — the audit itself is the offer.", label: "Book a chargeback audit" },
    ],
  },
  {
    slug: "why-edi-migration-is-harder-than-you-think",
    category: "EDI Modernisation",
    title: "Why your EDI migration is harder than you think — and how to make it easier",
    readTime: "9 min read",
    metaTitle: "Why EDI Migrations Fail (And How To Make Yours Easier) | Exceptional Solutions",
    metaDescription:
      "Most EDI migrations are harder than the business case predicts. A senior practitioner's view on what actually goes wrong, what to do instead, and the test that decides if you should migrate at all.",
    intro:
      "Most EDI migrations don't fail in the technology. They fail in the operating model that was supposed to inherit it.",
    blocks: [
      { type: "p", text: "If you are a CIO or Director of Integration at a mid-to-large enterprise, you are probably being pitched an EDI migration right now. A Big 4 consultancy with a thirty-page deck. A tier-one systems integrator with a reference architecture that always seems to recommend the platform they implement most. A hyperscaler partner suggesting you replatform to \"cloud-native B2B\" — without quite defining what that means." },
      { type: "p", text: "The pitches are not wrong. But the version of an EDI migration that appears in the business case rarely survives contact with the production estate. The cost is higher than scoped. The timeline is longer than committed. And the platform you end up with — eighteen months later, six figures over budget — is operated by the same team, on the same operating model, that produced the problems you were trying to fix." },
      { type: "p", text: "This article is the honest view a senior practitioner would give a CIO over coffee, not the view a vendor would give in a pitch. The argument is uncomfortable: a significant fraction of the EDI migrations being pitched right now should not happen." },
      { type: "h2", text: "The modernization reflex — and the contrarian view" },
      { type: "p", text: "Every enterprise integration estate eventually feels its age. Maps written ten years ago by people who have since left. Business processes that have accumulated bespoke logic for forgotten reasons. An aging platform the vendor is signaling will eventually go end-of-life. The reflex is to modernize the platform. The board approves it. The migration program begins." },
      { type: "p", text: "The contrarian view — the one we hold and will defend in print — is that in roughly thirty to forty percent of the modernization proposals we are asked to second-opinion, the platform is not the problem. The team operating it is. The maps could be rationalized in place. The processes could be documented and cleaned. A managed-service overlay would extract more value than a replatform would deliver." },
      { type: "p", text: "Replatforming, in these cases, buys the enterprise eighteen months of distraction and a set of operational problems that look identical on day nineteen. The technology is new. The team is the same. This is not an argument against EDI modernization. It is an argument against modernization-by-reflex." },
      { type: "quote", text: "Roughly thirty to forty percent of the modernization proposals we are asked to second-opinion turn out to be operational-model problems, not platform problems. The right intervention is rarely the one the proposal recommends.", cite: "Exceptional Solutions Integration Practice" },
      { type: "h2", text: "The five-question test — does this migration need to happen?" },
      { type: "p", text: "When a client asks us to second-opinion a migration proposal, we work through a short test. If the answer to all five is \"no,\" the migration should not happen — and the budget should be redirected to the operating model." },
      { type: "ul", items: [
        "Is the platform genuinely end-of-life? Not \"the vendor is encouraging us to upgrade.\" End-of-life: last security patch announced, support contract terminating. If yes, migration is forced.",
        "Is a major trading partner mandating a protocol your current estate cannot support? A new OEM requiring OFTP2, a retailer moving off AS2, a payer enforcing a CAQH CORE SLA you can't meet. If yes, the timeline is not yours.",
        "Is there a recurring production incident pattern that honest diagnosis traces to the platform itself — not the operating model? Most trace to operating-model gaps. Occasionally they trace to genuine platform limits.",
        "Is the true fully-loaded cost of operating the current estate measurably above a modern alternative? Calculated, not assumed. Most enterprises are surprised when they actually run it.",
        "Is the current estate structurally incompatible with a strategic direction the business has already committed to? A new market, an acquisition with irreconcilable architectures, a regulatory change.",
      ] },
      { type: "p", text: "Five \"no\"s, and the migration probably should not happen — the right intervention is a managed-service overlay, a partner-onboarding framework, and a documentation program. One or more \"yes\"s, and the migration is warranted. But that is the start of the conversation, not the end." },
      { type: "h2", text: "Where EDI migrations actually break" },
      { type: "p", text: "For the migrations that are warranted, the failure modes are predictable — and rarely the ones the business case anticipates." },
      { type: "p", text: "It isn't the maps. It's the partner network. The maps are usually the most straightforward part. The hard part is re-onboarding every trading partner — coordinating test windows, re-certifying compliance, amending contract specifications, and managing partner-side resistance. GS1 US benchmark data places traditional partner onboarding at 8 to 12 weeks. Multiply by the partner count." },
      { type: "p", text: "The cutover problem. Migrating live, mission-critical EDI is not a planned maintenance window. The trading network does not stop. Freight does not stop. Orders do not stop. Most cutover plans we review underestimate the operational risk by an order of magnitude." },
      { type: "p", text: "The operating-model handoff. A modernized platform run by the same overworked team produces the same problems on the new platform. The platform got upgraded. The operating model didn't. Three months after go-live, the chargeback rate is approximately what it was before." },
      { type: "p", text: "The change-control debt. Every aging EDI estate has accumulated bespoke business rules that lived inside the platform and were never documented. The migration scopes the mapping and testing work, but rarely the archaeology required to discover and reproduce this logic — so rules nobody knew existed quietly break." },
      { type: "h2", text: "What a defensible migration approach looks like" },
      { type: "p", text: "For the migrations that should happen, the approach has four steps. None is novel. All are unevenly practiced." },
      { type: "ul", items: [
        "Assess before you commit. Run a paid, contract-free assessment by a partner with no commercial interest in the outcome. It answers two questions: should this happen at all, and if so, what is the honest scope.",
        "Modernize the operating model first, then the platform. Fixing the operating model first produces measurable improvement inside a quarter and ensures the team inheriting the new platform can operate it well.",
        "Phased cutover, partner by partner, with a rollback at every step. Start with the lowest-volume, lowest-risk partners, building the playbook before the high-volume partners move. Honest timelines run 40 to 60 percent longer than vendor pitches.",
        "Operate it for 90 days before declaring victory. A migration is complete when exception rates have stabilized and the operating model has shown it can run the estate without elevated incident volume — not on cutover-day-plus-one.",
      ] },
      { type: "quote", text: "The operational improvement we deliver in the 90 days before a migration is usually larger than the improvement from the migration itself. That sequencing is uncomfortable for vendors who want to start with the platform work. It is right for the enterprise." },
      { type: "p", text: "Exceptional Solutions has run a continuous EDI engagement with PSA BDP for over five years, executing major migrations across live, mission-critical flows, with verified outcomes:" },
      { type: "ul", items: [
        "Zero critical outages during platform migrations",
        "100+ trading partners onboarded and migrated",
        "98%+ EDI success rate maintained throughout",
        "$1.3M+ in annual operating costs avoided",
        "67% reduction in support FTE requirement",
      ] },
      { type: "p", text: "The outcomes are not despite the migrations being mission-critical. They are because the approach above was applied — operating-model modernization first, phased partner-by-partner cutover, rollback at every step, 90-day post-cutover stabilization." },
      { type: "h2", text: "What CIOs should do next" },
      { type: "p", text: "Pause on the migration decision long enough to run the five-question test. If the answer is \"this migration should probably not happen,\" the budget protects itself. If it is warranted, scope the operating-model work first — do not approve the platform-replacement program until the operating-model program is funded and has a named owner. And find a partner who will tell you when not to migrate." },
      { type: "cta", text: "Book an EDI migration assessment with a senior architect. No obligation. We will review your current estate, your proposed migration scope, and the operating model that will inherit the result — and tell you honestly whether the migration should happen, what it will actually cost, and what comes first. We may tell you not to migrate. That is the offer.", label: "Book a migration assessment" },
    ],
  },
  {
    slug: "hidden-cost-of-slow-edi-partner-onboarding",
    category: "B2B Integration",
    title: "The hidden cost of slow trading-partner onboarding",
    readTime: "7 min read",
    metaTitle: "The Hidden Cost of Slow EDI Partner Onboarding | Exceptional Solutions",
    metaDescription:
      "Onboarding a trading partner still takes 8-12 weeks at most enterprises. The honest cost isn't IT time — it's the revenue you don't recognize. A practitioner's view.",
    intro:
      "A trading partner that takes 12 weeks to onboard is 12 weeks of revenue you have not recognized, against a contract you have already signed.",
    blocks: [
      { type: "p", text: "Most enterprises classify trading-partner onboarding as an IT problem. The EDI team manages it. The integration team escalates when it stalls. The supply-chain team complains, occasionally, when a new partner is taking longer than expected to go live." },
      { type: "p", text: "This classification is wrong, and it is wrong in a way that costs real money. Trading-partner onboarding is not an IT throughput problem. It is a revenue recognition problem disguised as an IT throughput problem. Every week that a contracted partner sits in the onboarding queue is a week of trade that has been negotiated, signed, and budgeted — but is not yet flowing." },
      { type: "h2", text: "How long does onboarding actually take" },
      { type: "p", text: "The most cited industry benchmark is from GS1 US: traditional EDI partner onboarding takes 8 to 12 weeks. That figure has held remarkably steady for the better part of a decade. Cleo's published onboarding guide describes the same process as taking \"days to weeks.\" Industry observers across the ezCom, BOLD VAN, and Eradani analyses settle in the same range — 2 to 6 weeks for a simple partner with prebuilt maps, 8 to 12 weeks for a full standard onboarding, longer still where ERP integration is involved." },
      { type: "p", text: "The interesting thing is that this number has not improved meaningfully in years, despite a decade of platform investment and the proliferation of \"self-service\" portals. The reason is that the bottleneck is not the technology. It is the operating model around the technology." },
      { type: "h2", text: "The four costs the business case usually misses" },
      { type: "ul", items: [
        "Deferred revenue. Every week a partner is in the queue is a week of trade not flowing. For a $5M annualized partner relationship, every week of delay is roughly $100,000 of deferred revenue — functionally indistinguishable from lost revenue when it crosses a reporting boundary.",
        "Sales attrition. When fulfillment stalls because onboarding is taking three months, the partner relationship cools. Sometimes the partner cancels. More often the trust is damaged, and the next deal is harder.",
        "Compliance risk imported on day one. A rushed onboarding produces partners that go live without proper certification — an elevated chargeback rate for the first 90 to 180 days against Walmart OTIF, Costco, Amazon, and Home Depot programs.",
        "Internal team friction. IT spends 20 to 40 hours per partner; finance holds invoicing; sales fields weekly questions; supply chain plans around slipping dates. Real, recurring, almost never quantified.",
      ] },
      { type: "p", text: "Adding the four together, for a typical enterprise onboarding 30 to 50 partners per year, the true cost of slow onboarding usually runs into the millions of dollars annually. The IT cost — the visible cost — is a small fraction." },
      { type: "h2", text: "Why the obvious fixes don't work" },
      { type: "p", text: "Three interventions get proposed at most enterprises. None solves the problem. \"Throw more bodies at it\" fails because the bottleneck is the partner-side negotiation cycle, not the EDI engineer's calendar. \"Buy a self-service portal\" works for high-volume, low-complexity standard transactions and breaks down exactly where the value sits — the strategic partner with a custom requirement. \"Replatform to a faster system\" usually misattributes an operating-model problem to the platform; a modern platform run by the same operating model produces the same cycle." },
      { type: "h2", text: "The contrarian view — onboarding speed is the wrong KPI" },
      { type: "p", text: "The single most consequential mistake we see is the choice of KPI. Almost universally, onboarding performance is measured as \"time to first live transaction.\" This is the wrong metric. Optimizing for it produces worse outcomes than not measuring at all." },
      { type: "p", text: "The right metric is time to stable production: the time from contract signature to the point at which the partner is transacting at expected volume, with an exception rate consistent with the rest of the partner base, without ongoing intervention. Enterprises that optimize for first-transaction speed produce partners that hit the SLA, then generate elevated exception rates for 60 to 120 days — consuming operations capacity and generating chargebacks." },
      { type: "quote", text: "Most enterprises onboard partners too fast and pay for it in production incidents 90 days later. Speed is the metric the vendor is selling you. Stability is the metric your CFO is paying for." },
      { type: "h2", text: "The right KPI set" },
      { type: "ul", items: [
        "Time to stable production — the headline metric, in weeks from contract signature, with a clear definition of \"stable.\"",
        "Partner incident rate in the first 90 days — catches the partner that went live fast but generates exceptions daily.",
        "Retransmission rate — a leading indicator of mapping quality. Healthy estates run below 1%; rushed onboarding regularly runs 3 to 5%.",
        "Partner-side issue rate — a high rate often indicates onboarding shortcuts on the certification step.",
      ] },
      { type: "h2", text: "What good actually looks like" },
      { type: "p", text: "Enterprises that have brought onboarding under control share a small set of practices. Cohort onboarding, not partner-by-partner serial onboarding — group partners into cohorts of 5 to 10 and run them in parallel. Pre-built templates by retailer and partner type — a new Walmart supplier should not be a custom map development. A certification step that pre-clears partners before go-live — simulating production load and testing partner-side exception handling. And managed-service ownership of the partner lifecycle as a continuous capability, not a one-time IT project." },
      { type: "h2", text: "The PSA BDP proof point" },
      { type: "p", text: "Exceptional Solutions has run a continuous engagement with PSA BDP for over five years, onboarding 100+ trading partners using the cohort-based, framework-driven, certification-first model. Verified outcomes: 100+ partners onboarded, zero critical outages during the scale-up, 98%+ EDI success rate, 67% reduction in support FTE requirement, and $1.3M+ in annual operating costs avoided. The numbers are the result of an operating model designed for stability first, speed second — and the stability produced the speed as a consequence." },
      { type: "cta", text: "Run a 5-partner pilot with us. Five of your queued trading partners, onboarded on our cohort-based, certification-first model, against your current metric and the time-to-stable-production metric. You see the difference both numbers tell, and you keep the partners we onboard. The pilot is the offer.", label: "Book a 5-partner onboarding pilot" },
    ],
  },
  {
    slug: "how-to-choose-the-right-edi-platform",
    category: "Platform Selection",
    title: "How to choose the right EDI platform for your estate",
    readTime: "10 min read",
    metaTitle: "How To Choose The Right EDI Platform - A Vendor-Neutral Guide | Exceptional Solutions",
    metaDescription:
      "IBM Sterling, Boomi, Cleo, MuleSoft, Axway - each is right for a different EDI estate. A framework for choosing, written by integration specialists who work with all of them.",
    intro:
      "Most EDI platform comparisons are written by the platform vendors. This one isn't.",
    blocks: [
      { type: "p", text: "If you have spent any time evaluating EDI platforms in the last year, you have read at least three whitepapers that all reached the same conclusion: the platform the whitepaper's author sells is the right choice for your enterprise. Each one is internally coherent. Each one is also a marketing document, and that fact does not survive contact with a senior buyer." },
      { type: "p", text: "This article is structured differently. We work with IBM Sterling, Cleo, Boomi, MuleSoft and Axway B2Bi every week. We do not sell licenses for any of them. What we have, instead, is several years of pattern recognition across estates of every shape — and a framework that we apply when a CIO asks us to second-opinion a platform decision. The right question is not \"which platform is best?\" It is \"which platform fits the shape of my estate?\"" },
      { type: "h2", text: "Why platform comparisons usually mislead you" },
      { type: "p", text: "Two structural problems make most comparisons unreliable. Feature-by-feature comparisons collapse the moment the estate is examined — every modern platform supports X12, EDIFACT, AS2, SFTP, and FTPS, and offers a mapping tool and a portal. The differences that matter only appear when you ask how the platform behaves at 50,000 transactions per hour, or what its onboarding model looks like at 50 partners in a quarter, or its real three-year TCO." },
      { type: "p", text: "And the buyer's situation gets compressed to fit the comparison. Two enterprises of the same revenue, in the same industry, can have correct answers that point to different platforms. The right approach is to invert the analysis: start with the shape of your estate, derive the requirements, then see which platforms fit." },
      { type: "h2", text: "The five questions that actually decide the right platform" },
      { type: "ul", items: [
        "What is your trading partner profile? How many partners, what geographic mix, what transaction volume and distribution, what standards mix (X12, EDIFACT, XML, OFTP2), what partner sophistication? This is the single most important input.",
        "What is your ERP and downstream system landscape? SAP, Oracle, Infor, Dynamics — plus WMS, TMS, demand planning, financial reconciliation. Scope the ERP integration as part of the platform requirement, and let it inform the choice.",
        "What is your intended operating model? Fully in-house, hybrid, or fully managed. Platforms have different fit profiles for each — and this is the question most evaluations skip.",
        "What is your modernization appetite? Tolerance for disruption, strategic case for a full replatform versus upgrade-in-place, acquisition or regulatory pressure on the timeline.",
        "What is the real, fully-loaded three-year TCO? License is a small fraction. FTE, onboarding, infrastructure, upgrade/patching, and incident cost dominate. Most TCO comparisons are wrong by 30 to 50 percent.",
      ] },
      { type: "p", text: "These five questions, answered honestly, produce a requirements profile that points to two or three platforms — not five. The choice within that shortlist is then much clearer." },
      { type: "h2", text: "Platform by platform — where each is genuinely strong" },
      { type: "p", text: "IBM Sterling B2B Integrator is the workhorse for very high-volume, complex trading networks. Its depth shows up most clearly when the partner network is large, the volumes are heavy, and the operational requirements are unforgiving. PSA BDP, our flagship client, runs on Sterling — 100+ partners, mission-critical logistics flows, zero critical outages across five years of migrations. It rewards investment in a serious operating model and is less suited to estates that want a thin operational footprint." },
      { type: "p", text: "Cleo is strong for fast, supplier-led onboarding and cloud-native delivery in mid-to-large estates. Harmony, Clarify and CIC are engineered around the supplier experience, producing shorter time-to-stable-production for partners. It suits managed-service delivery and hybrid operating models, and is less suited to the deepest Sterling-class throughput or heavy decade-old bespoke logic." },
      { type: "p", text: "Dell Boomi is strongest in hybrid estates where intra-enterprise integration is a major part of the requirement alongside EDI. Where the broader integration footprint is already on Boomi, extending it to EDI produces one operational model rather than two. The fit is strongest when EDI is one workload among several, rather than the dominant workload." },
      { type: "p", text: "MuleSoft is strongest where API-led integration is the dominant pattern and EDI is one capability the estate must support. For enterprises whose strategy is genuinely API-first with a smaller partner network and standard transactions, MuleSoft is a natural fit. Where EDI is the dominant workload at significant scale, it usually is not." },
      { type: "p", text: "Axway B2Bi is strongest in regulated industries and large managed file transfer footprints, with historical depth in financial services, healthcare, and regulated manufacturing. In many estates the secure file transfer requirement is operationally larger than the EDI mapping requirement — which is exactly where Axway is frequently the right answer." },
      { type: "p", text: "The honest pattern is that these five platforms are not in head-to-head competition for every estate. Each has a profile of strongest fit, and the profiles do not overlap as much as the marketing suggests. Most enterprises, after the five-question analysis, find that two or at most three genuinely fit." },
      { type: "quote", text: "A great platform run by an underfunded team produces poor outcomes. A solid platform run by a disciplined team produces excellent ones. The platform matters; the operating model matters more." },
      { type: "h2", text: "The platforms aren't enough — the operating model is what wins" },
      { type: "p", text: "The single largest determinant of EDI estate performance is not the platform underneath it. It is the operating model around it. A best-in-class platform run by a thinly-staffed team with no runbooks, no onboarding framework, and no exception-handling discipline will produce mediocre outcomes regardless of the feature list. A workhorse platform run by a disciplined operating model will produce excellent outcomes, often surpassing more \"modern\" platforms run badly." },
      { type: "p", text: "The corollary is that the managed-service decision is part of the platform decision, not separate from it. And managed EDI is almost universally bought as cost reduction — the wrong frame. The actual value is risk reduction: the difference between an exception noticed at 3 a.m. on a Sunday and resolved before it cascades, and one that runs unnoticed for six hours, stops a production line, and surfaces only when the customer calls." },
      { type: "cta", text: "Run a vendor-neutral platform-selection assessment with us. Fixed fee, fixed timeline, written deliverable. The output is a shortlisted platform recommendation against your specific estate profile, a three-year TCO analysis across the shortlist, and an honest read on which operating model the platform requires. We will recommend a platform we do not implement, when the analysis points there.", label: "Book a platform-selection assessment" },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return insightsArticles.find(a => a.slug === slug);
}