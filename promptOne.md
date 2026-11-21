# Task: Comprehensive Legal Compliance, Privacy, Security & Accessibility Audit

Act as a senior full-stack engineer, application security specialist, privacy engineer, and accessibility expert.

Your mission is to **audit my existing application and implement all 20 improvements listed below**, adapting them to the application's actual features, technology stack, business model, and target users.

Do not simply generate recommendations or a checklist. Inspect the existing codebase, identify what is missing, and implement the appropriate changes directly in the project.

## 1. Privacy Policy

- Create or improve a comprehensive privacy policy.
- Explain what personal data is collected, why it is collected, how it is processed, how long it is retained, and with whom it is shared.
- Document relevant third-party services, analytics, cookies, and SDKs.
- Explain users' applicable privacy rights and how they can exercise them.
- Ensure the policy reflects the application's actual data practices. Never invent compliance claims.

## 2. Terms of Service

- Create or improve the Terms of Service.
- Cover account responsibilities, acceptable use, intellectual property, service availability, subscriptions, payments, termination, liability, dispute resolution, and other provisions relevant to the application.
- Use appropriate jurisdiction-specific language where the jurisdiction is known.
- Flag provisions that require review by a qualified lawyer instead of pretending to provide guaranteed legal protection.

## 3. Refund Policy

- Create a clear refund and cancellation policy that reflects the application's actual payment model.
- Explain eligibility, deadlines, exceptions, processing times, subscription cancellation, and how to request a refund.
- Do not impose terms that conflict with applicable consumer-protection laws.
- Do not invent refund guarantees or processing capabilities that do not exist.

## 4. Cookie Policy

- Document all cookies and similar technologies actually used by the application.
- Classify them where appropriate: strictly necessary, preferences, analytics, and advertising.
- Explain their purposes, duration, and relevant third-party providers.
- Remove outdated or inaccurate cookie disclosures.

## 5. Cookie Consent Banner

- Implement a functional cookie-consent interface if the application uses non-essential cookies or similar tracking technologies.
- Provide clear options to accept, reject, and customize optional cookies.
- Do not activate non-essential tracking before the required consent has been obtained.
- Allow users to reopen their preferences and withdraw consent.
- Store consent appropriately and document its expiration and versioning.
- Respect applicable consent requirements based on the users and jurisdictions served.
- Do not display a misleading banner if no consent mechanism is needed.

## 6. Audit Form Consents

- Audit registration forms, contact forms, checkout forms, newsletter subscriptions, and all other data-collection interfaces.
- Identify which consents are legally or operationally necessary.
- Add explicit, separate, unchecked-by-default consent controls when required.
- Do not bundle marketing consent with acceptance of essential service terms.
- Record consent timestamps, purposes, and policy versions where appropriate.
- Make sure consent can be withdrawn when applicable.
- Never use preselected optional consent checkboxes.

## 7. Minimize Unnecessary Data Collection

- Audit every form, database model, API endpoint, analytics event, and stored user attribute.
- Remove personal-data fields that have no documented purpose.
- Collect only the information needed for the application's functionality and legitimate purposes.
- Avoid logging passwords, authentication tokens, payment details, or unnecessary personal information.
- Establish appropriate retention and deletion rules.
- Ensure backend validation and database changes match the frontend.

## 8. Audit Third-Party SDKs and Dependencies

- Inspect package manifests, lockfiles, integrations, SDKs, scripts, analytics providers, advertising tools, and external APIs.
- Identify unused, outdated, vulnerable, redundant, or privacy-invasive dependencies.
- Remove unnecessary integrations and replace unsafe patterns where appropriate.
- Review permissions, data transfers, tracking behavior, and vendor configuration.
- Run available dependency and security audits.
- Do not remove dependencies blindly or break existing features.
- Document unresolved vulnerabilities and required upgrades.

## 9. Remove Dark Patterns

Audit the entire application for deceptive or manipulative UX, including:

- Hidden cancellation options.
- Misleading subscription flows.
- Preselected marketing consent.
- False urgency or fabricated scarcity.
- Misleading buttons or unclear labels.
- Obstructive account deletion.
- Hidden fees.
- Unbalanced accept/reject consent interfaces.
- Unnecessary steps to refuse optional features.

Replace these with transparent, user-friendly flows. Preserve legitimate business functionality without manipulating users.

## 10. Remove Hidden Fees

- Audit pricing pages, checkout flows, subscriptions, invoices, and payment calculations.
- Disclose mandatory fees before the user commits to a purchase.
- Display applicable taxes, recurring charges, trial expiration dates, and renewal conditions where required.
- Ensure the frontend and backend calculate the same totals.
- Prevent unexpected charges caused by ambiguous defaults or hidden add-ons.
- Do not invent prices or modify the intended business model without documenting the change.

## 11. Remove Fake Reviews

- Audit reviews, testimonials, ratings, customer logos, statistics, and social-proof sections.
- Remove fabricated, placeholder, or unverified claims presented as genuine customer feedback.
- Clearly label demo content and sample data.
- Preserve authentic reviews when their provenance is reasonably established.
- Do not manufacture customers, ratings, testimonials, or review counts.

## 12. Remove Unsupported Claims

- Inspect marketing pages, feature descriptions, pricing pages, banners, metadata, and promotional copy.
- Identify unverifiable claims about security, encryption, certifications, customer counts, uptime, performance, compliance, and business results.
- Remove or qualify unsupported claims.
- Verify technical claims against the implementation and available evidence.
- Never claim the application is GDPR-, CCPA-, or otherwise legally compliant merely because a policy page exists.

## 13. Accessibility Alt Text

- Audit images, icons, image-based controls, and meaningful visual content.
- Add accurate, contextual alt text to informative images.
- Use empty alt attributes for decorative images where appropriate.
- Give accessible names to icon-only buttons and controls.
- Avoid redundant or keyword-stuffed descriptions.
- Preserve proper image semantics and avoid describing information that is not present.

## 14. Fix Color Contrast

- Audit text, buttons, links, inputs, placeholders, focus indicators, badges, and interactive components.
- Target WCAG 2.2 AA contrast requirements:
  - At least 4.5:1 for normal text.
  - At least 3:1 for large text.
  - At least 3:1 for relevant graphical objects and UI component boundaries.

- Check all themes, including light mode, dark mode, hover states, disabled states, and error states.
- Improve colors while preserving the application's visual identity.
- Do not communicate status or errors using color alone.

## 15. Keyboard Navigation

- Ensure every interactive feature can be operated using a keyboard.
- Check logical tab order, visible focus indicators, accessible menus, dialogs, dropdowns, forms, and navigation.
- Support Escape to close dismissible overlays where appropriate.
- Manage focus correctly when dialogs open and close.
- Ensure users do not encounter keyboard traps.
- Use semantic HTML before introducing custom keyboard behavior.
- Respect reduced-motion preferences where applicable.

## 16. Business Details

- Verify the application's business identity and contact information.
- Add or improve appropriate business details, such as:
  - Legal business name, where applicable.
  - Business address or registered address, where legally required.
  - Contact email.
  - Customer support contact.
  - Applicable registration or tax information.
  - Pricing and subscription information.

- Do not invent a company name, address, registration number, or contact details.
- If information is missing, create a clear configuration placeholder and document what the owner must provide.
- Do not publish private residential details without authorization.

## 17. Age Consent and Children's Data

- Determine whether the application is intended for children, adults, or a general audience.
- Inspect registration, date-of-birth collection, profiling, analytics, and other child-related data processing.
- Implement age-related controls and parental consent mechanisms only where appropriate and legally required.
- Avoid collecting full birth dates when a less intrusive age check is sufficient.
- Do not collect children's personal data without the necessary legal basis and safeguards.
- Do not implement an age gate as a substitute for substantive children's privacy protections.
- Document any jurisdiction-specific requirements that need legal review.

## 18. Unsubscribe Links in Emails

- Audit marketing email templates and subscription workflows.
- Add a visible, functional unsubscribe link to marketing emails where required.
- Implement a backend unsubscribe endpoint or equivalent mechanism.
- Make unsubscribe requests effective promptly and within applicable legal deadlines.
- Ensure unsubscribed users are excluded from future marketing campaigns.
- Keep essential transactional and security emails separate from marketing communications.
- Do not require users to log in unnecessarily just to unsubscribe.
- Verify that unsubscribe actions cannot be abused to modify another user's account.

## 19. Font and Image Licensing

- Audit fonts, illustrations, images, icons, logos, videos, and other third-party assets.
- Identify their source and applicable license where possible.
- Check whether commercial use, modification, redistribution, and attribution are permitted.
- Replace assets with unclear or incompatible licensing when necessary.
- Preserve required copyright notices and attribution.
- Do not claim an asset is licensed merely because it appears in the repository.
- Document assets that need manual license verification.

## 20. User Data Deletion Requests

- Implement an appropriate account and personal-data deletion workflow.
- Provide an accessible way for users to request account deletion.
- Add backend authorization and verification.
- Delete or anonymize relevant personal data across the database and connected services where required.
- Consider uploaded files, images, documents, cached information, analytics identifiers, and third-party integrations.
- Revoke active sessions and credentials as appropriate.
- Explain any data that must be retained for legal or legitimate documented reasons, including applicable retention periods.
- Provide confirmation of deletion requests and their completion where feasible.
- Protect the workflow against unauthorized deletion and abuse.
- Do not claim complete deletion if backups, external services, or retained records have not been addressed.

## Implementation Workflow

### Phase 1 — Inspect the project

Before changing anything:

1. Identify the framework, language, architecture, package manager, database, authentication system, hosting environment, payment integrations, email provider, analytics, and third-party services.
2. Inspect the existing pages, routes, components, forms, API endpoints, database schemas, configuration files, and design system.
3. Identify features that actually exist versus planned or demo features.
4. Check the current implementation for all 20 requirements.
5. Prepare a prioritized list of findings and implementation tasks.

Do not assume the project uses a specific framework or backend. Adapt to the actual repository.

### Phase 2 — Implement changes

Implement the applicable improvements directly in the existing codebase.

Requirements:

- Preserve the existing architecture and design language.
- Reuse existing components and utilities when appropriate.
- Make changes across frontend, backend, database, email templates, and integrations where necessary.
- Add database migrations when needed and preserve existing data.
- Add environment variables only when necessary; document them in the project's example environment file without exposing secrets.
- Avoid unnecessary rewrites or unrelated features.
- Do not expose secrets, API keys, tokens, or personal information in source code or logs.
- Use real application behavior rather than static UI mockups for critical features such as consent, unsubscribe, and deletion.
- Do not silently break existing functionality.

### Phase 3 — Test and verify

After implementation:

1. Run available tests, linting, type checks, and production builds.
2. Test registration and consent flows.
3. Test cookie acceptance, rejection, customization, and withdrawal where applicable.
4. Verify that non-essential tracking does not run before required consent.
5. Test authentication, authorization, and account deletion.
6. Test unsubscribe functionality and suppression of future marketing emails.
7. Test forms, pricing calculations, and checkout disclosures.
8. Check keyboard navigation, accessible names, focus indicators, and color contrast.
9. Check privacy-sensitive logging and data retention.
10. Verify that policy pages accurately describe the implemented behavior.

Add automated tests for critical privacy, security, consent, deletion, and subscription workflows wherever practical.

If a test cannot be run because a service, credential, environment, or external integration is unavailable, explain the limitation. Never report a test as passed if it was not executed.

### Phase 4 — Legal and compliance review

Distinguish between:

- Technical improvements implemented and tested.
- Policy content drafted but awaiting business details.
- Third-party vendor or operational changes requiring owner action.
- Legal questions requiring review by a qualified professional.

Consider applicable privacy, consumer-protection, accessibility, marketing-email, and children's-data requirements based on the application's target users, business location, and markets served.

This work should reduce avoidable risk, but do not promise that the application can never be sued or guarantee legal compliance.

### Phase 5 — Final report

When finished, provide a concise but specific report containing:

1. **Findings:** The important problems discovered.
2. **Changes implemented:** Grouped by the 20 requirements.
3. **Files modified:** Paths and a short description of each important change.
4. **Database changes:** Migrations and any required deployment steps.
5. **Tests:** Commands executed and actual results.
6. **Owner actions required:** Missing business information, vendor configuration, credentials, or legal review.
7. **Remaining risks:** Items that could not be fully resolved or verified.
8. **Deployment instructions:** Environment variables, migrations, configuration, and any other steps needed to activate the changes saafely.

Start by inspecting the repository and creating a concrete implementation plan. Then proceed with the implementation, testing your changes as you go. Do not stop after generating a plan unless you encounter a genuine blocker that requires my input.
