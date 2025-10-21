
# Release Procedure

This document outlines the complete release procedure for the Sentry MCP project. Follow these steps in order to ensure a clean, validated release.

## Table of Contents

- [Overview](#overview)
- [Pre-Release Checklist](#pre-release-checklist)
  - [1. Version Update](#1-version-update)
  - [2. Lock File Update](#2-lock-file-update)
  - [3. Documentation Updates](#3-documentation-updates)
  - [4. Build Validation](#4-build-validation)
  - [5. Linter Validation](#5-linter-validation)
  - [6. Final Code Review](#6-final-code-review)
  - [7. Git Status Check](#7-git-status-check)
- [Release Execution](#release-execution)
  - [Automated Release via GitHub Actions](#automated-release-via-github-actions)
  - [Prerequisites](#prerequisites)
  - [Release Steps](#release-steps)
  - [Monitor Release Progress](#monitor-release-progress)
  - [What GitHub Actions Does](#what-github-actions-does)
- [Post-Release Verification](#post-release-verification)
  - [1. Verify GitHub Actions Workflow](#1-verify-github-actions-workflow)
  - [2. Verify npm Package](#2-verify-npm-package)
  - [3. Smoke Test Published Package](#3-smoke-test-published-package)
  - [4. Verify GitHub Release](#4-verify-github-release)

## Overview

The Sentry MCP project uses automated CI/CD via GitHub Actions for releases:

- CI Workflow: Automatically runs linting and builds on every push and PR
- Publish Workflow: Automatically publishes to npm and creates GitHub Release when you push a version tag

Quick Release (TL;DR):
```bash
npm version patch              # Update version, create commit & tag
git push --follow-tags        # Push to GitHub → triggers automated release
```

## Pre-Release Checklist

### 1. Version Update

```bash
# Check current version
grep '"version"' package.json
```

Follow SemVer. Bump appropriately.

### 2. Lock File Update

```bash
npm install
```

### 3. Documentation Updates
- Ensure README.md and README-ru.md reflect the current toolset and configuration.

#### README TOC Verification
- Confirm that both README files include a correct Table of Contents:
  - Presence:
    ```bash
    rg -n "^## Table of Contents" README.md README-ru.md
    ```
  - Compare headers vs TOC entries:
    ```bash
    for f in README.md README-ru.md; do
      echo "== $f ==";
      echo "Headers (H2/H3):";
      rg -n "^(##|###) " "$f" | sed -E 's/^[^ ]+\s+//' | sed -E 's/^#+ //';
      echo "TOC entries:";
      rg -n "^- \\[[^\\]]+\\\\]\\(#[^)]+\\)" "$f" || true;
    done
    ```
  - If mismatches are found, update the TOC blocks before release.

### 4. Build Validation

```bash
npm run build
```

### 5. Linter Validation

```bash
npx eslint .
```

### 6. Final Code Review

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline
git grep -n "console\.log\|debugger" src/
```

### 7. Git Status Check

```bash
git status
```

## Release Execution

### Automated Release via GitHub Actions

#### Prerequisites
- NPM_TOKEN secret configured

#### Release Steps
```bash
npm version patch   # or minor/major
git push --follow-tags
```

### Monitor Release Progress
- Check Actions → Workflows

### What GitHub Actions Does
- Runs lint and build
- Publishes to npm with provenance
- Creates GitHub Release

## Post-Release Verification

### 1. Verify GitHub Actions Workflow
- Ensure the latest workflow run succeeded

### 2. Verify npm Package
```bash
npm view @vitalyostanin/sentry-mcp version
```

### 3. Smoke Test Published Package
```bash
npx @vitalyostanin/sentry-mcp@latest 2>&1 | head -5
```

### 4. Verify GitHub Release
- Check latest GitHub release page
