# AGENTS.md — Frontend

## 1. Project Description

This project is the frontend of a personal financial control system, focused on forecasting expenses and revenues.

The frontend communicates with a NestJS API and must preserve all financial behavior defined by the backend.

## 2. Technology Stack

- Vue 3
- Quasar Framework
- TypeScript
- Axios
- Vue Router
- Composition API
- Pinia only when shared state is clearly needed

## 3. Main Goal for Codex

Codex should help with frontend development tasks such as:

- creating services
- creating models and types
- splitting large pages into components
- extracting reusable logic into composables
- improving layouts using Quasar components
- creating CRUD screens
- connecting pages to API endpoints
- refactoring without changing behavior
- improving code consistency

Codex must prioritize maintainability, readability, and consistency with the existing project patterns.

## 4. Project Structure

Frontend modules should follow this structure:

```text
src/modules/<module-name>/
  |-- components
  |-- composables
  |-- mappers
  |-- models
  |-- pages
  |-- services
  |-- types
  <module-name>.routes.ts
```

Example:

```text
src/modules/schedules/
  |-- components
  |-- composables
  |-- mappers
  |-- models
  |-- pages
  |-- services
  |-- types
  schedules.routes.ts
```

Use shared resources only when they are truly reusable across modules:

```text
src/shared/
  |-- components
  |-- composables
  |-- models
  |-- services
  |-- types
  |-- utils
```

## 5. Language Rules

- Code, folders, files, components, variables, functions, services, models, and types must be written in English.
- User-facing labels may be written in Portuguese.
- Comments should be avoided unless they explain business rules or non-obvious decisions.
- Do not mix Portuguese and English in code identifiers.

Good:

```ts
const bankAccountOptions = ref<SelectOption[]>([]);
```

Bad:

```ts
const opcoesContaBancaria = ref<any[]>([]);
```

## 6. Vue and Quasar Standards

Use Vue 3 with Composition API and `<script setup lang="ts">`.

Prefer Quasar native components:

- `q-page`
- `q-card`
- `q-table`
- `q-form`
- `q-input`
- `q-select`
- `q-btn`
- `q-dialog`
- `q-chip`
- `q-toggle`
- `q-btn-toggle`

Avoid unnecessary external UI libraries.

## 7. Page Responsibility

Pages should orchestrate the screen only.

A page may:

- load data
- call composables
- control dialogs
- handle navigation
- connect components

A page should not contain too much business logic, mapping logic, or repeated UI blocks.

If a page becomes large, split it into:

- components
- composables
- services
- mappers

## 8. Component Rules

Create components when:

- a UI block is reused
- a section is visually complex
- a dialog has its own logic
- a table toolbar grows too much
- a form becomes too large
- the page is hard to read

Components should receive data through props and emit actions.

Avoid direct API calls inside presentational components.

Example component names:

```text
BankAccountForm.vue
BankAccountTable.vue
BankAccountStatusChip.vue
CategoryForecastSummary.vue
ScheduleRecurrenceFields.vue
ConfirmDeleteDialog.vue
```

## 9. Composable Rules

Use composables for reusable or page-specific logic.

Good examples:

```text
useBankAccounts.ts
useBankAccountForm.ts
useBankOptions.ts
useCategoryOptions.ts
useScheduleForm.ts
useConfirmDialog.ts
```

A composable may handle:

- loading state
- API calls
- form state
- select options
- pagination
- filters
- dialog state
- validation helpers

Keep composables focused. Do not create one large composable for an entire module if smaller composables are clearer.

## 10. Service Rules

Services are responsible for HTTP communication only.

Services must not contain UI logic, Quasar Notify, router navigation, or component state.

Example:

```ts
export class BankAccountService {
  async findAll(): Promise<BankAccount[]> {
    const response = await http.get<ApiResponse<BankAccount[]>>(
      '/bank-accounts'
    );
    return response.data.data;
  }
}
```

Use the existing shared HTTP client.

Do not create a new Axios instance unless explicitly requested.

## 11. API Response Pattern

The API usually returns:

```ts
{
  success: boolean;
  data: T;
  message: string;
}
```

Frontend services should usually return `response.data.data`.

Do not duplicate global error handling already handled by Axios interceptors.

## 12. Models and Types

Use models/types to represent frontend data structures.

Prefer explicit types over `any`.

Avoid `any` unless there is no safe alternative.

Example:

```ts
export interface BankAccount {
  id: string;
  bank: string;
  accountType: string;
  name: string;
  balance: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

Create DTOs when the create/update payload differs from the returned entity.

Example:

```ts
export interface CreateBankAccountPayload {
  bank: string;
  accountType: string;
  name: string;
  balance: number;
}
```

## 13. Mapper Rules

Use mappers when API data differs from UI data.

Examples:

- API entity to table row
- API domain to select option
- form state to create/update payload

Do not put mapping logic directly in Vue templates.

## 14. Select Options

Use a shared option model when possible:

```ts
export interface SelectOption<T = string> {
  label: string;
  value: T;
}
```

Domain options should usually be loaded through composables.

Example:

```ts
const bankOptions = ref<SelectOption[]>([]);
```

Avoid calling services directly inside the template.

## 15. Routing Rules

Each module should have its own route file:

```text
bank-accounts.routes.ts
categories.routes.ts
persons.routes.ts
schedules.routes.ts
transactions.routes.ts
```

Routes should use lazy-loaded pages.

Example:

```ts
{
  path: '/bank-accounts',
  name: 'BankAccounts',
  component: () => import('./pages/BankAccountsPage.vue')
}
```

Use clear and unique route names.

## 16. Styling Rules

Follow the existing premium/intermediate visual style:

- clean white cards
- light background
- rounded corners
- soft shadows
- good spacing
- clear toolbar actions
- readable forms
- Quasar-first components

Avoid aggressive colors, heavy borders, and overly complex CSS.

Prefer module-scoped styles.

Use shared classes only when they are already part of the project pattern.

## 17. Forms

Forms should use `q-form`.

Validation should use Quasar `rules`.

Prefer explicit validation functions.

Use `validate(true)` when greedy validation is needed.

Do not submit invalid forms.

Keep form state typed.

## 18. Tables

Use `q-table` for lists.

Tables should have:

- clear columns
- loading state
- empty state when applicable
- action buttons grouped logically
- status displayed with chips or badges

Do not place complex formatting directly inside the column definition when a component or helper would be clearer.

## 19. Dialogs

Use dialogs for:

- create/edit forms when the flow is simple
- delete confirmation
- quick actions
- focused tasks

Use full pages for:

- complex flows
- multi-step forms
- screens with many sections
- screens requiring deep navigation

Reusable dialogs should be placed in `shared/components` or the module `components` folder depending on reuse.

## 20. Pinia Rules

Do not introduce Pinia by default.

Use Pinia only when data is reused across multiple screens or modules, such as:

- domains
- banks
- categories
- persons
- user preferences

Avoid using Pinia for local page state.

## 21. Financial Domain Rules

Financial calculations are sensitive.

Do not change:

- financial formulas
- rounding behavior
- balance calculations
- installment calculations
- recurrence calculations
- transaction linking logic

unless explicitly requested.

When modifying financial logic:

- explain the impact
- review edge cases
- preserve existing behavior
- update or create tests when applicable

## 22. Business Concepts

Schedules represent future planned entries.

Transactions represent actual financial movements.

A Schedule does not necessarily generate a Transaction.

A Transaction may be created manually by the user.

When a schedule item is completed, a Transaction may be linked to that Schedule.

Do not assume all Transactions originate from Schedules.

## 23. Current Business Modules

The frontend may interact with the following API modules:

- Domains
- Bank Accounts
- Credit Cards
- Persons
- Categories
- Schedules
- Transactions

## 24. Domain Module

Domains are used for fixed or semi-fixed lists, such as:

- Account Types
- Banks
- Credit Card Brands

Domain items usually have:

```ts
{
  id: string;
  code: string;
  name: string;
}
```

Use domains to populate selects and filters.

## 25. Bank Accounts Module

Bank accounts represent user bank accounts.

Common fields:

```ts
{
  id: string;
  bank: string;
  accountType: string;
  name: string;
  balance: number;
  active: boolean;
}
```

Bank and account type should usually be selected from domain options.

## 26. Credit Cards Module

Credit cards represent user credit cards.

Common fields:

```ts
{
  id: string;
  bank: string;
  brand: string;
  name: string;
  digits: number;
  description: string;
  limit: number;
  active: boolean;
}
```

Digits should represent only the last 4 digits.

## 27. Persons Module

Persons represent people linked to expenses or revenues.

Common fields:

```ts
{
  id: string;
  name: string;
  nickName: string;
  description: string;
  active: boolean;
}
```

Persons may be used in schedules and transactions.

## 28. Categories Module

Categories classify expenses and revenues.

Common fields:

```ts
{
  id: string
  name: string
  type: string
  financialType: string
  parentId: string | null
  forecast: number
  tags: string[]
  active: boolean
}
```

Rules:

- categories may have subcategories
- tags belong mainly to parent categories
- categories may be expense or income
- forecast values are financially sensitive

## 29. Schedules Module

Schedules represent planned future entries.

Common fields:

```ts
{
  id: string
  type: string
  description: string
  recurrence: string
  startingOn: string
  amount: number
  bankAccount: string
  category: string
  tag: string
  person: string
  installment?: {
    installment: number
    startDate: string
  }
  active: boolean
}
```

Recurrence logic must be preserved.

## 30. Transactions Module

Transactions represent actual financial movements.

Common fields:

```ts
{
  id: string;
  person: string;
  type: string;
  sourceType: string;
  sourceId: string;
  destinationType: string;
  destinationId: string;
  tag: string;
  transactionDate: string;
  dueDate: string;
  paymentDate: string;
  status: string;
  description: string;
  installment: number;
  amount: number;
}
```

Transactions may or may not be linked to schedules.

## 31. Refactoring Rules

When refactoring:

- preserve behavior
- avoid unnecessary rewrites
- keep the public API of components stable when possible
- improve readability
- remove duplication
- keep changes small and reviewable

Do not rename files, routes, or models unless necessary.

## 32. Codex Task Style

When implementing a task, Codex should:

1. inspect the existing module pattern
2. follow the closest existing implementation
3. create only necessary files
4. avoid overengineering
5. keep code typed
6. avoid changing unrelated files
7. explain important decisions briefly

## 33. Preferred Output for Codex

For each task, Codex should summarize:

- what was created or changed
- files changed
- any assumptions made
- anything that should be reviewed manually

## 34. Safety Rules

Do not remove existing business rules.

Do not change financial calculations without explicit instruction.

Do not introduce new dependencies without asking.

Do not create global state unless clearly justified.

Do not change API contracts unless explicitly requested.

Do not silently ignore TypeScript or ESLint errors.

## 35. Testing and Validation

When possible, after changes:

```bash
npm run lint
npm run typecheck
npm run test
```

If these scripts do not exist, do not invent them. Mention that they were not found.

## 36. Code Quality

Prefer:

- small functions
- typed parameters
- clear names
- reusable components
- composables for logic
- services for API access
- mappers for transformations

Avoid:

- large Vue files
- duplicated API calls
- `any`
- business logic in templates
- hardcoded domain values
- direct Axios calls inside components
- unnecessary dependencies

## 37. Final Instruction

When in doubt, Codex must follow the existing project pattern instead of creating a new architecture.
