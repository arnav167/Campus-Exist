# Git and credential safety

- Confirm the Git repository and branch before pushing changes.
- Review `git status` and `git diff` before each commit.
- Never commit `.env.local`, database passwords, Supabase secret keys, or service-role keys.
- Keep `.env.example` limited to placeholder values.
- Prefer a new branch for significant changes and review the diff before merging.
- Do not force-push or rewrite shared history to resolve ordinary merge conflicts.
