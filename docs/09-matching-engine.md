# Matching Engine — Campus Lost & Found

## Overview

Isolated deterministic scoring module that compares LOST and FOUND items to suggest potential matches.

## Module Structure

```
lib/matching/
  engine.ts          # Main entry point
  scoring.ts         # Scoring functions
  types.ts           # Type definitions
  constants.ts       # Weights and thresholds
  tests/
    scoring.test.ts  # Unit tests
```

## Scoring Formula

```
Total Score = Σ (factor_weight × factor_score) / 100

Factors:
1. Category match:      weight = 25, score = 0-100
2. Location similarity: weight = 20, score = 0-100
3. Date proximity:      weight = 20, score = 0-100
4. Title similarity:    weight = 20, score = 0-100
5. Description overlap: weight = 15, score = 0-100

Maximum score: 100
Minimum score: 0
```

## Scoring Details

### Category (weight: 25)

| Condition | Score |
|-----------|-------|
| Exact category match | 100 |
| Either category is "other" | 50 |
| Different specific categories | 0 |

If category score is 0 (different specific categories), the overall match is rejected regardless of other factors.

### Location Similarity (weight: 20)

Uses normalized Levenshtein distance on the location strings.

```
score = (1 - levenshtein(a, b) / max_length) × 100
```

### Date Proximity (weight: 20)

```
days_apart = abs(date_a - date_b)
score = max(0, 100 - days_apart × 10)
```

Score decays by 10 points per day. Items more than 10 days apart score 0 for this factor.

### Title Similarity (weight: 20)

Uses Jaccard similarity on word tokens.

```
score = (intersection(tokens_a, tokens_b) / union(tokens_a, tokens_b)) × 100
```

### Description Keyword Overlap (weight: 15)

```
common_words = intersection(filtered_words_a, filtered_words_b)
total_unique = union(filtered_words_a, filtered_words_b)
score = (common_words / total_unique) × 100
```

Common stop words are filtered out.

## Hard Requirements

| Rule | Description |
|------|-------------|
| Type constraint | Only LOST↔FOUND matches (never LOST→LOST or FOUND→FOUND) |
| Campus constraint | Must be same campus |
| Status constraint | Only OPEN items are eligible |
| Category gate | Different specific categories = automatic rejection |

## Minimum Threshold

Matches with a score below 30 are not shown to users.

## Test Cases

| Test | Input | Expected |
|------|-------|----------|
| Obvious match | Same category, same location, same day, similar title | Score > 80 |
| Weak match | Same category, different location, 5 days apart, different title | Score 30-60 |
| Wrong category | Different specific categories | Score = 0 |
| Distant dates | Same category, 30+ days apart | Date factor = 0 |
| Different campuses | Different campuses | Excluded entirely |
| LOST→LOST | Both items are LOST | Excluded entirely |
| FOUND→FOUND | Both items are FOUND | Excluded entirely |
| Either category "other" | One item is "other" | Category score = 50 |

## Integration

The matching engine is called from:
- Server Actions (when viewing an item's matches)
- Item detail page (to display match count)
- Matches page (to display full list with scores)

Example usage:
```typescript
import { findMatches } from '@/lib/matching/engine';

const matches = await findMatches(itemId);
// Returns: [{ item: Item, score: number, breakdown: ScoreBreakdown }]
```
