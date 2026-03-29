# Smart Supply Chain Order App: Clean Architecture Implementation Plan

## Objective

Use this document as the source of truth for generating the full frontend codebase for the `order-app` project. The goal is to evolve the current React application into a maintainable, testable frontend that follows clean architecture principles.

Primary outcomes:

- Preserve the current business flows: login, session restore, dashboard item listing, add/remove cart items, checkout, logout.
- Refactor the code into clear layers with dependency direction pointing inward.
- Separate domain rules from React components and framework details.
- Keep development mocks available while supporting real backend integration.
- Make the project easy for AI or human contributors to extend safely.

## Current Project Snapshot

Repository type:

- React app created with Create React App
- React `19.x`
- `react-bootstrap` and Bootstrap for UI
- No router yet
- Minimal test coverage
- Development uses mock auth and mock item data

Current notable files:

- `src/App.js`: owns page navigation, cart state, checkout logic, and layout composition
- `src/auth/AuthProvider.js`: owns auth state, login, logout, session restore
- `src/api/client.js`: low-level fetch client
- `src/features/Dashboard.jsx`: loads items from mock data or API
- `src/features/Cart.jsx`: renders cart and checkout summary
- `src/features/Login.jsx`: login form
- `src/mocks/items.json`: development item catalog

Current pain points:

- Business rules live inside React components
- Auth, cart, checkout, and data fetching concerns are coupled to UI
- No clear separation between domain logic, application logic, and infrastructure
- API contracts are implicit
- Test suite is mostly placeholder code
- Feature boundaries are weak

## Business Scope To Preserve

The generated solution must support these flows:

1. User opens the app.
2. App restores existing auth session from local storage if token exists.
3. If unauthenticated, show login screen.
4. On login:
   - In development, allow mock login
   - In non-development, call backend login endpoint
5. Authenticated user sees shell layout with sidebar/topbar/footer.
6. Dashboard loads catalog items:
   - In development, use local mock catalog
   - In non-development, fetch items from backend
7. User adds items to cart from the dashboard.
8. Cart supports:
   - increase quantity
   - decrease quantity
   - remove line
   - clear cart
   - show subtotal and total quantity
9. Checkout:
   - build an order payload
   - in development, simulate order creation
   - in non-development, post order to backend
   - show success or error feedback
   - clear cart after successful submission
10. Settings page supports logout.

## Clean Architecture Principles To Enforce

The implementation must follow these rules:

- Domain layer contains pure business rules and entities only.
- Application layer contains use cases and interfaces/ports.
- Infrastructure layer contains API, storage, mock providers, and adapters.
- Presentation layer contains React pages, components, hooks, view models, and state wiring.
- Inner layers must not import outer layers.
- React components must not contain core business logic.
- Use cases must be framework-agnostic and testable without React.
- Side effects must happen through injected dependencies.

Dependency direction:

`presentation -> application -> domain`

`infrastructure -> application + domain`

The domain layer must never import React, browser APIs, fetch, Bootstrap, or local storage.

## Recommended Target Folder Structure

```text
src/
  app/
    App.jsx
    providers/
      AppProviders.jsx
    routes/
      AppRouter.jsx
    bootstrap/
      container.js

  domain/
    entities/
      Item.js
      CartItem.js
      Order.js
      Session.js
    value-objects/
      Money.js
    services/
      CartCalculator.js
      OrderFactory.js
    errors/
      DomainError.js

  application/
    ports/
      ItemRepository.js
      AuthRepository.js
      OrderRepository.js
      SessionStorage.js
      Clock.js
      IdGenerator.js
    use-cases/
      auth/
        RestoreSession.js
        LoginUser.js
        LogoutUser.js
      catalog/
        GetCatalogItems.js
      cart/
        AddItemToCart.js
        DecreaseCartItem.js
        RemoveCartItem.js
        ClearCart.js
        GetCartSummary.js
      checkout/
        CreateOrderDraft.js
        SubmitOrder.js

  infrastructure/
    api/
      httpClient.js
      apiConfig.js
      mappers/
        itemMapper.js
        orderMapper.js
        authMapper.js
      repositories/
        ApiItemRepository.js
        ApiAuthRepository.js
        ApiOrderRepository.js
    storage/
      BrowserSessionStorage.js
    mocks/
      data/
        items.json
      repositories/
        MockItemRepository.js
        MockAuthRepository.js
        MockOrderRepository.js
    system/
      BrowserClock.js
      TimestampIdGenerator.js

  presentation/
    layouts/
      AppLayout.jsx
    pages/
      LoginPage.jsx
      DashboardPage.jsx
      CartPage.jsx
      SettingsPage.jsx
    features/
      auth/
        hooks/
        components/
        view-models/
      catalog/
        hooks/
        components/
        view-models/
      cart/
        hooks/
        components/
        view-models/
      checkout/
        hooks/
        components/
        view-models/
      navigation/
        hooks/
        state/
    components/
      ui/
      feedback/
      navigation/

  shared/
    constants/
    utils/
    types/
```

Notes:

- If keeping `.jsx` across the app is easier, stay consistent.
- Existing `components/ui` and `components/layout` can be migrated into `presentation`.
- Existing `mocks/items.json` should move under `infrastructure/mocks/data`.

## Domain Model

### Entities

#### Item

Represents a product/orderable inventory unit.

Fields:

- `id`
- `name`
- `description`
- `unitPrice`
- `imageUrl`

Rules:

- `id` must be stable
- `name` is required
- `unitPrice` must be zero or positive

#### CartItem

Represents an item and its ordered quantity.

Fields:

- `item`
- `quantity`

Rules:

- quantity must be an integer greater than zero
- line total = `item.unitPrice * quantity`

#### Order

Represents a checkout payload or created order.

Fields:

- `id` optional before submission
- `createdAt`
- `items`
- `totalAmount`
- `status`

Rules:

- order must contain at least one item
- total amount equals sum of line totals

#### Session

Represents authenticated user session state.

Fields:

- `accessToken`
- `isAuthenticated`

Rules:

- authenticated session requires a token

### Value Objects

#### Money

Use a simple value object or utility to normalize currency arithmetic and formatting. If avoiding overengineering, keep values as numbers but centralize calculations and formatting.

### Domain Services

#### CartCalculator

Responsibilities:

- compute subtotal
- compute total quantity
- compute line totals
- validate cart state

#### OrderFactory

Responsibilities:

- convert cart items into order draft
- derive totals
- assign timestamp

## Application Layer

The application layer coordinates business workflows and depends only on domain abstractions and ports.

### Ports

#### AuthRepository

Methods:

- `login({ username, password })`
- `logout()`

#### ItemRepository

Methods:

- `getAll()`

#### OrderRepository

Methods:

- `submit(orderDraft)`

#### SessionStorage

Methods:

- `getToken()`
- `setToken(token)`
- `clearToken()`

#### Clock

Methods:

- `nowIso()`

#### IdGenerator

Methods:

- `generateOrderId()`

### Use Cases

#### RestoreSession

Input:

- none

Output:

- authenticated or guest session state

Logic:

- read token from storage
- return session model

#### LoginUser

Input:

- username
- password

Dependencies:

- `AuthRepository`
- `SessionStorage`

Logic:

- authenticate with repository
- persist token
- return session

#### LogoutUser

Dependencies:

- `SessionStorage`
- optional `AuthRepository`

Logic:

- clear persisted token
- perform remote logout only if required later

#### GetCatalogItems

Dependencies:

- `ItemRepository`

Logic:

- fetch items
- map to domain entities

#### AddItemToCart

Input:

- current cart
- selected item

Output:

- updated cart

Logic:

- if item exists, increment quantity
- else append new cart line with quantity 1

#### DecreaseCartItem

Logic:

- if quantity is 1, remove item
- otherwise decrement quantity

#### RemoveCartItem

Logic:

- remove matching line by item id

#### ClearCart

Logic:

- return empty cart

#### GetCartSummary

Output:

- total quantity
- subtotal
- item quantity lookup map if needed by UI

#### CreateOrderDraft

Dependencies:

- `Clock`
- domain services

Logic:

- validate cart is not empty
- generate order draft from cart lines

#### SubmitOrder

Dependencies:

- `OrderRepository`
- `CreateOrderDraft`

Logic:

- create order draft
- submit it
- return created order result

## Infrastructure Layer

This layer provides concrete adapters for application ports.

### API Infrastructure

#### `httpClient`

Responsibilities:

- wrap `fetch`
- apply base URL
- serialize JSON
- attach auth header
- normalize errors
- handle `204`

Important:

- remove forced page reload from low-level client
- surface unauthorized errors to the presentation/application boundary

#### API repositories

- `ApiAuthRepository`: calls `/login`
- `ApiItemRepository`: calls `/items`
- `ApiOrderRepository`: calls `/orders`

Each repository should:

- call `httpClient`
- map DTOs to domain-friendly shapes
- avoid leaking transport-level response formats upward

### Mock Infrastructure

Required for development:

- `MockAuthRepository`
- `MockItemRepository`
- `MockOrderRepository`

Behavior:

- mock auth returns a stable dev token
- mock item repository returns local JSON catalog
- mock order repository simulates a short delay and returns a created order object

### Browser Storage Infrastructure

`BrowserSessionStorage` wraps local storage and hides raw key usage from the rest of the app.

Suggested storage constants:

- `AUTH_TOKEN_KEY`

## Presentation Layer

Presentation is responsible for rendering and UI state orchestration only.

### App Shell

The shell should own:

- provider composition
- navigation state or routing
- dependency container initialization

Avoid placing business rules in `App`.

### Suggested Presentation Responsibilities

#### Auth feature

- login form state
- loading and error display
- current auth session exposure

#### Catalog feature

- load items on page entry
- loading and error states
- render item cards

#### Cart feature

- display cart lines and summary
- invoke add/decrease/remove/clear use cases

#### Checkout feature

- submit checkout
- show success/error banners
- disable submit while request is in progress

#### Navigation feature

- route or tab state for dashboard/cart/settings
- cart badge count

### State Strategy

Recommended approach:

- use React Context only for cross-cutting app state such as session and service container
- keep feature state close to feature hooks
- use reducers for cart state if state transitions grow

For this project, a pragmatic pattern is:

- `useAuthController`
- `useCatalogController`
- `useCartController`
- `useCheckoutController`

These controller hooks call application use cases and expose UI-friendly state.

## Container / Dependency Injection

Create a small composition root in `src/app/bootstrap/container.js`.

Responsibilities:

- choose mock vs API repositories based on environment
- instantiate infrastructure adapters
- inject adapters into use cases
- export a service container for presentation layer use

Example container contents:

- repositories
- session storage adapter
- auth use cases
- catalog use cases
- cart use cases
- checkout use cases

Do not instantiate repositories directly inside React components.

## Data Contracts

### Login request

```json
{
  "username": "string",
  "password": "string"
}
```

### Login response

```json
{
  "access_token": "string"
}
```

### Item DTO

```json
{
  "item_id": 1,
  "name": "Wireless Barcode Scanner",
  "description": "Portable scanner for fast warehouse inventory updates.",
  "unit_price": 89.99,
  "pic_url": "https://..."
}
```

### Order submission payload

```json
{
  "order_date": "ISO-8601 timestamp",
  "total_amount": 89.99,
  "items": [
    {
      "item_id": 1,
      "name": "Wireless Barcode Scanner",
      "quantity": 1,
      "unit_price": 89.99,
      "line_total": 89.99
    }
  ]
}
```

### Order response

Expected flexible shape:

```json
{
  "order_id": "string",
  "status": "created"
}
```

The generated code should isolate these DTO shapes inside infrastructure mappers.

## UI and UX Requirements

Keep the current user experience, with improvements allowed:

- login page
- dashboard with horizontally scrollable item cards
- cart page with quantity controls and checkout summary
- settings page with logout
- topbar cart badge
- loading states
- empty states
- error states
- success state after checkout

Additional expectations:

- responsive on desktop and tablet
- accessible button labels and form inputs
- avoid inline business logic in JSX
- prefer extracted presentational components when a view gets large

## Testing Strategy

Minimum required automated coverage:

### Domain tests

- cart total calculation
- add item behavior
- decrease item behavior
- remove item behavior
- order draft creation

### Application tests

- login persists token
- restore session uses storage
- catalog use case returns mapped items
- submit order calls repository with correct payload

### Presentation tests

- login form submission flow
- dashboard loads and renders items
- cart updates quantities correctly
- successful checkout clears cart and shows confirmation

Replace the placeholder CRA test with meaningful tests.

## Migration Plan

Implement in phases.

### Phase 1: Foundation

- create target folder structure
- move `App.js` to `app/App.jsx` or keep file name but reduce responsibility
- add dependency container
- create shared constants

### Phase 2: Domain Extraction

- extract item/cart/order/session entities
- extract cart and order business logic into pure modules
- add unit tests for domain

### Phase 3: Application Use Cases

- create auth, catalog, cart, and checkout use cases
- define ports/interfaces
- test use cases with mocks

### Phase 4: Infrastructure Adapters

- refactor fetch client
- implement API repositories
- implement mock repositories
- wrap local storage in adapter

### Phase 5: Presentation Refactor

- create feature hooks/controllers
- migrate login, dashboard, cart, settings pages
- keep reusable layout and UI components
- remove business logic from components

### Phase 6: Hardening

- improve error boundaries and unauthorized handling
- add loading, empty, and retry patterns where helpful
- expand tests
- clean imports and dead code

## Definition of Done

The generated code is complete only if all of the following are true:

- Project builds successfully
- Existing business flows still work
- Domain logic is extracted from React components
- API and local storage calls are isolated behind infrastructure adapters
- Mock mode works in development
- No use case depends on React or browser globals
- Tests cover critical domain and application behavior
- `App` acts mainly as composition and routing/navigation shell

## Implementation Rules For The AI Generating Code

Follow these constraints strictly:

- Use clean architecture, but stay pragmatic and do not overengineer.
- Prefer plain JavaScript unless TypeScript is explicitly introduced for the whole project.
- Keep imports one-directional by layer.
- Keep React components focused on rendering and event wiring.
- Put business calculations in pure functions or use cases.
- Use dependency injection through a composition root, not global singletons hidden in components.
- Support both development mock behavior and real API behavior.
- Preserve Bootstrap/react-bootstrap unless intentionally replacing it everywhere.
- Do not delete existing reusable UI/layout components unless replacing them with equivalent structure.
- Remove placeholder tests and add real tests.
- Keep naming consistent and intention-revealing.

## AI Task Prompt

Use the following prompt when asking an AI to generate or refactor the code:

```md
Refactor and complete this React frontend into a clean-architecture codebase.

Requirements:
- Preserve the existing user flows: login, session restore, dashboard items, cart management, checkout, logout.
- Use four layers: domain, application, infrastructure, presentation.
- Keep dependency direction inward.
- Move business rules out of React components.
- Add a composition root for dependency injection.
- Support development mocks and real API repositories.
- Keep the UI behavior equivalent to the current app.
- Replace placeholder tests with meaningful unit and integration-style tests.
- Use pragmatic clean architecture, not overengineered abstractions.

Deliverables:
- Updated folder structure
- Refactored React components/pages/hooks
- Pure domain and use-case modules
- Infrastructure adapters for API, mocks, and browser storage
- Tests for domain, application, and critical presentation flows

Reference the implementation details in PROJECT_PLAN.md and follow it as the architectural contract.
```

## Suggested Immediate Refactor Mapping

Map current files into target responsibilities roughly like this:

- current `src/App.js` -> app shell + navigation controller + container usage
- current `src/auth/AuthProvider.js` -> presentation auth provider plus application auth use cases
- current `src/api/client.js` -> infrastructure `httpClient`
- current `src/features/Dashboard.jsx` -> dashboard page/controller + `GetCatalogItems`
- current `src/features/Items.jsx` and `src/features/ItemCard.jsx` -> catalog presentation components
- current `src/features/Cart.jsx` -> cart page/components using cart and checkout use cases
- current `src/features/Login.jsx` -> login page/controller
- current `src/mocks/items.json` -> infrastructure mock data

## Known Risks and Decisions

- There is no router today. It is acceptable to keep tab-based navigation first and introduce React Router later if desired.
- The current API base URL is hardcoded. Move it to config.
- Unauthorized handling should not force `window.location.reload()` inside the HTTP client.
- The current codebase is JavaScript, so introducing TypeScript is optional and should only be done if applied consistently.
- The repository already has user changes in progress, so refactors should avoid blindly overwriting unrelated edits.

## Final Guidance

If an AI is implementing from this plan, it should first stabilize architecture and tests, then refactor features incrementally. The best result is not the most abstract design; it is the one where future changes to auth, catalog, cart, and checkout can be made with minimal cross-layer coupling.
