# 🤝 Contributing to Entros

Thank you for your interest in contributing to **Entros**! We welcome contributions from developers of all skill levels. This guide will help you get started with contributing to our movie and TV show discovery platform.

---

## 📋 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [🔧 Development Workflow](#-development-workflow)
- [📝 Contribution Guidelines](#-contribution-guidelines)
- [🐛 Known Issues & Bug Reports](#-known-issues--bug-reports)
- [✨ Feature Requests & Enhancements](#-feature-requests--enhancements)
- [🎯 Good to Have Features](#-good-to-have-features)
- [🔄 Pull Request Process](#-pull-request-process)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **Git** for version control
- A **TMDb API Key** ([Register here](https://www.themoviedb.org/settings/api))

### Quick Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/entros.git
   cd entros
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/rajofearth/entros.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Environment configuration**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your TMDb API key
   echo "VITE_TMDB_API_KEY=your_api_key_here" >> .env
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

---

### Environment Variables

Create a `.env` file in the root directory:

```env
# TMDb API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Optional: Analytics
VITE_VERCEL_ANALYTICS_ID=your_analytics_id

# Development
VITE_DEV_MODE=true
```

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🔧 Development Workflow

### Branching Strategy

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add search suggestions feature"
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
git commit -m "feat(search): add real-time search suggestions"
git commit -m "fix(api): handle TMDb rate limiting properly"
git commit -m "docs: update API integration guide"
```

---

## 📝 Contribution Guidelines

### What We're Looking For

- 🐛 **Bug fixes** - Help us squash those pesky bugs
- ✨ **Feature enhancements** - Improve existing functionality
- 🆕 **New features** - Add exciting new capabilities
- 📚 **Documentation** - Improve guides and code comments
- 🎨 **UI/UX improvements** - Make the app more beautiful and usable
- ⚡ **Performance optimizations** - Speed up the application
- 🧪 **Tests** - Increase code coverage and reliability

### Code Contribution Process

1. **Check existing issues** before starting work
2. **Create an issue** for new features or significant changes
3. **Discuss the approach** before implementing
4. **Write clean, documented code**
5. **Add tests** for new functionality
6. **Update documentation** as needed
7. **Submit a pull request**

---

## 🐛 Known Issues & Bug Reports

### Current Known Issues

#### 🔴 High Priority

- **Search Performance**: Large search results can cause UI lag
  - **Impact**: Poor user experience on mobile devices
  - **Skills needed**: React optimization, virtual scrolling
  - **Difficulty**: Medium

- **API Rate Limiting**: No handling for TMDb rate limits
  - **Impact**: App crashes when API limit exceeded
  - **Skills needed**: Error handling, caching strategies
  - **Difficulty**: Medium

- **Image Loading**: Missing fallback for broken poster images
  - **Impact**: Broken UI when images fail to load
  - **Skills needed**: React, error boundaries
  - **Difficulty**: Easy

#### 🟡 Medium Priority

- **Memory Leaks**: Components not cleaning up properly
  - **Impact**: Performance degradation over time
  - **Skills needed**: React hooks, lifecycle management
  - **Difficulty**: Medium

- **Accessibility**: Missing ARIA labels and keyboard navigation
  - **Impact**: Poor accessibility for disabled users
  - **Skills needed**: Web accessibility, ARIA
  - **Difficulty**: Medium

- **Error Messages**: Generic error messages confuse users
  - **Impact**: Poor user experience when things go wrong
  - **Skills needed**: UX design, error handling
  - **Difficulty**: Easy

- **Improved PWA Support**: Missing service worker and app manifest optimizations
  - **Impact**: Poor offline experience and no app installation capability
  - **Skills needed**: Service workers, PWA standards, caching strategies
  - **Difficulty**: Medium

#### 🟢 Low Priority

- **Console Warnings**: Development console shows warnings
  - **Impact**: Cluttered development experience
  - **Skills needed**: React debugging
  - **Difficulty**: Easy

- **Bundle Size**: Large JavaScript bundle affects load time
  - **Impact**: Slower initial page load
  - **Skills needed**: Webpack optimization, code splitting
  - **Difficulty**: Hard

### How to Report Bugs

1. **Check if the bug already exists** in our [Issues](https://github.com/rajofearth/entros/issues)
2. **Use the bug report template**
3. **Provide clear reproduction steps**
4. **Include screenshots/videos** if applicable
5. **Specify browser and device information**

**Bug Report Template:**
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 91]
- Device: [e.g., iPhone 12]
- OS: [e.g., iOS 14.6]
```

---

## ✨ Feature Requests & Enhancements

### Feature Request Template

```markdown
## Feature Description
Brief description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Screenshots, mockups, etc.
```

---

## 🎯 Good to Have Features

### 🌟 User Experience Enhancements

#### **User Accounts & Preferences** :
- **Watchlist/Favorites**: Save movies and shows for later
- **User Ratings**: Allow users to rate content
- **Viewing History**: Track what users have viewed
- **Recommendations**: Personalized content suggestions

- **Dark/Light Mode Toggle** : Theme switching for user preference

- **Offline Support** : Cache popular content for offline viewing

- **Social Features**: Share favorites, write reviews, follow friends

### 🔍 Search & Discovery

#### **Advanced Filters**:
- **Cast/Crew Filter**: Search by specific actors or directors
- **Streaming Platform Filter**: Filter by Netflix, Hulu, etc.
- **Language Filter**: Filter by original language

- **Search Suggestions**: Real-time search suggestions as user types

### 📱 Mobile & Performance

#### **Native Mobile Apps (Android & iOS)**: Native mobile applications with bring-your-own-key TMDB support

#### **Virtual Scrolling**: Optimize performance for large lists

#### **Image Optimization**: Lazy loading, WebP support, responsive images

### 🎨 UI/UX Improvements

#### **Animations & Micro-interactions**:
- **Page Transitions**: Smooth transitions between pages
- **Loading Animations**: Skeleton screens, progress indicators
- **Hover Effects**: Enhanced card interactions

#### **Better Mobile Experience**:
- **Swipe Gestures**: Navigate with touch gestures
- **Pull-to-Refresh**: Refresh content with pull gesture
- **Touch Optimizations**: Better touch targets and interactions

#### **Accessibility Improvements**
- **Screen Reader Support**: Full ARIA implementation
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast Mode**: Support for visual impairments

### 🔧 Technical Improvements

#### **Testing Infrastructure**
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API and user flow tests
- **E2E Tests**: Full application testing

#### **Performance Monitoring**
- **Real User Monitoring**: Track actual user performance
- **Error Tracking**: Automatic error reporting
- **Analytics Dashboard**: Usage statistics and insights

#### **Internationalization (i18n)**
- **Multi-language Support**: Translate UI to multiple languages
- **Localization**: Format dates, numbers for different regions
- **RTL Support**: Support for right-to-left languages

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] **Code follows style guidelines**
- [ ] **Lint Satisfied & Formatted**
- [ ] **Changes are documented**
- [ ] **Commit messages follow convention**
- [ ] **Branch is up to date with main**

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

---

<div align="center">

**Thank you for contributing to Entros! 🎬✨**

[🏠 Back to README](README.md) | [📋 View Issues](https://github.com/rajofearth/entros/issues) | [💡 Discussions](https://github.com/rajofearth/entros/discussions)

</div>