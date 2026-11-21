# EXTREME SECURITY HARDENING PROMPT — COMPLETE BACKEND, API, DATABASE, AUTHENTICATION, AUTHORIZATION AND APPLICATION SECURITY AUDIT

## MISSION

You are acting as a Principal Application Security Engineer, Senior Backend Engineer, Security Architect, Database Security Specialist, DevSecOps Engineer, and authorized security auditor.

You have direct access to the existing application codebase.

Your mission is to conduct a comprehensive security audit of the entire application and implement all safe, necessary, and feasible security improvements directly into the existing project.

This is not a superficial security review.

This is not a checklist-only exercise.

This is not a frontend-only security audit.

You must investigate the complete application, including:

- Frontend.
- Backend.
- APIs.
- Authentication.
- Authorization.
- Database.
- Sessions.
- Cookies.
- File uploads.
- External integrations.
- Payment integrations.
- Inventory operations.
- Admin operations.
- Super Admin operations.
- User operations.
- Infrastructure configuration.
- Deployment configuration.
- Environment variables.
- Dependencies.
- Background jobs.
- Logging.
- Monitoring.
- Data integrity.

Your goal is to make the application significantly more resistant to unauthorized access, privilege escalation, data breaches, injection attacks, account compromise, business logic abuse, and data corruption.

Perform a complete security audit, remediate identified vulnerabilities, and verify the effectiveness of the changes.

IMPORTANT: Absolute security cannot be guaranteed. Your responsibility is to reduce risk systematically, implement defense in depth, and report any remaining security limitations honestly.

---

# 1. ESTABLISH A SAFE SECURITY AUDIT ENVIRONMENT

Before performing security testing:

1. Identify the current environment.
2. Determine whether the application is running locally, in development, in staging, or in production.
3. Identify the available databases.
4. Identify external integrations.
5. Identify available test accounts and roles.
6. Identify existing automated security tests.
7. Identify the current deployment architecture.
8. Determine which security testing tools are available.

Use a development or staging environment whenever possible.

Do not perform destructive security testing against production.

Do not delete user data.

Do not modify production credentials.

Do not disable security controls.

Do not perform denial-of-service testing against live systems.

Do not exploit external systems without explicit authorization.

Do not expose secrets in logs, reports, terminal output, or generated documentation.

If a security test requires credentials or external configuration that is unavailable, document the limitation and continue with other tests.

---

# 2. BUILD A COMPLETE ATTACK SURFACE INVENTORY

Identify every possible entry point into the application.

Inspect:

- Public routes.
- Authenticated routes.
- Admin routes.
- Super Admin routes.
- API endpoints.
- GraphQL endpoints.
- Webhooks.
- Authentication endpoints.
- Password reset endpoints.
- File upload endpoints.
- Search endpoints.
- Export endpoints.
- Import endpoints.
- Background jobs.
- Scheduled tasks.
- External service callbacks.
- Database access paths.
- Administrative operations.
- Sensitive business workflows.

For each endpoint, identify:

- HTTP method.
- Route.
- Authentication requirements.
- Required permissions.
- Input parameters.
- Request body.
- Response data.
- Database operations.
- Side effects.
- Rate limits.
- Validation rules.
- Error handling.
- Sensitive data exposure risks.

Create a comprehensive API and attack surface inventory.

Do not assume that undocumented endpoints are safe.

Inspect actual route registration, middleware, controllers, and services.

---

# 3. AUTHENTICATION SECURITY

Perform a complete authentication audit.

Inspect the entire authentication lifecycle.

## Password security

Verify:

- Passwords are never stored in plaintext.
- Passwords are hashed using an appropriate modern password hashing algorithm.
- Password hashing uses appropriate parameters.
- Password reset tokens are securely generated.
- Password reset tokens expire.
- Password reset tokens cannot be reused.
- Password reset operations invalidate relevant sessions.
- Password changes require appropriate verification.
- Password validation is implemented consistently.
- Authentication errors do not reveal unnecessary account information.

Do not implement custom cryptographic algorithms.

Use established libraries.

## Login security

Review:

- Login validation.
- Brute-force protection.
- Rate limiting.
- Account enumeration.
- Credential stuffing.
- Login throttling.
- Session creation.
- Session expiration.
- Failed login tracking.
- Suspicious login behavior.

Implement appropriate defenses.

Avoid permanent account lockouts that could allow attackers to deny access to legitimate users.

## Session security

Inspect:

- Session identifiers.
- Session expiration.
- Session renewal.
- Session invalidation.
- Cookie configuration.
- Session fixation.
- Logout behavior.
- Concurrent sessions.
- Password change behavior.
- Role changes.
- Privilege changes.

Ensure session identifiers are securely generated.

Ensure sensitive sessions are invalidated when appropriate.

For cookie-based sessions, use appropriate Secure, HttpOnly, and SameSite settings.

For token-based authentication, verify expiration, signature validation, issuer, audience, algorithm restrictions, and revocation behavior where applicable.

Do not store sensitive authentication credentials in insecure browser storage.

Do not assume JWT authentication is automatically secure.

## Multi-factor authentication

If MFA exists, audit it.

If MFA is appropriate for privileged accounts but missing, identify the gap and implement it if the existing architecture supports it safely.

Never bypass MFA for convenience.

---

# 4. COMPLETE AUTHORIZATION AND ACCESS CONTROL AUDIT

This is one of the highest-priority parts of the security audit.

Inspect every backend endpoint and every sensitive business operation.

Verify that authorization is enforced server-side.

Do not rely on:

- Hidden buttons.
- Frontend route guards.
- Disabled inputs.
- Client-side role checks.
- UI visibility.
- User-provided role values.

The backend must independently validate permissions.

## Super Admin

Inspect all Super Admin operations.

Verify that only authorized Super Admin accounts can perform them.

Test:

- User management.
- Role management.
- Permission management.
- System settings.
- Administrative configuration.
- Organization management.
- Sensitive exports.
- Audit logs.
- System-wide data access.

## Admin

Verify that Admin accounts cannot perform unauthorized Super Admin operations.

Verify that Admins cannot access data outside their permitted scope.

## Regular User

Verify that regular users cannot:

- Access Admin pages through direct URLs.
- Access Super Admin endpoints.
- Modify their own role.
- Modify another user's profile without permission.
- Access another user's orders.
- Access another user's financial records.
- Access unauthorized inventory.
- Modify administrative settings.
- Read sensitive internal records.

## Object-level authorization

For every resource identifier, verify access to the actual resource.

Examples:

- User IDs.
- Product IDs.
- Order IDs.
- Invoice IDs.
- Warehouse IDs.
- Organization IDs.
- Supplier IDs.
- Customer IDs.
- Stock movement IDs.

Do not assume that a valid resource ID means the user is authorized to access it.

Prevent insecure direct object reference vulnerabilities.

## Property-level authorization

Verify that users cannot modify sensitive fields by submitting unexpected request properties.

Examples:

- role.
- permissions.
- isAdmin.
- isSuperAdmin.
- organizationId.
- ownerId.
- accountStatus.
- balance.
- stockQuantity.
- paymentStatus.
- orderStatus.

Implement explicit input allowlists and server-side authorization rules.

Do not blindly accept entire request objects into database updates.

---

# 5. API SECURITY AUDIT

Audit every API endpoint.

Use the OWASP API Security Top 10 as a reference.

Investigate:

- Broken object-level authorization.
- Broken authentication.
- Broken object-property-level authorization.
- Unrestricted resource consumption.
- Broken function-level authorization.
- Sensitive business flow abuse.
- Server-side request forgery.
- Security misconfiguration.
- Improper API inventory management.
- Unsafe consumption of external APIs.

For each issue, determine whether the application is vulnerable.

Implement appropriate protections.

## API requirements

Ensure:

- Authentication is correctly enforced.
- Authorization is correctly enforced.
- Inputs are validated.
- Outputs are appropriately restricted.
- Sensitive fields are not exposed.
- Pagination is implemented where appropriate.
- Query complexity is controlled.
- Request sizes are limited.
- Rate limits are appropriate.
- Error responses are safe.
- API versioning is understood.
- Deprecated endpoints are identified.
- Unexpected HTTP methods are rejected.
- CORS is configured correctly.

Do not expose internal stack traces to clients.

Do not return entire database records when only a few fields are required.

Use explicit response schemas.

---

# 6. INPUT VALIDATION AND INJECTION PREVENTION

Inspect every source of user-controlled input.

Examples:

- Query parameters.
- Route parameters.
- Request bodies.
- Headers.
- Cookies.
- Uploaded files.
- Webhook payloads.
- External API responses.

Identify injection vulnerabilities.

Review:

- SQL injection.
- NoSQL injection.
- Command injection.
- Cross-site scripting.
- Template injection.
- LDAP injection where relevant.
- Path traversal.
- Header injection.
- Unsafe deserialization.
- Expression injection.

Use parameterized queries or safe ORM methods.

Validate input according to the expected business schema.

Use strict validation for:

- IDs.
- Quantities.
- Prices.
- Dates.
- Emails.
- Phone numbers.
- Roles.
- Statuses.
- File types.
- File sizes.
- Search filters.
- Sort fields.

Do not use arbitrary user input to construct SQL queries, file paths, shell commands, or executable expressions.

Use allowlists for fields that can be sorted or filtered.

Escape output according to the correct context.

Do not rely on input sanitization alone as a defense against XSS.

---

# 7. DATABASE SECURITY AND DATA INTEGRITY

Perform a complete database security review.

Inspect:

- Database permissions.
- Connection configuration.
- Authentication.
- Encryption.
- Database roles.
- ORM behavior.
- Query construction.
- Constraints.
- Foreign keys.
- Transactions.
- Indexes.
- Sensitive fields.
- Backup configuration.
- Migration safety.
- Data retention.
- Deletion behavior.

Verify that the application uses least-privilege database credentials.

Do not run the application using a database superuser account unless an exceptional, justified requirement exists.

Ensure the application cannot execute arbitrary administrative database operations through ordinary user functionality.

## Sensitive data

Identify sensitive information stored in the database.

Examples:

- Password hashes.
- Authentication tokens.
- Payment-related information.
- Personal information.
- Private user information.
- Internal administrative data.

Minimize unnecessary sensitive data storage.

Do not log sensitive database fields.

Do not expose internal database records through APIs.

Use appropriate encryption where required by the application's data classification and threat model.

Do not invent encryption implementations.

Use established cryptographic libraries and secure key management.

## Data integrity

Ensure:

- Foreign keys are valid.
- Unique constraints are enforced.
- Required fields cannot be omitted.
- Invalid states cannot be persisted.
- Transactions protect multi-step operations.
- Concurrent operations do not corrupt data.
- Financial calculations are consistent.
- Inventory quantities remain consistent.
- Deletion behavior is safe.

---

# 8. INVENTORY AND STOCK SECURITY

Audit the complete inventory subsystem.

Pay particular attention to business logic vulnerabilities.

Test whether users can:

- Increase stock without permission.
- Reduce stock without permission.
- Transfer stock without authorization.
- Modify stock quantities through unexpected fields.
- Reserve unavailable stock.
- Release another user's reservations.
- Modify inventory belonging to another organization.
- Create duplicate stock movements.
- Exploit concurrent stock updates.
- Manipulate purchase orders.
- Manipulate sales orders.
- Bypass stock validation.
- Create negative stock unintentionally.

## Required protections

Implement:

- Server-side stock validation.
- Transactional inventory operations.
- Appropriate locking or concurrency control.
- Idempotency where needed.
- Stock movement audit trails.
- Authorization for each operation.
- Validation of warehouse boundaries.
- Validation of product ownership or organization scope.
- Protection against duplicate submissions.
- Consistent stock status calculations.

Ensure inventory values cannot be manipulated merely by changing frontend state.

The backend must calculate and validate authoritative inventory quantities.

For stock transfers, verify that the source and destination remain consistent.

For stock adjustments, record the actor, timestamp, reason, and quantity changes.

---

# 9. FINANCIAL AND PAYMENT SECURITY

If the application processes payments or financial operations, audit:

- Payment initiation.
- Payment confirmation.
- Payment callbacks.
- Webhooks.
- Refunds.
- Order totals.
- Discounts.
- Taxes.
- Currency conversion.
- Financial reports.
- Invoice generation.

Ensure the backend calculates authoritative amounts.

Never trust client-submitted totals.

Verify webhook signatures.

Implement idempotent payment processing.

Prevent duplicate payment processing.

Prevent unauthorized refunds.

Prevent users from modifying payment statuses directly.

Use the payment provider's authoritative transaction status.

Do not store card security codes.

Do not expose payment secrets in frontend code.

Do not execute real payments during security testing.

---

# 10. FILE UPLOAD AND STORAGE SECURITY

Inspect all file upload functionality.

Test:

- File type validation.
- File size limits.
- Filename handling.
- MIME type validation.
- File extension validation.
- Path traversal.
- Unauthorized uploads.
- Malicious file uploads.
- Public file access.
- Private file access.
- File replacement.
- File deletion.
- Image processing.

Use safe storage locations.

Generate safe server-side filenames.

Do not trust the uploaded filename.

Do not trust client-supplied MIME types.

Prevent executable uploads where inappropriate.

Ensure private files are only accessible to authorized users.

Use signed URLs or appropriate access controls where needed.

---

# 11. CSRF, CORS, COOKIES AND SECURITY HEADERS

Audit the browser security configuration.

Inspect:

- CSRF protection.
- CORS.
- Cookie attributes.
- Content Security Policy.
- HSTS.
- X-Content-Type-Options.
- Referrer-Policy.
- Clickjacking protection.
- Permissions-Policy.

Configure these controls according to the application's actual deployment architecture.

Do not use unrestricted wildcard CORS for authenticated sensitive APIs.

Do not disable CSRF protection without a valid, documented security justification.

Do not trust Origin or Referer headers as the only authorization mechanism.

Do not apply security headers blindly if they break required functionality.

Test the resulting configuration.

---

# 12. SSRF AND EXTERNAL INTEGRATIONS

Inspect all features that allow the backend to make requests to external services.

Examples:

- Image URL imports.
- Webhooks.
- URL previews.
- External API integrations.
- Document imports.
- File downloads.
- Third-party integrations.

Identify SSRF risks.

Prevent unauthorized access to:

- Internal services.
- Private network addresses.
- Cloud metadata endpoints.
- Localhost services.
- Internal administrative endpoints.

Validate destinations.

Use appropriate URL allowlists where possible.

Validate redirects.

Control outbound network access where the deployment environment supports it.

Do not trust external API responses.

---

# 13. RATE LIMITING AND ABUSE PREVENTION

Identify sensitive endpoints.

Examples:

- Login.
- Registration.
- Password reset.
- OTP verification.
- Search.
- Export.
- File upload.
- Payment.
- Inventory adjustment.
- User creation.
- Invitation.
- Bulk operations.

Implement appropriate rate limiting and abuse controls.

Use distributed rate limiting if the application requires multiple backend instances.

Protect resource-intensive endpoints.

Prevent uncontrolled database queries and expensive exports.

Do not apply simplistic global limits that break legitimate business operations.

---

# 14. AUDIT LOGGING AND SECURITY MONITORING

Implement or improve a reliable security audit logging system.

Record appropriate security-relevant events.

Examples:

- Successful authentication.
- Failed authentication.
- Password changes.
- Role changes.
- Permission changes.
- Account deactivation.
- Administrative actions.
- Sensitive exports.
- Stock adjustments.
- Stock transfers.
- Payment operations.
- Security configuration changes.
- Suspicious access attempts.

Audit logs should include relevant information such as:

- Actor.
- Action.
- Target resource.
- Timestamp.
- Outcome.
- Request correlation identifier.
- Relevant contextual metadata.

Do not store passwords, access tokens, secrets, or unnecessary sensitive information in logs.

Protect logs from unauthorized modification.

Restrict access to audit logs.

Do not allow ordinary users to modify or delete security audit records.

---

# 15. SECRETS AND ENVIRONMENT CONFIGURATION

Inspect the entire repository for exposed secrets.

Review:

- Environment files.
- Configuration files.
- Source code.
- Build output.
- Git history where appropriate.
- CI/CD configuration.
- Docker configuration.
- Deployment scripts.
- Documentation.
- Logs.

Identify:

- API keys.
- Database passwords.
- JWT secrets.
- Private keys.
- OAuth secrets.
- Payment credentials.
- Cloud credentials.
- Encryption keys.

Do not print secret values in the report.

If an exposed credential is identified:

1. Determine its location and potential exposure.
2. Remove it from active source code.
3. Move it into appropriate secret management.
4. Recommend rotation.
5. Rotate it only when explicitly authorized and operationally safe.
6. Identify any additional locations where it may remain exposed.

Do not assume that removing a secret from the latest commit removes it from Git history.

---

# 16. DEPENDENCY AND SUPPLY CHAIN SECURITY

Inspect the project's dependencies.

Identify:

- Vulnerable packages.
- Outdated security-sensitive packages.
- Abandoned dependencies.
- Unnecessary dependencies.
- Dependency conflicts.
- Unsafe package configuration.
- Exposed dependency secrets.

Use available dependency audit tools.

Examples include the package manager's audit functionality and appropriate software composition analysis tools.

Review lockfiles.

Prefer minimal, targeted dependency updates.

Do not blindly upgrade every dependency to the latest version.

Avoid breaking changes without a clear reason.

Do not automatically apply untrusted patches.

For critical vulnerabilities, investigate the affected version, exploitability, and available remediation.

---

# 17. BACKEND BUSINESS LOGIC SECURITY

Review all sensitive business operations.

Do not limit the audit to traditional technical vulnerabilities.

Investigate whether an attacker can abuse legitimate features.

Examples:

- Changing order ownership.
- Manipulating quantities.
- Modifying prices.
- Applying unauthorized discounts.
- Bypassing approval processes.
- Changing order statuses.
- Creating unauthorized refunds.
- Manipulating stock reservations.
- Bypassing role restrictions.
- Repeating one-time operations.
- Exploiting concurrent requests.
- Accessing another organization's data.

For every sensitive workflow, identify:

1. The expected business rule.
2. The authoritative backend validation.
3. The authorization requirements.
4. The state transition rules.
5. The database effects.
6. The possible abuse cases.
7. The required security tests.

Implement the missing protections.

---

# 18. AUTOMATED SECURITY TESTING

Create or improve automated security tests.

Test the application using its actual authentication and authorization mechanisms.

Include tests for:

- Unauthenticated access.
- Unauthorized access.
- Privilege escalation.
- Object-level authorization.
- Property-level authorization.
- Input validation.
- SQL injection resistance.
- XSS resistance.
- CSRF protection.
- Session invalidation.
- Rate limiting.
- File upload validation.
- Sensitive data exposure.
- API response restrictions.
- Inventory integrity.
- Payment integrity where applicable.
- Tenant isolation where applicable.

Use safe test payloads.

Run tests against a local or staging environment.

Do not use destructive payloads against production.

Where practical, include regression tests for every confirmed vulnerability.

A vulnerability is not fully remediated until its fix has been verified.

---

# 19. SECURITY VERIFICATION STANDARDS

Use the following standards as references:

- OWASP Application Security Verification Standard (ASVS), stable version 5.0.0.
- OWASP Top 10.
- OWASP API Security Top 10.
- OWASP Cheat Sheet Series.
- Relevant framework security documentation.
- Relevant database security documentation.

Use the standards as verification references, not as a substitute for understanding the actual application.

Map important findings to relevant security requirements where practical.

Do not claim formal certification or compliance unless an appropriate formal assessment has actually been completed.

---

# 20. REQUIRED SECURITY REMEDIATION WORKFLOW

For every identified vulnerability:

1. Identify the affected component.
2. Identify the root cause.
3. Determine the severity.
4. Determine the potential impact.
5. Determine whether exploitation is possible.
6. Implement a secure correction.
7. Add a regression test.
8. Execute the test.
9. Verify that the vulnerability is no longer reproducible.
10. Check for related vulnerabilities elsewhere.

Prioritize:

- Critical vulnerabilities.
- High-severity vulnerabilities.
- Authentication failures.
- Authorization failures.
- Privilege escalation.
- Data exposure.
- Injection.
- Data corruption.
- Financial manipulation.
- Inventory manipulation.

Do not stop after fixing a single instance of a vulnerability pattern.

Search for the same pattern throughout the codebase.

---

# 21. FINAL SECURITY REPORT

Produce a detailed security report.

Include:

## Executive summary

Describe the overall security condition of the application.

## Architecture

Document the relevant security architecture.

## Attack surface

List the major entry points and sensitive operations reviewed.

## Findings

For each finding, report:

- Finding ID.
- Title.
- Severity.
- Affected component.
- Root cause.
- Impact.
- Evidence.
- Remediation.
- Verification result.

Do not expose actual secrets in the report.

## Remediation summary

List the vulnerabilities fixed.

## Security tests

Report which tests were executed and their results.

## Remaining risks

List all unresolved issues.

## External dependencies

Identify security-sensitive external integrations and configuration dependencies.

## Production readiness

Provide an honest assessment of whether the application is ready for deployment.

Distinguish between:

- Verified secure controls.
- Implemented but incompletely tested controls.
- Unverified controls.
- Remaining vulnerabilities.
- External infrastructure requirements.

Do not claim that the application is completely secure.

---

# FINAL EXECUTION DIRECTIVE

BEGIN THE COMPLETE SECURITY AUDIT NOW.

Inspect the existing codebase.

Map the entire backend and attack surface.

Audit every API.

Audit authentication.

Audit authorization.

Audit the database.

Audit inventory and business logic.

Audit Admin and Super Admin operations.

Audit regular user access.

Audit all sensitive data.

Identify every feasible security weakness.

Implement the necessary security fixes.

Create regression tests.

Execute the tests.

Verify the results.

Continue until all feasible critical and high-priority security issues have been addressed.

Do not stop after writing a security report.

Do not stop after identifying vulnerabilities.

Do not stop after fixing the frontend.

The objective is to harden the actual application, especially its backend, APIs, database, and authorization system.

Work carefully, preserve existing functionality, avoid destructive operations, and provide an honest final security assessment.
