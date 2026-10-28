# Skyer Enterprise Architecture & Sovereign Operations Whitepaper
**Document Version:** 2.4.0 (Air-Gapped Edition)  
**Classification:** Enterprise Confidential / Security Review Pack  
**Compliance Standard:** ISO/IEC 27001, SOC2 Type II, Vietnam Decree 13/2023/ND-CP

---

## 1. Executive Summary & Epistemic Model
Skyer provisions dedicated, sovereign AI employees that execute real company work rather than generating unstructured chat suggestions. Designed for enterprise governance, each employee runs within a dedicated micro-sandbox with strict authorization gates, zero-trust credential access, and tamper-evident execution receipts.

---

## 2. Dual Deployment Topologies: On-Premise vs. Sovereign Cloud

| Architecture Aspect | On-Premise Private Cluster | Skyer Managed Cloud |
| :--- | :--- | :--- |
| **Data Residency** | 100% Behind Physical Corporate Firewall | Isolated Encrypted Tenant |
| **Inference Hardware** | Bare-metal NVIDIA GPU / vLLM / Ollama | Dedicated Frontier Cluster |
| **Network Egress** | Zero outbound internet traffic (Air-gapped) | Hardened eBPF proxy |
| **Integration Boundary** | Direct Intranet (SAP, ERPNext, Local Git) | OAuth2 & WireGuard Tunnel |
| **Compliance Proof** | Decree 13/ND-CP, HIPAA, Banking Secrecy | SOC2 Type II, ISO 27001 |

---


---

## 3. Sovereign Infrastructure Orchestration via App360 Platform

To eliminate complex manual maintenance, Skyer Enterprise On-Premise is delivered as a certified **Application Template** within the **App360 Sovereign Infrastructure Platform** ():

### 3.1 App360 Architecture & Delivery Fabric
- **Sovereign Control Plane:** App360 serves as the host-level control plane managing micro-sandboxes, hardware quotas (CPU, RAM, GPU), and eBPF egress rules.
- **Unified Topology:**
  - **Skyer Enterprise Stack:** Web UI (Port 3000), ACP API & Orchestrator (Port 8080), Task Runners & Sandboxes.
  - **Local Inference Fabric:** Integrated loopback to on-premise vLLM / Ollama nodes, Router360 gateway, or private BYOK credentials.
  - **Private Enterprise Intranet:** Native connectivity to SAP, ERPNext, PostgreSQL, internal Git, and Active Directory.

### 3.2 Key Enterprise Capabilities Delivered by App360
1. **1-Click Verified Deployment:** App360 automatically provisions the multi-surface Skyer runtime, binds PostgreSQL and MinIO persistent volumes, and wires reverse proxy SSL certificates without requiring manual compose or helm editing.
2. **Dynamic GPU / Resource Allocation:** App360 manages GPU slicing and CPU/RAM limits, ensuring inference processes do not starve core enterprise databases.
3. **eBPF-Enforced Sandboxing:** Tool calls initiated by Skyer AI employees execute within ephemeral containers monitored by App360's eBPF filters, preventing unvetted network outbound transmission.
4. **Zero-Downtime Agent Upgrades:** Automated rollback, immutable state preservation, and atomic schema migrations managed through App360 deployment lifecycle hooks.

## 4. Sandboxed Kernel Isolation & Egress Control
Each autonomous AI employee executes within a rootless container sandbox. Tool calls pass through an eBPF-monitored boundary that audits Abstract Syntax Trees (AST) before shell execution:
1. **Forbidden Primitives:** Recursive disk traversal, host volume unmasking, unauthenticated credential reads.
2. **Deterministic Evidence:** Tasks are not marked complete without verified execution tokens, exit codes (0), and cryptographic SHA-256 receipts.
3. **Fail-Closed Gatekeeper:** Any anomalous network call terminates the execution turn and alerts on-call security personnel.

---

## 5. Multi-Agent Inter-Department Orchestration (ACP)
Departments collaborate over the Agent Communication Protocol (ACP):
- **Executive Office (Alex):** Roadmap synthesis and final sign-off gates.
- **Finance & Accounting (Controller):** Three-way invoice matching and bank ledger reconciliation.
- **Sales & Revenue (B2B Executive):** Account enrichment and proposal staging.
- **Customer Success (Support Lead):** Sub-30s triage and ticket resolution.
- **People & Legal (HR & Counsel):** NDA redlining and candidate screening.

---

## 6. Contact & Enterprise Pilot Onboarding
To schedule an on-premise PoC in your private cloud or air-gapped data center:
- **Email:** enterprise@skyer.ai / secops@antares.vn
- **Registry:** https://skyer.vn/marketplace
