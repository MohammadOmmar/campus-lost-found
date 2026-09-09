# User Stories — Campus Lost & Found

## Story Format

Each story follows the format: **As a** [role], **I want to** [action], **so that** [benefit].

---

## Authentication & Profile

### US-01: User Registration
**As a** student, **I want to** create an account with my email and password, **so that** I can report items and submit claims.

**Acceptance Criteria:**
- Registration form requires email, password, and full name
- Password must be at least 8 characters
- Email must be valid format
- User receives confirmation email after registration
- After email confirmation, user is redirected to dashboard

### US-02: User Login
**As a** registered user, **I want to** log in with my credentials, **so that** I can access my account.

**Acceptance Criteria:**
- Login form accepts email and password
- Invalid credentials show clear error message
- Successful login redirects to dashboard
- Session persists across page refreshes

### US-03: Google OAuth Login
**As a** student, **I want to** log in with my Google account, **so that** I can access the app quickly without creating a new password.

**Acceptance Criteria:**
- "Continue with Google" button on login page
- Redirects to Google OAuth consent screen
- On success, creates account if new or logs in if existing
- Redirects to dashboard after authentication

### US-04: Password Reset
**As a** user who forgot their password, **I want to** reset it via email, **so that** I can regain access to my account.

**Acceptance Criteria:**
- "Forgot password" link on login page
- User enters email and receives reset link
- Reset link expires after 1 hour
- New password is saved and user can log in

---

## Lost & Found Items

### US-05: Report Lost Item
**As a** student who lost something, **I want to** report it with details and a photo, **so that** others can help find it.

**Acceptance Criteria:**
- Form includes: title, description, category, location, date lost, photo
- All fields except photo are required
- Photo is optional but recommended
- After submission, item appears in browse listing
- User sees success confirmation

### US-06: Report Found Item
**As a** student who found something, **I want to** report it with details and a photo, **so that** the owner can claim it.

**Acceptance Criteria:**
- Form includes: title, description, category, location, date found, photo
- All fields except photo are required
- After submission, item appears in browse listing
- User sees success confirmation

### US-07: Browse Items
**As a** user, **I want to** browse all reported items, **so that** I can find matches for my lost or found items.

**Acceptance Criteria:**
- Items displayed in a responsive grid
- Each item shows: photo, title, category, type badge, location, date
- Items sorted by most recent first
- Pagination or infinite scroll for large lists

### US-08: Search Items
**As a** user, **I want to** search items by keyword, **so that** I can quickly find specific items.

**Acceptance Criteria:**
- Search input on the browse page
- Searches across title, description, and location
- Results update as user types (debounced)
- Clear search returns full listing

### US-09: Filter Items
**As a** user, **I want to** filter items by type, category, and status, **so that** I can narrow down results.

**Acceptance Criteria:**
- Filter controls for: type (lost/found), category, status
- Multiple filters can be combined
- Active filters are visually indicated
- Clear all filters option available

### US-10: View Item Detail
**As a** user, **I want to** view full details of an item, **so that** I can determine if it matches something I lost or found.

**Acceptance Criteria:**
- Detail page shows all item information
- Large photo display
- Reporter's name and avatar shown
- Claim button visible (if item is found and user is not the reporter)
- Claims list visible (if user is the reporter)

### US-11: Edit Item
**As a** user who reported an item, **I want to** edit its details, **so that** I can correct mistakes or update information.

**Acceptance Criteria:**
- Edit button visible only to item owner
- Form pre-filled with current values
- Changes saved on submission
- Cannot change item type (lost/found) after creation

### US-12: Delete Item
**As a** user who reported an item, **I want to** delete it, **so that** I can remove items that are no longer relevant.

**Acceptance Criteria:**
- Delete button visible only to item owner
- Confirmation dialog before deletion
- Associated claims are also removed
- Success message after deletion
