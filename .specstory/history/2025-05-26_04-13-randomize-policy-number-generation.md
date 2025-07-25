<!-- Generated by SpecStory -->

# Randomize Policy Number Generation (2025-05-26 07:13:14)

_**User**_

I need the Policy number to be generated random instead of it being incremental.

All these files here use that change it here in all of those

.@route.ts @route.ts @route.ts @route.ts @route.ts @route.ts @route.ts @page.tsx @page.tsx @page.tsx @page.tsx @page.tsx @page.tsx @page.tsx 

---

_**Assistant**_

I'll help you change the policy number generation from incremental to random across all the files. First, let me search for the current policy number generation logic to understand how it's implemented.

---

<details>
            <summary>Grep search for "policyNumber" • **41** files</summary>
        
| File | Line | Match |
|------|------|-------|
| `file:///d%3A/test%20policy%20gen/policy-gen/UPDATE_TEMPLATE_INSTRUCTIONS.md` | L8 | `- `[POLICY NUMBER]` → `{{policyNumber}}`` |
| `file:///d%3A/test%20policy%20gen/policy-gen/UPDATE_TEMPLATE_INSTRUCTIONS.md` | L23 | `- Replace: `{{policyNumber}}`` |
| `file:///d%3A/test%20policy%20gen/policy-gen/UPDATE_TEMPLATE_INSTRUCTIONS.md` | L60 | `- `{{policyNumber}}` → Policy number (e.g., "MMV135918666/1")` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/models/Policy.ts` | L4 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/models/Policy.ts` | L68 | `policyNumber: { type: String, unique: true },` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/models/Policy.ts` | L141 | `this.policyNumber = `POL-${String(count + 1).padStart(6, "0")}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/email.ts` | L16 | `subject: `🎉 Your Aviva Insurance Policy is Ready - ${policy.policyNumber}`,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/email.ts` | L20 | `filename: `Policy_Certificate_${policy.policyNumber}.pdf`,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/email.ts` | L362 | `<span class="policy-value">${policy.policyNumber}</span>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/email.ts` | L459 | `doc.text(`Policy Number: ${policy.policyNumber}`, pageWidth / 2, yPosition, {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/docxProcessor.ts` | L6 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/docxProcessor.ts` | L80 | `policyNumber: policy.policyNumber,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/components/ui/policy-card.tsx` | L17 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/components/ui/policy-card.tsx` | L98 | `{policy.policyNumber}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/user/policy/%5Bid%5D/page.tsx` | L37 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/user/policy/%5Bid%5D/page.tsx` | L219 | `<p className="text-sm text-gray-500">{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/user/page.tsx` | L29 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/user/page.tsx` | L207 | `{policy.policyNumber}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/user/page.tsx` | L256 | `{policy.policyNumber}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/page.tsx` | L21 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/page.tsx` | L266 | `<p className="text-gray-600">Policy #{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/page.tsx` | L341 | `<p className="font-medium">{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/edit/page.tsx` | L34 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/edit/page.tsx` | L487 | `Policy #{policy.policyNumber} - {policy.userId.fullName}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/page.tsx` | L24 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/page.tsx` | L221 | `{policy.policyNumber}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/policies/send-email/route.ts` | L59 | `const emailSubject = `Your Aviva Insurance Policy Certificate - ${policyData.policyNumber}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/policies/send-email/route.ts` | L73 | `<title>Aviva Insurance Policy - ${policyData.policyNumber}</title>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/policies/send-email/route.ts` | L269 | `<div class="policy-number">${policyData.policyNumber}</div>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/policies/send-email/route.ts` | L376 | `filename: `Policy_Certificate_${policyData.policyNumber}.docx`,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/policies/route.ts` | L151 | `policyNumber: newPolicy.policyNumber,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/create-policy-for-user/route.ts` | L51 | `const generatePolicyNumber = () => {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/create-policy-for-user/route.ts` | L61 | `policyNumber: generatePolicyNumber(),` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/users-with-policies/route.ts` | L29 | `.select("policyNumber price status startDate endDate vehicleInfo")` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/send-email/route.ts` | L39 | `const emailSubject = `Your Aviva Insurance Policy Certificate - ${policyData.policyNumber}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/send-email/route.ts` | L53 | `<title>Aviva Insurance Policy - ${policyData.policyNumber}</title>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/send-email/route.ts` | L249 | `<div class="policy-number">${policyData.policyNumber}</div>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/send-email/route.ts` | L356 | `filename: `Policy_Certificate_${policyData.policyNumber}.docx`,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/route.ts` | L362 | `policyNumber: newPolicy.policyNumber,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/users/%5Bid%5D/policies/page.tsx` | L37 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/users/%5Bid%5D/policies/page.tsx` | L127 | `policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/users/page.tsx` | L58 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/users/page.tsx` | L606 | `Policy #{policy.policyNumber}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/page.tsx` | L29 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/page.tsx` | L283 | `<p className="text-gray-600">Policy #{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/page.tsx` | L356 | `<p className="font-medium">{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/edit/page.tsx` | L34 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/edit/page.tsx` | L563 | `Policy #{policy.policyNumber} - {policy.userId.fullName}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policies/page.tsx` | L30 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policies/page.tsx` | L153 | `policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policies/page.tsx` | L185 | `return a.policyNumber.localeCompare(b.policyNumber);` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policies/page.tsx` | L187 | `return b.policyNumber.localeCompare(a.policyNumber);` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policies/page.tsx` | L406 | `{policy.policyNumber}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/page.tsx` | L44 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/page.tsx` | L145 | `policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||` |
| `file:///d%3A/test%20policy%20gen/policy-gen/scripts/seed.js` | L65 | `policyNumber: { type: String, unique: true },` |
| `file:///d%3A/test%20policy%20gen/policy-gen/scripts/seed.js` | L136 | `this.policyNumber = `POL-${String(count + 1).padStart(6, "0")}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/scripts/seed.js` | L798 | ``✅ Created policy ${newPolicy.policyNumber} for ${user.fullName} (${vehicle.make} ${vehicle.model})`` |
| `file:///d%3A/test%20policy%20gen/policy-gen/README.md` | L202 | `policyNumber: String (auto-generated),` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L16 | `I can see from the logs that you're getting a validation error when creating a policy. The error shows that `policyNumber` is required but missing. Let me investigate the admin policy creation API and form to fix this issue.` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L40 | `Now let me check the Policy model to see how the `policyNumber` is supposed to be generated:` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L63 | `Perfect! I can see the issue now. The Policy model has a `pre-save` middleware that should automatically generate a `policyNumber` if one isn't provided. However, there seems to be an issue with the validation. Let me check if there are any recent changes or if there's a problem with the middleware.` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L65 | `Looking at the model, the `policyNumber` field is required and should be auto-generated by the pre-save hook. The issue might be that the validation is running before the pre-save hook, or there's an issue with the auto-generat` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L111 | `⟪ 226 characters skipped ⟫save hook has a chance to generate the `policyNumber`.` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L119 | `if (!this.policyNumber) {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L125 | `this.policyNumber = `POL-${String(count + 1).padStart(6, "0")}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L136 | `Now let me also check if there are any validation issues by making the policyNumber field not required initially and letting the pre-save hook handle it:` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L141 | `policyNumber: {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L150 | `Actually, let me revert that change and use a better approach. The policyNumber should still be required, but I'll use a different approach with a default function:` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L155 | `policyNumber: {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L176 | `-   if (!this.policyNumber) {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L177 | `+   if (!this.policyNumber || this.policyNumber.startsWith('POL-' + Date.now().toString().substring(0, 8))) {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L192 | `-     !this.policyNumber ||` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L193 | `-     this.policyNumber.startsWith("POL-" + Date.now().toString().substring(0, 8))` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L233 | `The Policy model required a `policyNumber` field, but the pre-save hook that was supposed to generate it wasn't working properly. The validation was failing because the `policyNumber` was missing.` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L238 | `1. **Improved the pre-save hook**: Changed the condition from checking if `policyNumber` exists to checking if the document is new (`this.isNew`)` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L251 | `this.policyNumber = `POL-${String(count + 1).padStart(6, "0")}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L282 | `⟪ 144 characters skipped ⟫ the hook has a chance to generate the `policyNumber`. Let me fix this by making the field not required in the schema but ensuring it's always generated:` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L287 | `policyNumber: {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L293 | `+           // This will run after pre-save hooks, so policyNumber should exist` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L313 | `// This will run after pre-save hooks, so policyNumber should exist` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L352 | `-           // This will run after pre-save hooks, so policyNumber should exist` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-24_13-04-admin-policy-creation-error.md` | L365 | `1. The `policyNumber` fiel` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-26_04-13-randomize-policy-number-generation.md` | L22 | `<summary>Searched codebase "policyNumber generation generatePolicyNumber" • **24** results</summary>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-25_13-52-user-profile-drawer-implementation.md` | L682 | `⟪ 188 characters skipped ⟫49c6"endDate: "2027-08-22T00:00:00.000Z"policyNumber: "POL-000012"price: 123startDate: "2025-05-24T00:00:00.000Z"status: "active"updatedAt: "2025-05-25T14:31:30.698Z"userId: "68323c8c62390d4adf9249d2"vehicleInfo: acceleration: ""co2Emission` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-25_13-52-user-profile-drawer-implementation.md` | L685 | `⟪ 109 characters skipped ⟫49c6"endDate: "2027-08-22T00:00:00.000Z"policyNumber: "POL-000012"price: 123startDate: "2025-05-24T00:00:00.000Z"status: "active"updatedAt: "2025-05-25T14:31:30.698Z"userId: "68323c8c62390d4adf9249d2"vehicleInfo: {ncapRating: {…}, dimension` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-25_13-52-user-profile-drawer-implementation.md` | L1848 | `"policyNumber": "POL-000013",` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-25_13-52-user-profile-drawer-implementation.md` | L2069 | `⟪ 1251 characters skipped ⟫"updatedAt":"2025-05-25T15:10:45.634Z","policyNumber":"POL-000013","__v":0}}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-25_13-52-user-profile-drawer-implementation.md` | L2243 | `"policyNumber": "POL-000013",` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-25_13-52-user-profile-drawer-implementation.md` | L3069 | `"policyNumber": "POL-000013",` |
| `file:///d%3A/test%20policy%20gen/policy-gen/.specstory/history/2025-05-25_13-52-user-profile-drawer-implementation.md` | L3215 | `"policyNumber": "POL-000013",` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/page.tsx` | L24 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/page.tsx` | L221 | `{policy.policyNumber}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/edit/page.tsx` | L34 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/edit/page.tsx` | L563 | `Policy #{policy.policyNumber} - {policy.userId.fullName}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/page.tsx` | L29 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/page.tsx` | L283 | `<p className="text-gray-600">Policy #{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/admin/policy/%5Bid%5D/page.tsx` | L356 | `<p className="font-medium">{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/docxProcessor.ts` | L6 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/docxProcessor.ts` | L80 | `policyNumber: policy.policyNumber,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/send-email/route.ts` | L39 | `const emailSubject = `Your Aviva Insurance Policy Certificate - ${policyData.policyNumber}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/send-email/route.ts` | L53 | `<title>Aviva Insurance Policy - ${policyData.policyNumber}</title>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/send-email/route.ts` | L249 | `<div class="policy-number">${policyData.policyNumber}</div>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/send-email/route.ts` | L356 | `filename: `Policy_Certificate_${policyData.policyNumber}.docx`,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/email.ts` | L16 | `subject: `🎉 Your Aviva Insurance Policy is Ready - ${policy.policyNumber}`,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/email.ts` | L20 | `filename: `Policy_Certificate_${policy.policyNumber}.pdf`,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/email.ts` | L362 | `<span class="policy-value">${policy.policyNumber}</span>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/email.ts` | L459 | `doc.text(`Policy Number: ${policy.policyNumber}`, pageWidth / 2, yPosition, {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/policies/route.ts` | L362 | `policyNumber: newPolicy.policyNumber,` |
| `file:///d%3A/test%20policy%20gen/policy-gen/UPDATE_TEMPLATE_INSTRUCTIONS.md` | L8 | `- `[POLICY NUMBER]` → `{{policyNumber}}`` |
| `file:///d%3A/test%20policy%20gen/policy-gen/UPDATE_TEMPLATE_INSTRUCTIONS.md` | L23 | `- Replace: `{{policyNumber}}`` |
| `file:///d%3A/test%20policy%20gen/policy-gen/UPDATE_TEMPLATE_INSTRUCTIONS.md` | L60 | `- `{{policyNumber}}` → Policy number (e.g., "MMV135918666/1")` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/create-policy-for-user/route.ts` | L51 | `const generatePolicyNumber = () => {` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/sub-admin/create-policy-for-user/route.ts` | L61 | `policyNumber: generatePolicyNumber(),` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/api/admin/users-with-policies/route.ts` | L29 | `.select("policyNumber price status startDate endDate vehicleInfo")` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/edit/page.tsx` | L34 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/edit/page.tsx` | L487 | `Policy #{policy.policyNumber} - {policy.userId.fullName}` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/page.tsx` | L21 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/page.tsx` | L266 | `<p className="text-gray-600">Policy #{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/app/sub-admin/policy/%5Bid%5D/page.tsx` | L341 | `<p className="font-medium">{policy.policyNumber}</p>` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/models/Policy.ts` | L4 | `policyNumber: string;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/models/Policy.ts` | L68 | `policyNumber: { type: String, unique: true },` |
| `file:///d%3A/test%20policy%20gen/policy-gen/src/lib/models/Policy.ts` | L141 | `this.policyNumber = `POL-${String(count + 1).padStart(6, "0")}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/scripts/seed.js` | L65 | `policyNumber: { type: String, unique: true },` |
| `file:///d%3A/test%20policy%20gen/policy-gen/scripts/seed.js` | L136 | `this.policyNumber = `POL-${String(count + 1).padStart(6, "0")}`;` |
| `file:///d%3A/test%20policy%20gen/policy-gen/scripts/seed.js` | L798 | ``✅ Created policy ${newPolicy.policyNumber} for ${user.fullName} (${vehicle.make} ${vehicle.model})`` |

</details>

---

Now let me look at the Policy model to see the current implementation:

---

Read file: src/lib/models/Policy.ts

---

Now let me check if there's a utility function for generating random policy numbers:

---

<details>
            <summary>Grep search for "generateRandomPolicyNumber" • **1** files</summary>
        
| File | Line | Match |
|------|------|-------|
| `file:///d%3A/test%20policy%20gen/policy-gen/.cursor/rules/derived-cursor-rules.mdc` | L7 | `⟪ 466 characters skipped ⟫licyNumber` for new policies using the `generateRandomPolicyNumber()` utility function. The pre-save hook should only run for new documents (`this.isNew`). Robust error handling should be implemented within the pre-save hook to catch and lo` |

</details>

---

Let me check the utils file to see if there's already a random policy number generator:

---

Read file: src/lib/utils.ts

---

Now I need to create a random policy number generator and update all the relevant files. Let me start by adding the random policy number generator to the utils file:

---



---



---

