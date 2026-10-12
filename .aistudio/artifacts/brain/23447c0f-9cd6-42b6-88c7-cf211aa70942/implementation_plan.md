# NexusBYOK Factory Test Round 2

## User Review & Critical Decisions

> [!IMPORTANT]
> The following plan addresses the requirements from Test Round 2. Please review the strategy for database durability and AI provider testing.

- **Confirmed Decision 1**: Use Gemini and Groq as primary providers for "BUILD WITH MY AI" testing.
- **Decision 2 (Database Durability)**: Will implement safe recovery for PGlite, removing recursive deletion of `.pglite_data`. Will use a disposable test database for failure simulations.
- **Decision 3 (Test 5)**: Will mark "BUILD FOR ME" (managed provider) as BLOCKED due to lack of configuration.

## 1. Overview & Core Concept

- **Goal**: Execute comprehensive Factory testing including database safety, real provider verification, end-to-end TaskFlow application generation, and CI verification.
- **Value**: Prove the robustness, functional integrity, and reliability of the NexusBYOK Factory.

## 2. Technical Strategy

### Database Safety (Test 1)
- **Refactoring**: Modify `server/db/index.ts` to implement robust, non-destructive PGlite initialization.
- **Simulation**: Create a test script that populates a temp DB, kills the process, and verifies data integrity on restart.

### Provider Verification (Test 2)
- **Strategy**: Implement specific API calls for Gemini and Groq to confirm "LIVE VERIFIED" status.

### Factory Execution (Test 3)
- **TaskFlow Project**: Trigger the five-stage Factory pipeline (Product -> Design -> Build -> Quality -> Release).
- **Quality Verification**: Execute functional tests against the generated TaskFlow application (CRUD + Persistence).

### CI Verification (Test 7)
- **Strategy**: Configure/repair GitHub Actions to run the full suite (build, test, security) on commit.

## 3. Architecture & Data Flow

```text
┌──────────────┐      ┌─────────────────────┐
│ Factory      │ ──>  │ TaskFlow App        │
│ (5 Stages)   │      │ (React + Express +  │
└──────────────┘      │ PostgreSQL/PGlite)  │
                      └─────────────────────┘
                                 │
                                 v
                      ┌─────────────────────┐
                      │ CI / GitHub Actions │
                      └─────────────────────┘
```

## 4. Execution Plan
1. **Fix**: Implement database safety refactor.
2. **Verify**: Run provider verification tests.
3. **Execute**: Trigger Factory Stages 1-5 for TaskFlow.
4. **CI**: Implement GitHub Actions.
5. **Report**: Compile `NEXUSBYOK_FACTORY_TEST_ROUND_2.md`.
