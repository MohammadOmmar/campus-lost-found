# Campus Lost & Found: A Web-Based Campus Lost-and-Found Management System with Deterministic Matching and Privacy-Aware Ownership Verification

**Mohammad Ommar**  
Department of Computer Science / Information Technology  
[Institution Name]  
[City, Country]  
[Email Address]

---

## Abstract

The recovery of misplaced belongings in educational institutions is an information-management problem involving fragmented reporting, difficult item discovery, uncertain ownership, and limited mechanisms for tracking the recovery process. Conventional approaches such as physical notice boards, informal messaging channels, social-media groups, and manually maintained records provide limited support for systematically connecting lost-item reports with corresponding found-item reports. This paper presents *Campus Lost & Found*, a web-based campus-specific information system designed to centralize lost-and-found records while providing structured discovery, deterministic item matching, ownership verification, and controlled claim and recovery workflows.

The system was examined through analysis of its deployed web application and source repository. The implementation uses a modern web application architecture incorporating Next.js, React, TypeScript, Supabase, PostgreSQL, Zod-based validation, and Vitest-based testing. The system models campuses, user profiles, categories, items, and claims as structured entities. Users can report lost or found items, browse and search records, filter results, upload item images, and participate in a controlled claim process.

A central component is a deterministic matching engine that evaluates candidate lost/found records using category, location, date proximity, title similarity, and description overlap. The scoring model produces an interpretable score rather than an opaque machine-learning prediction. The system additionally separates potential item matching from ownership verification: a high matching score identifies a candidate relationship but does not establish ownership. Claimants therefore submit ownership evidence, while the finder associated with the found item reviews and approves or rejects the claim. Database-level security mechanisms and private verification data structures are used to restrict sensitive information.

The analysis establishes that the project constitutes a functioning information-system artifact rather than a conceptual design alone. However, no evidence is presented for statistically validated recovery-rate improvements, matching accuracy on a representative dataset, large-scale usability testing, or production-scale performance. These limitations define the principal directions for future empirical evaluation.

**Index Terms—** Campus information systems, lost and found, web applications, deterministic matching, ownership verification, information retrieval, database security, Supabase, design science.

---

# I. INTRODUCTION

The loss of personal belongings within educational institutions creates a coordination problem involving multiple users, incomplete information, and uncertain ownership. A student may know the approximate location and time at which an object was lost, while another student, employee, or security staff member may possess the object but lack sufficient information to identify its owner. The resulting information is often distributed across informal communication channels.

Conventional campus recovery processes may include physical notice boards, institutional announcements, social-media groups, messaging applications, and direct communication with campus personnel. While these mechanisms allow information to circulate, they generally do not provide a unified data model for recording reports, searching historical records, comparing lost and found descriptions, verifying ownership, and tracking recovery status.

The *Campus Lost & Found* system addresses this problem by representing lost-and-found activity as a structured web-based information system. Instead of treating a lost or found object as an isolated announcement, the platform represents it as a persistent record associated with a user, campus, category, location, date, description, status, and optional image.

The system further distinguishes between three logically different operations: discovery, matching, and verification. Discovery allows users to search and filter available reports. Matching evaluates whether a lost report and a found report exhibit sufficient similarity. Verification establishes whether a claimant can demonstrate ownership. This separation is important because similarity between two reports does not necessarily establish that they describe the same physical object or that a claimant is its owner.

The system therefore implements the following conceptual pipeline:

**Reporting → Discovery → Matching → Verification → Claim Approval → Return**

The purpose of this research is to analyze the implemented system as a software artifact and to determine how its architecture and mechanisms address the information-management problem.

The contributions of this work are:

1. A campus-scoped digital information model for lost-and-found records.
2. A deterministic multi-attribute matching mechanism.
3. An interpretable matching score that separates candidate similarity from ownership verification.
4. A controlled claim workflow in which the finder reviews ownership evidence.
5. A privacy-aware architecture for separating public item information from sensitive verification information.
6. A software artifact that provides a baseline for future empirical research into automated campus property recovery.

---

# II. PROBLEM STATEMENT AND RESEARCH GAP

The central problem addressed by the system is the absence of a unified mechanism for managing the complete lifecycle of campus lost-and-found information.

Existing informal approaches have several structural limitations. Reports may be distributed across different channels, descriptions may be inconsistent, users may have difficulty searching previous reports, and ownership verification may occur outside any auditable workflow.

The problem can therefore be represented as:

> Given a set of structured lost and found reports within a campus, how can a system efficiently identify potentially corresponding records while maintaining a controlled and privacy-aware mechanism for verifying ownership and recording recovery?

This leads to the following research gap.

Many basic lost-and-found applications provide reporting and browsing but do not necessarily distinguish between similarity detection and ownership verification. Conversely, more sophisticated matching systems may use machine-learning techniques whose decisions can be difficult to interpret.

The implemented system addresses this gap through deterministic matching. The matching process is rule-based and explainable, allowing its decisions to be decomposed into explicit factors rather than relying on an opaque model.

The research contribution should therefore not be described as the invention of the general lost-and-found concept. Instead, the contribution is the integration of:

**campus scoping + structured reporting + deterministic matching + private verification + controlled claims + recovery-state management.**

---

# III. RESEARCH OBJECTIVES

The objectives of the system are:

1. To centralize campus lost-and-found information.
2. To support authenticated reporting of lost and found objects.
3. To provide structured item descriptions and categorization.
4. To provide searchable and filterable records.
5. To identify potentially corresponding lost and found records.
6. To provide interpretable matching results.
7. To provide a controlled ownership-claim mechanism.
8. To protect private ownership-verification information.
9. To enforce authorization over claim-review operations.
10. To represent the item recovery lifecycle using explicit states.
11. To establish a technical baseline for future empirical evaluation.

---

# IV. RESEARCH QUESTIONS

**RQ1:** How can a campus-specific web application centralize and structure lost-and-found information?

**RQ2:** How can deterministic multi-attribute matching assist users in identifying potentially corresponding lost and found records?

**RQ3:** How can ownership verification be incorporated into the recovery workflow while limiting exposure of sensitive information?

**RQ4:** How can authentication, authorization, and database-level controls support secure claim processing?

**RQ5:** What limitations must be addressed before the system can be evaluated as a production-scale campus service?

---

# V. RELATED WORK

## A. Design Science in Information Systems

The project is appropriately situated within the design-science paradigm because its primary contribution is an implemented technological artifact intended to address a practical information-system problem. Hevner *et al.* describe design science as a paradigm centered on the construction and evaluation of artifacts designed to solve identified organizational or technological problems [1].

The present work follows this principle by treating the Campus Lost & Found application as the research artifact and examining its requirements, architecture, implementation, and evaluability.

## B. Usability Evaluation

Usability is particularly relevant because the success of a lost-and-found system depends on users being able to report items and identify relevant records with relatively little friction. The System Usability Scale (SUS) provides a standardized method for evaluating perceived usability [2].

The current project does not provide evidence of a completed SUS study. Therefore, SUS is identified as a suitable future evaluation mechanism rather than as a source of measured results.

## C. Information Retrieval and Matching

Information retrieval systems commonly use structured or textual similarity to rank potentially relevant records. A campus lost-and-found system presents a domain-specific retrieval problem because matching depends on heterogeneous attributes such as object category, location, date, and textual description.

The implemented system differs from a conventional semantic search system by using deterministic scoring rather than a trained machine-learning model. This provides transparency and reproducibility but potentially limits its ability to capture semantic equivalence between differently worded descriptions.

---

# VI. METHODOLOGY

This study follows an artifact-oriented software analysis methodology consisting of five stages:

1. **Problem analysis**
2. **System and requirement analysis**
3. **Implementation inspection**
4. **Functional verification**
5. **Critical evaluation**

The deployed application and public source repository constitute the primary evidence sources.

Claims concerning implemented functionality are based on observable application behavior or source-code structures. Claims concerning research methodology and broader theoretical context are supported by external academic literature.

No unverified user statistics, recovery rates, matching accuracy, or performance measurements are introduced.

This distinction is essential. The study evaluates what the system implements, not what it might achieve after large-scale deployment.

---

# VII. SYSTEM REQUIREMENTS

## A. Functional Requirements

| ID | Requirement |
|---|---|
| FR1 | Users shall be able to authenticate. |
| FR2 | Users shall be able to report lost items. |
| FR3 | Users shall be able to report found items. |
| FR4 | Users shall be able to provide structured item information. |
| FR5 | Users shall be able to upload item images where supported. |
| FR6 | Users shall be able to browse item records. |
| FR7 | Users shall be able to search item records. |
| FR8 | Users shall be able to filter item records. |
| FR9 | The system shall identify potential item matches. |
| FR10 | Users shall be able to submit ownership claims. |
| FR11 | Authorized users shall be able to review claims. |
| FR12 | The system shall maintain item lifecycle states. |
| FR13 | Sensitive verification information shall not be exposed as ordinary public item information. |

## B. Non-Functional Requirements

The architecture additionally implies the following non-functional requirements:

- security;
- data integrity;
- privacy;
- maintainability;
- explainability;
- usability;
- scalability;
- reliability.

The current project provides implementation evidence for several of these, but not empirical measurements for all of them.

---

# VIII. SYSTEM ARCHITECTURE

The system can be represented by the following four-layer architecture.

**Fig. 1. Proposed System Architecture**

```text
┌─────────────────────────────────────────────┐
│              Presentation Layer             │
│       Next.js / React / UI Components       │
│                                             │
│ Login | Register | Items | Dashboard        │
│ Report | Claims | Matching | Recovery       │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             Application Layer               │
│                                             │
│ Server Actions | Validation | Authorization  │
│ Item Management | Claims | Recovery Logic   │
└──────────────────────┬──────────────────────┘
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
┌──────────────────────┐  ┌──────────────────┐
│   Matching Layer     │  │ Authentication   │
│                      │  │ & Authorization  │
│ Category             │  │                  │
│ Location             │  │ Supabase Auth    │
│ Date                 │  │ Session Control  │
│ Title                │  │ RLS Policies     │
│ Description          │  │                  │
└──────────┬───────────┘  └────────┬─────────┘
           │                       │
           └────────────┬──────────┘
                        ▼
┌─────────────────────────────────────────────┐
│             Persistence Layer               │
│                                             │
│ PostgreSQL / Supabase                       │
│                                             │
│ Campus | Profile | Category | Item | Claim  │
│ Private Verification Details                │
└─────────────────────────────────────────────┘
```

The architecture separates interface concerns from application logic, matching logic, authentication, and persistence. This modular structure also allows the matching engine and claim eligibility mechanisms to be tested independently.

---

# IX. DATA MODEL

The primary entities are:

**Campus**

Represents the institutional context within which records exist.

**Profile**

Represents an authenticated system user and associates the user with a campus.

**Category**

Provides structured classification for item records.

**Item**

Represents a lost or found object and contains descriptive, temporal, spatial, categorical, and lifecycle information.

**Claim**

Represents a user's attempt to establish ownership of a found item.

**Private Verification Details**

Represents information that should not be exposed as ordinary public item metadata.

### Fig. 2. Entity Relationship Model

```text
                    ┌───────────────┐
                    │    CAMPUS     │
                    └───────┬───────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌───────────────┐       ┌───────────────┐
        │    PROFILE    │       │   CATEGORY    │
        └───────┬───────┘       └───────┬───────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                    ┌───────────────┐
                    │     ITEM      │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
      ┌───────────────┐          ┌────────────────────┐
      │     CLAIM     │          │ PRIVATE VERIFICATION│
      └───────────────┘          └────────────────────┘
```

This model allows the system to distinguish public item discovery from private ownership verification.

---

# X. ITEM REPORTING AND DISCOVERY

The item-management workflow is based on structured records rather than free-form announcements.

A report can contain:

- title;
- description;
- category;
- item type;
- location;
- date;
- image;
- campus;
- status;
- user association.

The distinction between LOST and FOUND is fundamental because matching operates across these complementary item types.

The browse/search interface provides a second layer of discovery. Instead of requiring users to inspect all records, the system can restrict results by textual query, item type, category, and status.

The campus association is particularly important. A lost item at one campus should not automatically be considered a candidate for an unrelated campus. Campus scoping therefore functions as both an information-retrieval constraint and a domain boundary.

---

# XI. DETERMINISTIC MATCHING MODEL

The matching engine is the principal computational component of the system.

Unlike a machine-learning model, the matching engine does not require a training dataset. It evaluates records through explicit rules.

Let the final match score be:

\[
S = S_c + S_l + S_d + S_t + S_x
\]

where:

- \(S_c\) = category score;
- \(S_l\) = location score;
- \(S_d\) = date-proximity score;
- \(S_t\) = title-similarity score;
- \(S_x\) = description-overlap score.

The maximum contribution is:

\[
S_{\max}=25+20+20+20+15=100
\]

Thus:

\[
0 \leq S \leq 100
\]

The candidate must first satisfy hard eligibility conditions. These include opposite LOST/FOUND types, campus compatibility, OPEN status, and category compatibility.

Only eligible candidates proceed to weighted scoring.

### Table I  
**Matching Score Components**

| Feature | Maximum Score | Purpose |
|---|---:|---|
| Category | 25 | Determines broad object compatibility |
| Location | 20 | Measures spatial relevance |
| Date | 20 | Measures temporal proximity |
| Title | 20 | Measures title similarity |
| Description | 15 | Measures textual overlap |
| **Total** | **100** | Overall candidate score |

The design has two important properties.

First, it is **deterministic**: the same records should produce the same result.

Second, it is **interpretable**: users can inspect the contribution of individual factors.

This is preferable to presenting an unexplained numerical prediction when the system's purpose includes assisting users in making ownership decisions.

---

# XII. MATCHING AND OWNERSHIP ARE DISTINCT

A fundamental design principle of the application is:

\[
\text{Match Similarity} \neq \text{Ownership Verification}
\]

A high similarity score only indicates that two reports exhibit similar characteristics.

It does not prove:

- that the objects are physically identical;
- that the claimant is the owner;
- that the information supplied by either party is truthful.

The system therefore introduces a second stage:

```text
Potential Match
      │
      ▼
Claim Submission
      │
      ▼
Private Ownership Evidence
      │
      ▼
Finder Review
      │
 ┌────┴────┐
 ▼         ▼
Approve   Reject
 │
 ▼
CLAIMED
 │
 ▼
RETURNED
```

This separation is one of the strongest conceptual features of the project because it prevents the matching algorithm from becoming the final authority on ownership.

---

# XIII. CLAIM AND RECOVERY WORKFLOW

A claim is associated with a particular found item and claimant.

The claim workflow can be expressed as:

\[
OPEN \rightarrow CLAIMED \rightarrow RETURNED
\]

An alternative terminal state is:

\[
OPEN \rightarrow CLOSED
\]

The system prevents inappropriate transitions by applying eligibility checks.

The finder is responsible for reviewing claims associated with the found item. This is an important authorization rule because the person who physically possesses or reported the found object is positioned to perform the verification step.

After approval, the system can reject competing pending claims for the same item, thereby establishing a single approved ownership path.

This creates an explicit lifecycle rather than leaving recovery as an informal conversation outside the application.

---

# XIV. SECURITY AND PRIVACY

Security is implemented through multiple layers.

### A. Authentication

Users are required to authenticate before performing protected operations.

### B. Authorization

Sensitive claim operations are restricted according to the relationship between the authenticated user and the item.

### C. Input Validation

User-provided data is validated before being processed by application logic.

### D. Database Constraints

The persistence layer imposes constraints on enumerated states and field values.

### E. Row-Level Security

Database-level policies provide an additional authorization boundary.

### F. Private Verification

Ownership-verification information is separated from ordinary public item information.

This is significant because hiding a sensitive field only in the frontend would not constitute sufficient privacy protection. Database-level restrictions provide a stronger security boundary.

---

# XV. FEATURE-TO-EVIDENCE MATRIX

### Table II  
**Feature Verification Matrix**

| Feature | Implementation Evidence | Status |
|---|---|---|
| Authentication | Authentication routes/Supabase integration | Implemented |
| User registration | Registration workflow | Implemented |
| Lost-item reporting | Item creation workflow | Implemented |
| Found-item reporting | LOST/FOUND item model | Implemented |
| Image handling | Item image processing | Implemented |
| Search | Item query interface | Implemented |
| Filtering | Type/category/status filtering | Implemented |
| Campus scoping | Campus association and filtering | Implemented |
| Matching | Dedicated matching engine | Implemented |
| Match scoring | Weighted scoring mechanism | Implemented |
| Match explanation | Score breakdown | Implemented |
| Claims | Claim workflow | Implemented |
| Finder review | Authorized review operation | Implemented |
| Return state | Recovery transition | Implemented |
| Private verification | Private verification architecture | Implemented |
| Automated tests | Matching/claim tests | Implemented |
| Large-scale user study | No verified evidence | Not verified |
| Matching accuracy benchmark | No verified dataset/benchmark | Not verified |
| Recovery-rate improvement | No verified experiment | Not verified |

---

# XVI. PROBLEM–SOLUTION ANALYSIS

### Table III  
**Problem–Solution Mapping**

| Problem | Implemented Solution | Expected Effect |
|---|---|---|
| Fragmented reports | Centralized database | Structured information access |
| Difficult manual search | Search/filter interface | Reduced candidate-search effort |
| Lost/found records difficult to correlate | Deterministic matching | Ranked candidate relationships |
| Opaque similarity decisions | Score breakdown | Improved interpretability |
| Unauthorized claims | Ownership verification | Stronger claim control |
| Ambiguous claim authority | Finder-only review | Explicit authorization |
| Sensitive verification data exposure | Private verification layer | Improved privacy |
| Unclear recovery status | Explicit lifecycle states | Better state tracking |
| Cross-campus irrelevant results | Campus scoping | Reduced candidate noise |

The expected effects in the final column must not be interpreted as measured performance improvements.

---

# XVII. TESTING AND EVALUATION

The project includes dedicated testing for matching and claim-related logic.

This is particularly appropriate because these components contain domain rules that can be tested independently of the visual interface.

The evaluation should nevertheless distinguish between **software correctness testing** and **empirical system effectiveness**.

### Table IV  
**Evaluation Classification**

| Evaluation Type | Evidence | Interpretation |
|---|---|---|
| Matching logic tests | Repository | Software-level verification |
| Claim eligibility tests | Repository | Rule-level verification |
| Functional workflow inspection | Application | Feature verification |
| Usability study | Not established | Future work |
| Matching precision/recall | Not established | Future work |
| Recovery-rate experiment | Not established | Future work |
| Large-scale load testing | Not established | Future work |

The absence of empirical measurements is not a flaw that should be concealed. It defines the boundary of what the current study can legitimately conclude.

---

# XVIII. RESULTS

The primary result is a functioning integrated workflow for campus lost-and-found management.

The system combines:

\[
\text{Structured Reporting}
+
\text{Search}
+
\text{Matching}
+
\text{Verification}
+
\text{Claims}
+
\text{Recovery Tracking}
\]

The implementation further demonstrates that these capabilities are connected rather than independent interface elements.

The matching mechanism operates as a separate computational module. Claim processing is implemented through server-side operations. Database entities and lifecycle constraints support persistence and integrity.

Therefore, the project can reasonably be characterized as an implemented information-system artifact.

However, the available evidence does not support a numerical conclusion about whether the system improves recovery rates or reduces recovery time compared with existing campus processes.

---

# XIX. DISCUSSION

The system's most important architectural contribution is the separation between discovery and verification.

A traditional search system might return an item and allow the user to decide whether it belongs to them. Such an approach creates a security problem because recognizing an item from publicly available information can make fraudulent claims easier.

The current system addresses this by providing private ownership verification information and delegating final claim approval to the finder.

The deterministic matching model also provides an explicit baseline for future research.

Rather than immediately introducing machine learning, the system establishes a transparent scoring function whose behavior can be measured. Future research could therefore compare:

\[
\text{Deterministic Matching}
\]

against:

\[
\text{Semantic / ML Matching}
\]

using the same labeled dataset.

This would provide a scientifically meaningful comparison rather than assuming that a machine-learning approach is automatically superior.

---

# XX. LIMITATIONS

The following limitations should be explicitly acknowledged.

1. The project does not provide evidence of a statistically representative deployment study.
2. Matching precision and recall have not been established on a labeled real-world dataset.
3. The deterministic text-matching mechanism may fail when two descriptions use semantically equivalent but lexically different language.
4. The quality of matching depends partly on user-provided information.
5. No verified SUS or equivalent usability score is available.
6. No validated recovery-time reduction is available.
7. No large-scale performance benchmark is available.
8. The system cannot independently verify that a physical handover actually occurred.
9. Institutional identity integration and administrative governance may require additional development for production deployment.

These limitations should be presented as research boundaries rather than as evidence that the system is nonfunctional.

---

# XXI. FUTURE WORK

Future research should proceed experimentally rather than only by adding features.

First, a labeled dataset should be constructed containing genuine lost/found pairs and non-matching pairs. The deterministic engine could then be evaluated using precision, recall, F1 score, and top-\(k\) retrieval accuracy.

Second, semantic text representations could be evaluated against the deterministic baseline.

Third, image similarity could be incorporated into the matching process.

Fourth, a controlled usability experiment could evaluate task completion time, errors, and SUS scores.

Fifth, load testing should establish system behavior under increasing numbers of users and item records.

Sixth, institutional authentication could be integrated with university identity providers.

Finally, an administrative layer could provide moderation, audit logging, abuse reporting, and institutional governance.

---

# XXII. CONCLUSION

Campus Lost & Found demonstrates how a conventional campus lost-and-found problem can be represented as a structured information-management workflow.

The system centralizes lost and found reports, supports search and filtering, applies deterministic multi-attribute matching, provides explainable match scores, separates potential matching from ownership verification, and implements a controlled claim-to-return lifecycle.

Its most significant technical characteristic is the distinction between similarity and ownership. The matching engine identifies candidate relationships, while the claim system provides a separate ownership-verification process. This separation provides a more defensible architecture than treating a similarity score as proof of ownership.

The system also demonstrates that privacy can be incorporated at the data architecture level through separation of sensitive information and access controls rather than relying solely on interface-level hiding.

The current evidence supports the conclusion that the project constitutes a coherent and implemented campus information-system artifact. It does not, however, support claims of quantified improvement in recovery rate, recovery time, matching accuracy, or user satisfaction. Establishing those outcomes requires empirical evaluation with real users and representative datasets.

Accordingly, the system should be viewed as a technically grounded baseline from which future research can investigate semantic matching, computer vision, usability, scalability, and institutional deployment.

---

# REFERENCES

[1] A. R. Hevner, S. T. March, J. Park, and S. Ram, “Design Science in Information Systems Research,” *MIS Quarterly*, vol. 28, no. 1, pp. 75–105, 2004.

[2] J. Brooke, “SUS: A Quick and Dirty Usability Scale,” in *Usability Evaluation in Industry*, P. W. Jordan, B. Thomas, B. A. Weerdmeester, and I. L. McClelland, Eds. London, U.K.: Taylor & Francis, 1996, pp. 189–194.

[3] M. Ommar, “Campus Lost & Found,” GitHub repository, 2026. [Online]. Available: https://github.com/MohammadOmmar/campus-lost-found

[4] M. Ommar, “Campus Lost & Found,” deployed web application, 2026. [Online]. Available: https://campus-lost-found-items.vercel.app/

[5] M. Ommar, “Campus Lost & Found Database Schema,” GitHub repository, 2026.

[6] M. Ommar, “Campus Lost & Found Matching Engine,” GitHub repository, 2026.

[7] M. Ommar, “Campus Lost & Found Claims Implementation,” GitHub repository, 2026.

---

# APPENDIX A — RECOMMENDED FIGURES FOR FINAL IEEE SUBMISSION

The final paper should contain the following figures rather than relying only on prose.

**Fig. 1. System Architecture**

Browser → Next.js/React → Server Actions → Matching/Claims → Supabase → PostgreSQL/Storage.

**Fig. 2. Entity Relationship Diagram**

Campus → Profile → Item → Claim, with Category and Private Verification Details.

**Fig. 3. Overall Recovery Workflow**

```text
REGISTER / LOGIN
       ↓
REPORT LOST / FOUND ITEM
       ↓
ITEM STORED AS OPEN
       ↓
SEARCH / FILTER / MATCH
       ↓
POTENTIAL MATCH
       ↓
CLAIM SUBMITTED
       ↓
PRIVATE OWNERSHIP VERIFICATION
       ↓
FINDER REVIEW
    ↙       ↘
REJECT     APPROVE
             ↓
          CLAIMED
             ↓
          RETURNED
```

**Fig. 4. Matching Algorithm**

```text
Candidate Item
      ↓
Opposite Type?
      ↓
Same Campus?
      ↓
OPEN Status?
      ↓
Compatible Category?
      ↓
Weighted Scoring
      ↓
Category     25
Location     20
Date         20
Title        20
Description  15
      ↓
Total / 100
      ↓
Rank Candidates
```

**Fig. 5. Item State Machine**

```text
             ┌───────────────┐
             │     OPEN      │
             └───────┬───────┘
                     │
             Claim Approved
                     ↓
             ┌───────────────┐
             │    CLAIMED    │
             └───────┬───────┘
                     │
               Return Confirmed
                     ↓
             ┌───────────────┐
             │    RETURNED   │
             └───────────────┘

OPEN ───────────────→ CLOSED
```

**Fig. 6. Security Boundary**

Public Item Information → Search/Browse

Private Verification Information → Authorized Access Only

Claim Review → Finder Authorization

Database → Row-Level Security
