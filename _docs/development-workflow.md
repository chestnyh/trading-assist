# Development Workflow

This document outlines the standard development workflow for this project.

## Branch Creation

1. **Create a branch for each ticket that requires code changes**
   - Each feature, bug fix, or enhancement should have its own dedicated branch
   - This ensures clean separation of work and easier code review

2. **Branch naming convention**
   - Branch names must include the ticket ID
   - Example: `feature/TICKET-<tiket_id>-signup-layout` or `fix/TICKET-<tiket_id>-login-bug`
   - This helps track which branch corresponds to which ticket

## Pull Request Process

3. **Creating Pull Requests**
   - Pull requests should be created targeting the `dev` branch
   - Ensure your branch is up to date with `dev` before creating the PR

4. **PR Description Requirements**
   - **Link to the task**: The PR description must include a link to the original task/ticket
   - **PR Information**: The PR description should contain relevant information about the changes, including:
     - What changes were made
     - Why the changes were necessary
     - Any breaking changes or migration steps (if necessary)
     - Screenshots or examples (if applicable)

5. **PR Review Process**
   - All pull requests must go through a code review process
   - Reviewers should check for:
     - Code quality and adherence to project standards
     - Correctness of implementation
     - Test coverage
     - Documentation updates (if needed)

## Environment Consistency

6. **Environment Variables Check**
   - We use a custom script to keep local .env files in sync with .example templates.
   - **Pre-commit**: The check runs automatically before every commit. It will block the commit if you added new variables to your local .env but forgot to update the corresponding .example file.
   - **Post-merge**: After a git pull or merge, the script runs to check if your teammates added new required variables. It will interactively ask if you want to add missing keys to your local environment.
   - Manual Check: You can always run this check manually using pnpm check:envs.

## Merge and Deployment

7. **Merge Requirements**
   - PRs can be merged only after:
     - **Sufficient approvals**: The required number of approvals from team members
     - **CI/CD passes**: All automated tests and checks must pass successfully
   - Once both conditions are met, the PR can be merged into the `dev` branch

8. **Automatic Deployment**
   - After merging, there is an automatic deployment to the staging environment
   - This allows for immediate testing of changes in a production-like environment
   - Monitor the deployment status and verify the changes work as expected in staging