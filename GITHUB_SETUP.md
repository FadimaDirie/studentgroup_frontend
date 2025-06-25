# How to Push Your StudyGroups Project to GitHub

## Step 1: Create Your GitHub Repository
1. Go to https://github.com and sign in
2. Click the **"+"** button in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `studygroups-dashboard` (or your preferred name)
   - **Description**: "Student productivity dashboard for managing study groups and tasks"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Push Your Code
After creating the repository, GitHub will show you the commands. Use these in the Replit terminal:

```bash
# Set your remote repository (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 3: If You Get Authentication Error
If you get an authentication error, you'll need to use a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with "repo" permissions
3. Use this command format:
```bash
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Example Commands
Replace `yourusername` and `studygroups-dashboard` with your actual values:

```bash
git remote add origin https://github.com/yourusername/studygroups-dashboard.git
git branch -M main
git push -u origin main
```

## Your Project is Ready!
- ✅ Git repository initialized
- ✅ All files committed
- ✅ .gitignore configured
- ✅ Application running successfully

Just create the GitHub repository and run the push commands above!