# Firestore Security Specification

## 1. Data Invariants
1. **Default Deny & Verified Identity**: All Firestore paths default to deny. Every user-private read and every write requires an authenticated user with `request.auth.token.email_verified == true`.
2. **Strict PII Isolation & Governance (`/users/{userId}`)**:
   - Document ID `{userId}` must strictly match `^[a-zA-Z0-9_\-]+$` and `request.auth.uid == userId` for owner writes.
   - `email` (PII) resides exclusively on `/users/{userId}` with zero public reads. Regular users have strict owner-only `get`, `create`, and active-only `update` (`displayName`, `email`, `photoURL`, `lastLoginAt`) with zero `list` access. Verified dashboard administrator (`request.auth.token.email_verified == true && request.auth.token.email == 'info.pscnepal@gmail.com'`) has `get`, `list`, governed `update` (details, `role`, `status` `'active' | 'disabled' | 'banned'`, `statusReason`, `targetCadre`, `phone`, `adminNotes`, `statusUpdatedAt`, `updatedAt`), and `delete` (non-self) access.
   - Regular users cannot self-assign `role: 'admin'` or set moderation fields (`status != 'active'`, `statusReason`, `adminNotes`) on create, and cannot modify `role` or `status` on update (preventing self-unban or privilege escalation).
   - Banned or disabled users (`status in ['banned', 'disabled']`) are denied profile updates, subcollection writes, and `itemStats` mutations.
   - `uid` and `createdAt` are immutable after creation; `createdAt == request.time` on create and `lastLoginAt == request.time` on create and owner login updates.
3. **Quiz Attempts Subcollection (`/users/{userId}/quizAttempts/{attemptId}`)**:
   - Master Gate: Parent document `/users/$(userId)` must exist (`exists(...)`), be active (`status == 'active'`), and `userId == request.auth.uid`.
   - Terminal Outcome Locking: Completed quiz attempts are immutable (`allow update: if false`), allowing `get`, `list` (enforcing `resource.data.userId == request.auth.uid`, or `isAdmin() && resource.data.userId == userId`), active-owner `create`, and active-owner or non-self admin `delete`.
4. **Flagged Questions Subcollection (`/users/{userId}/flaggedQuestions/{questionId}`)**:
   - Master Gate: Parent document `/users/$(userId)` must exist and be active on create/update; `userId == request.auth.uid` and `questionId` matches path `{questionId}`. Read (`get`/`list`) is restricted to `isOwner(userId)` or `isAdmin()`, and delete is permitted to active owners or non-self admins during account removal.
   - Strict schema allowlist (`questionId`, `userId`, `flaggedAt`, `source`, optional `deckTitle`, `cadreId`, `note`, `createdAt`, `updatedAt`) with bounded string lengths (`note <= 1000`).
   - Only `flaggedAt`, `source`, `deckTitle`, `cadreId`, `note`, `updatedAt` are mutable on update, with `updatedAt == request.time` and immutable `questionId`/`userId`/`createdAt`.
5. **User Item Reactions Subcollection (`/users/{userId}/itemReactions/{itemId}`)**:
   - Write restricted to active owner (`isActiveAccount(userId)`), gated by `exists(/users/$(userId))` on create; delete allowed to active owner or non-self admin during account removal; read (`get`/`list`) restricted to `isOwner(userId)` or `isAdmin()`.
   - Enforces `reaction in ['like', 'dislike', 'none']`, `itemType in ['question', 'material']`, and bounded `viewCount` (`0..100000`).
6. **Community Item Stats (`/itemStats/{itemId}`)**:
   - Publicly readable aggregate non-PII counters (`get` validates `isValidId(itemId)`; `list` enforces `existing().itemType in ['question', 'material']`).
   - Writes (`create`/`update`) require a verified active user (`isActiveSignedInUser()`) AND atomic synchronization with `/users/$(request.auth.uid)/itemReactions/$(itemId)` verified via `existsAfter(...)`.
   - Enforces bounded step deltas (`likesCount` and `dislikesCount` delta in `[-1, +1]`, non-decreasing `viewsCount` delta `<= 100` per commit), preventing arbitrary counter inflation, and forbids deletion.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Write**: Writing `/users/uid123/flaggedQuestions/PSC-GEO-101` or `/itemStats/PSC-GEO-101` with `request.auth == null`.
2. **Unverified Email Spoofing**: Writing `/users/uid123` or `/itemStats/PSC-GEO-101` with `request.auth.token.email_verified == false`.
3. **Cross-User PII / Flag Peek**: Authenticated user `uidA` reading `/users/uidB`, `/users/uidB/flaggedQuestions/Q1`, or `/users/uidB/itemReactions/Q1`.
4. **Users Collection Enumeration**: Authenticated user issuing `list` on `/users`.
5. **Shadow / Ghost Field Injection**: Creating `/users/uid123/flaggedQuestions/Q1` with an extra `role: "admin"` or `isApproved: true` field.
6. **UID Identity Spoofing**: User `uidA` creating `/users/uidA/flaggedQuestions/Q1` with `userId: "uidB"`.
7. **Immutable Field Tampering**: Updating `/users/uid123/flaggedQuestions/Q1` with a modified `questionId`, `userId`, or backdated `createdAt`.
8. **Client-Forged Timestamp**: Creating `/users/uid123/itemReactions/Q1` where `updatedAt != request.time`.
9. **Resource Poisoning / Oversized String**: Sending `note` of 2,500 chars on a flagged question or path `{itemId}` containing invalid characters (`../bad`) or `> 128` chars.
10. **Orphaned Subcollection Write**: Creating `flaggedQuestions/Q1` or `itemReactions/Q1` when `/users/uid123` does not exist.
11. **Standalone Counter Inflation (Sync Bypass)**: Updating `/itemStats/Q1` `likesCount: 9999` or without an accompanying `users/$(uid)/itemReactions/Q1` document (`existsAfter` check fails).
12. **Terminal Attempt Score Tampering & Stats Deletion**: Issuing `update` on `/users/uid123/quizAttempts/att1` or `delete` on `/itemStats/Q1`.
