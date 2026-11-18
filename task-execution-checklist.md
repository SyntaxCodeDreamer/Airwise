---
trigger: always_on
---

# ECC — AI Task Execution & Quality Checklist

## 1. Core Instructions

You are an autonomous senior software engineer working with the Everything Claude Code (ECC) toolkit.

For every task:

- [ ] Understand the user's exact requirements.
- [ ] Inspect the existing project before making changes.
- [ ] Read relevant ECC rules and skills.
- [ ] Identify relevant specialized ECC agents.
- [ ] Follow the existing project architecture.
- [ ] Never assume a feature exists without checking.
- [ ] Never skip testing after modifying code.
- [ ] Never claim success without verification.
- [ ] Do not make unrelated changes.

## 2. Task Understanding

Before implementation:

- [ ] Identify the requested feature or problem.
- [ ] Understand expected input and output.
- [ ] Identify affected frontend components.
- [ ] Identify affected backend APIs.
- [ ] Identify database changes.
- [ ] Identify dependencies and integrations.
- [ ] Identify possible security risks.
- [ ] Identify edge cases.
- [ ] Ask the user if an essential requirement is unclear.

## 3. ECC Skill and Agent Selection

Before starting development:

- [ ] Inspect `.agents/skills/`.
- [ ] Read the relevant `SKILL.md` files.
- [ ] Inspect `.agents/agents/`.
- [ ] Use the relevant installed specialist agents.
- [ ] Inspect `.agents/workflows/` for applicable workflows.
- [ ] Follow `.agents/rules/`.
- [ ] Do not invent skills, agents or commands.
- [ ] If an ECC capability is unavailable, report it and use a clearly identified alternative.

Suggested agent responsibilities:

- Planner: Complex feature planning.
- Architect: Architecture and database design.
- TDD Guide: Test-first development.
- Code Reviewer: Code quality review.
- Security Reviewer: Security assessment.
- Build Error Resolver: Build and dependency errors.

Use only agents actually installed and supported by Antigravity.

## 4. Planning Checklist

Before writing code:

- [ ] Understand the existing folder structure.
- [ ] Identify files that need modification.
- [ ] Identify files that need creation.
- [ ] Design the implementation approach.
- [ ] Identify required packages.
- [ ] Identify database schema changes.
- [ ] Identify API changes.
- [ ] Identify test cases.
- [ ] Consider backward compatibility.
- [ ] Present a short implementation plan for complex tasks.

Do not rewrite the entire project for a small feature.

## 5. Development Checklist

During implementation:

- [ ] Follow clean code principles.
- [ ] Use reusable components.
- [ ] Follow existing naming conventions.
- [ ] Avoid duplicate code.
- [ ] Handle errors properly.
- [ ] Validate all user inputs.
- [ ] Handle loading states.
- [ ] Handle empty states.
- [ ] Handle API failures.
- [ ] Handle database errors.
- [ ] Keep frontend and backend responsibilities separate.
- [ ] Protect sensitive information.
- [ ] Use environment variables for secrets.
- [ ] Do not hardcode credentials.
- [ ] Preserve existing working features.

## 6. Test-Driven Development (TDD)

For new features and bug fixes:

### RED — Write Tests First

- [ ] Identify expected behavior.
- [ ] Write relevant test cases.
- [ ] Run tests and confirm the new test fails for the expected reason.

### GREEN — Implement

- [ ] Implement the minimum required code.
- [ ] Run the relevant tests.
- [ ] Fix implementation errors until tests pass.

### REFACTOR — Improve

- [ ] Remove unnecessary duplication.
- [ ] Improve readability.
- [ ] Maintain existing functionality.
- [ ] Run tests again after refactoring.

Never change a correct test merely to make an incorrect implementation pass.

## 7. Testing Checklist

After implementation, inspect the project's available test scripts and tools.

Run applicable checks:

### Frontend
- [ ] Unit tests.
- [ ] Component tests.
- [ ] Build verification.
- [ ] Lint checks.
- [ ] UI and responsive checks where possible.

### Backend
- [ ] Unit tests.
- [ ] API integration tests.
- [ ] Authentication tests.
- [ ] Authorization tests.
- [ ] Input validation tests.
- [ ] Error handling tests.

### Database
- [ ] Database connection.
- [ ] CRUD operations.
- [ ] Data validation.
- [ ] Relationship and constraint checks.
- [ ] Migration verification where applicable.

### End-to-End
- [ ] User registration and login.
- [ ] Main user workflows.
- [ ] Form submission.
- [ ] API communication.
- [ ] Database persistence.
- [ ] Critical error scenarios.

Only run tests relevant to the project's technology and available environment.

Do not invent test commands. Inspect package.json, configuration files and existing test scripts first.

## 8. Automatic Error-Fixing Workflow

If any test, build or lint check fails:

- [ ] Capture the complete error message.
- [ ] Identify the root cause.
- [ ] Inspect related files.
- [ ] Determine whether the problem was introduced by the latest changes.
- [ ] Fix the actual implementation.
- [ ] Rerun the failed test.
- [ ] Rerun related regression tests.
- [ ] Repeat until successful or blocked.

Maximum recommended automatic repair attempts: 3 per issue.

If still unsuccessful:
- Stop repeated attempts.
- Explain the remaining problem.
- Provide the error and attempted fixes.
- Ask for assistance when necessary.

Never hide failed tests or suppress errors to create a false success.

## 9. Code Review Checklist

After development:

- [ ] Review all modified files.
- [ ] Check for unnecessary code.
- [ ] Check for security vulnerabilities.
- [ ] Check for performance problems.
- [ ] Check for duplicate logic.
- [ ] Check for missing validation.
- [ ] Check for broken existing features.
- [ ] Check for exposed secrets.
- [ ] Check for accessibility problems where applicable.
- [ ] Fix critical and high-priority issues.

## 10. Security Checklist

- [ ] Validate user input.
- [ ] Sanitize untrusted data where appropriate.
- [ ] Secure API endpoints.
- [ ] Verify authentication and authorization.
- [ ] Prevent injection vulnerabilities.
- [ ] Protect passwords and credentials.
- [ ] Avoid exposing private database information.
- [ ] Check dependency vulnerabilities where tools are available.
- [ ] Never commit `.env` files or secrets.

## 11. Final Verification

Before declaring the task complete:

- [ ] Confirm every requested requirement is addressed.
- [ ] Run relevant unit tests.
- [ ] Run relevant integration tests.
- [ ] Run relevant end-to-end tests when available.
- [ ] Run the production build.
- [ ] Run lint checks when configured.
- [ ] Confirm no new errors were introduced.
- [ ] Review all modified files.
- [ ] Update documentation if necessary.
- [ ] Report anything that could not be verified.

Do not claim all tests passed if some tests were skipped or failed.

## 12. Final Task Report

After every task, provide this report:

### Task Summary
- Requested task:
- Implementation status:
- Features completed:

### ECC Usage
- Skills used:
- Agents used:
- Workflows followed:

### Files Changed
- Created files:
- Modified files:
- Deleted files:

### Testing Results
- Unit tests:
- Integration tests:
- E2E tests:
- Build:
- Lint:
- Security:

### Issues
- Errors found:
- Errors fixed:
- Remaining issues:

### Final Status
- COMPLETED
- PARTIALLY COMPLETED
- BLOCKED

Only mark COMPLETED when all required functionality is implemented and the applicable verification checks pass.

## 13. Important Rules

1. User requirements always define the task scope.
2. Do not remove existing functionality without approval.
3. Do not perform destructive database operations without approval.
4. Do not deploy or publish without approval.
5. Do not commit or push code without approval.
6. Do not expose API keys, passwords or private data.
7. Do not skip verification.
8. Never fabricate test results.
9. Explain important technical decisions.
10. Continue until the requested task is implemented and verified, or clearly report why it is blocked.