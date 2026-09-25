# Security Policy for Legalens AI

## Overview
Legalens AI provides evidence-first legal document intelligence while strictly upholding privacy, confidentiality, and data minimization standards. The platform is designed with defense-in-depth across the web tier, application tier, and AI gateway.

---

## 🛡️ Security Architecture & Controls

### 1. OWASP Top 10 Mitigations
- **Injection Prevention**: Input sanitization strips `<script>`, `<iframe>`, `javascript:`, data URIs, and event handlers.
- **Prototype Pollution Defense**: Recursive payload sanitizer purges `__proto__`, `constructor`, and `prototype` keys before execution.
- **Path Traversal Protection**: Relative directory path traversal patterns (`../`, `..\`) are stripped from all inputs.
- **ReDoS Protection**: Document lengths are checked and regex patterns are structured to avoid polynomial backtracking.
- **Denial of Service (DoS) Rate Limiting**:
  - `/api/analyze`: 60 requests / 15 minutes per IP
  - `/api/ask`: 120 requests / 15 minutes per IP
  - Global API: 300 requests / 10 minutes per IP
- **HTTP Security Headers**: Enforced via `helmet`:
  - Strict Content-Security-Policy (CSP)
  - HTTP Strict Transport Security (HSTS)
  - X-Content-Type-Options: `nosniff`
  - Strict Referrer-Policy
  - Origin validation via CORS

### 2. Adversarial Prompt Injection Defense
Legal documents and user questions are inspected against jailbreak patterns (`ignore previous instructions`, `system prompt:`, `developer mode`, etc.) before reaching the LLM inference engine.

### 3. Data Privacy & Zero Training Retention
- Documents processed by Legalens AI are kept strictly in-memory during request execution and stored only in temporary client session state.
- No legal documents, clauses, or client queries are utilized for model training.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in Legalens AI:
1. Please report it privately via email to: **chshamith888@gmail.com**.
2. Include reproduction steps, payload details, and system environment info.
3. We acknowledge reports within 24 hours and prioritize high-severity patches immediately.
