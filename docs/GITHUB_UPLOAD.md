# Upload to GitHub

From the project folder:

```bash
git init
git add .
git commit -m "Initial release: AgentOS Enterprise Platform"
git branch -M main
git remote add origin https://github.com/faixankh/agentos-enterprise-platform.git
git push -u origin main
```

If GitHub returns a permission error, confirm that the repository belongs to the account currently authenticated in Git.

```bash
git remote -v
git config user.name
git config user.email
```
