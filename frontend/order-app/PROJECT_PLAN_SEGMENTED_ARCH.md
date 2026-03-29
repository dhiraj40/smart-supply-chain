# Smart Supply Chain Frontend: Segmented Architecture Plan

## Verdict

Yes, your approach is valid and scalable.

It is especially strong for teams that want:

- predictable layering
- environment-aware data access
- separation between backend contracts and UI
- explicit state ownership

This plan keeps your model and adds guardrails so debugging stays practical.

## Your Model (Accepted)

You defined three segments on a data-to-UI line:

1. Infrastructure segment:
   - auth logic
   - environment selection
   - API clients
   - repositories
2. Orchestration segment:
   - data mapping and transformation
   - state management
   - filter and business flow logic
3. Presentation segment:
   - UI pages/components
   - usecase execution from user interaction

Communication between adjacent segments should happen through explicit interfaces.

## Recommended Guardrails

Use your structure with these non-negotiable rules:

1. Presentation must not call Infrastructure directly.
2. Presentation only talks to Orchestration interfaces.
3. Orchestration talks to Infrastructure through repository/gateway interfaces.
4. Infrastructure contains no React state logic.
5. Mapping from backend DTO to UI/domain shape must happen only in Orchestration.

These five rules preserve readability and reduce cross-layer debugging pain.

## Target Folder Structure

```text
src/
  infrastructure/
    config/
      env.js
      apiConfig.js
    auth/
      authClient.js
      authRepository.js
    api/
      httpClient.js
      errorMapper.js
    repositories/
      productRepository.js
      orderRepository.js
      index.js
    mocks/
      home.json
      products.json
      productDetail.json

  orchestration/
    contracts/
      catalogGateway.js
      cartGateway.js
      authGateway.js
    mappers/
      homeMapper.js
      productMapper.js
      orderMapper.js
    state/
      global/
        sessionProvider.jsx
        appProvider.jsx
      usecase/
        dashboardStore.js
        cartStore.js
        checkoutStore.js
      selectors/
        catalogSelectors.js
        cartSelectors.js
    logic/
      catalogService.js
      cartService.js
      checkoutService.js
      filterService.js
    interfaces/
      catalogFacade.js
      cartFacade.js
      authFacade.js

  presentation/
    pages/
      DashboardPage.jsx
      CartPage.jsx
      LoginPage.jsx
      SettingsPage.jsx
    usecases/
      useDashboardController.js
      useCartController.js
      useAuthController.js
    components/
      catalog/
      cart/
      common/
      layout/

  shared/
    constants/
    utils/
    types/
```

## Interface Contracts

Define narrow interfaces between segments.

### Infrastructure -> Orchestration contract example

```ts
type ProductRepository = {
  getHomeLayout(): Promise<HomeLayoutDto>
  getProducts(params: { category: string; page: number }): Promise<ProductListDto>
  getProductBySlug(slug: string): Promise<ProductDetailDto>
}
```

### Orchestration -> Presentation contract example

```ts
type CatalogFacade = {
  loadDashboard(): Promise<DashboardVm>
  loadProducts(params: ProductQuery): Promise<ProductListVm>
  loadProductDetail(slug: string): Promise<ProductDetailVm>
}
```

Presentation only consumes view models and action functions.

## State Management Plan

Use your three-level state strategy exactly as described:

1. Global level:
   - session/auth state
   - shared app flags
   - environment/runtime configuration
2. Usecase level:
   - dashboard data state
   - cart workflow state
   - checkout request state
3. Component level:
   - field input values
   - dropdown open/close
   - temporary UI-only toggles

## Refresh Minimization Rules

To reduce re-renders and make debugging easier:

1. Split providers by concern, never one giant provider.
2. Keep async request status in usecase-level stores, not global.
3. Use selectors to read minimal state slices.
4. Store normalized entities where list size is large.
5. Keep derived values in selectors, not inline inside JSX trees.

## Debuggability Standards

Your architecture becomes easy to debug if these are enforced:

1. Infrastructure logs request id, endpoint, status, and environment.
2. Orchestration logs major actions:
   - `DASHBOARD_LOAD_STARTED`
   - `DASHBOARD_LOAD_SUCCEEDED`
   - `DASHBOARD_LOAD_FAILED`
3. Presentation shows clear fallback UI:
   - loading
   - empty
   - error
4. Every mapper has unit tests for DTO changes.
5. Facades have integration tests with mocked repositories.

## Environment Strategy

Infrastructure owns environment switching:

- development:
  - use mock repositories by default
- staging/production:
  - use API repositories

Orchestration and Presentation must not know whether data came from mock or API.

## Migration Plan

### Phase 1: Contracts First

- define segment interfaces
- freeze DTO-to-VM mapping boundaries
- introduce facade layer in Orchestration

### Phase 2: Infrastructure Consolidation

- centralize API clients and repositories
- centralize env-aware repo selection
- add request/error normalization

### Phase 3: Orchestration Consolidation

- move mapping and transformations into Orchestration mappers
- implement usecase-level stores
- implement selectors for read paths

### Phase 4: Presentation Simplification

- convert pages to consume only Orchestration facades/controllers
- remove direct data transformation from components
- standardize loading/empty/error UI

### Phase 5: Observability

- add action-level logs in Orchestration
- add request diagnostics in Infrastructure
- add targeted tests for contract stability

## Definition of Done

The architecture is considered correct when:

1. No Presentation component imports Infrastructure files.
2. All backend DTO handling occurs in Orchestration.
3. Environment switching is isolated to Infrastructure.
4. UI reads state via selectors/facades only.
5. Feature debugging can be done by tracing:
   - Infrastructure request log -> Orchestration action log -> Presentation rendered state.

## AI Implementation Prompt

```md
Refactor this frontend to a segmented architecture with three segments:

- Infrastructure: auth + API + environment + repositories
- Orchestration: mapping + state + transformations + facades
- Presentation: pages + UI components + controllers

Rules:
- Presentation must not import Infrastructure directly.
- Segment communication only through explicit interfaces.
- Use 3-level state ownership: Global > Usecase > Component.
- Keep DTO mapping in Orchestration only.
- Add clear loading/empty/error handling in Presentation.
- Keep environment-aware repository switching in Infrastructure.

Deliverables:
- folder structure matching PROJECT_PLAN_SEGMENTED_ARCH.md
- segment interfaces and facades
- state slices by level
- tests for mappers and facades
- no business/data transformation logic in page components
```

## Final Note

This is a good approach. The key success factor is not adding more layers, but enforcing strict boundaries and clear ownership per segment.
