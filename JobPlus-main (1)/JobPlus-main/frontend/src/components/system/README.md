# JobPlus System Components

This directory contains the core UI components that follow the **Precision Dark** design system as specified in the JobPlus Master Development Plan.

## Design System Overview

The Precision Dark design system is characterized by:

- **Dark-first aesthetic** with #0A0A0F as the base color
- **Brand colors**: #6C63FF (primary indigo-violet) and #00D4AA (teal accent)
- **Glassmorphism effects** with backdrop blur and subtle borders
- **Smooth animations** using Framer Motion
- **Typography**: Syne for headings, DM Sans for body text
- **8px grid spacing system**

## Available Components

### Button

Multi-variant button component with loading states and hover effects.

```tsx
import { Button } from '@/components/system';

<Button variant="primary" size="md" loading={false} fullWidth={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean

### Card

Versatile card component with glassmorphism support and hover effects.

```tsx
import { Card } from '@/components/system';

<Card glass={true} hover={true} onClick={handleClick}>
  Card content
</Card>
```

**Props:**
- `glass`: boolean - enables glassmorphism effect
- `hover`: boolean - enables hover lift effect
- `onClick`: function - makes card clickable

### Input

Styled input component with label and error states.

```tsx
import { Input } from '@/components/system';

<Input
  label="Email"
  type="email"
  error={errorMessage}
  size="md"
  fullWidth={true}
  placeholder="Enter your email"
/>
```

**Props:**
- `label`: string
- `error`: string
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean

### Badge

Status badge component with multiple variants and pulse animation.

```tsx
import { Badge } from '@/components/system';

<Badge variant="success" size="md" pulse={true}>
  Active
</Badge>
```

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand'
- `size`: 'sm' | 'md' | 'lg'
- `pulse`: boolean

### Avatar

User avatar component with status indicators.

```tsx
import { Avatar } from '@/components/system';

<Avatar
  src={user.avatar}
  alt={user.name}
  size="lg"
  status="online"
  onClick={handleClick}
/>
```

**Props:**
- `src`: string - image URL
- `alt`: string - alt text or initial
- `size`: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `status`: 'online' | 'offline' | 'busy' | 'away'
- `onClick`: function

### Modal

Glassmorphism modal with backdrop blur and animations.

```tsx
import { Modal } from '@/components/system';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="lg"
>
  Modal content
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean

### Skeleton

Loading skeleton component with multiple variants.

```tsx
import { Skeleton } from '@/components/system';

<Skeleton variant="text" width="100%" height={20} animation="wave" />
```

**Props:**
- `variant`: 'text' | 'circular' | 'rectangular'
- `width`: string | number
- `height`: string | number
- `animation`: 'pulse' | 'wave' | 'none'

### Toast

Notification toast component with multiple types.

```tsx
import { Toast, ToastContainer } from '@/components/system';

<ToastContainer toasts={toasts} onClose={handleCloseToast} />
```

**Props:**
- `type`: 'success' | 'error' | 'warning' | 'info'
- `title`: string
- `message`: string
- `duration`: number (default: 5000ms)

## Usage Guidelines

1. **Always use these components** instead of creating custom UI elements
2. **Follow the design system** for colors, spacing, and typography
3. **Use glassmorphism sparingly** - only for modals and featured content
4. **Implement loading states** using the Skeleton component
5. **Use appropriate variants** for different contexts (success, warning, etc.)

## Animation System

All components use the following animation timing:
- `--ease-standard`: cubic-bezier(0.4, 0, 0.2, 1)
- `--duration-fast`: 140ms
- `--duration-base`: 220ms
- `--duration-slow`: 320ms

## Color Palette

```css
--bg-base: #0A0A0F;
--bg-surface: #111118;
--bg-elevated: #1A1A24;
--brand-primary: #6C63FF;
--brand-secondary: #00D4AA;
--text-primary: #F0F0FF;
--text-secondary: #8888AA;
```

## Future Enhancements

- [ ] Add more button variants (link, icon-only)
- [ ] Implement form validation components
- [ ] Add data visualization components
- [ ] Create layout components (Grid, Stack, etc.)
- [ ] Add progress indicators
- [ ] Implement dropdown and select components
