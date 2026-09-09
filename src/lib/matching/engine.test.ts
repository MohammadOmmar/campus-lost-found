import { describe, it, expect } from 'vitest';
import { matchItems, isEligibleForMatching } from './engine';
import type { MatchableItem, MatchCandidate } from './types';

function makeItem(overrides: Partial<MatchableItem>): MatchableItem {
  return {
    id: 'item-1',
    type: 'LOST',
    title: 'Black wireless earbuds',
    description: 'Lost my black wireless earbuds in the library. They are in a small black case.',
    category: 'electronics',
    location: 'Library',
    date_lost_found: '2024-09-08',
    status: 'OPEN',
    campus_id: 'campus-1',
    ...overrides,
  };
}

const CAMPUS = 'campus-1';

describe('Matching Engine Tests', () => {
  describe('Strong match (>80)', () => {
    it('should score highly for nearly identical items', () => {
      const source = makeItem({
        type: 'LOST',
        title: 'Black wireless earbuds',
        category: 'electronics',
        location: 'Library',
        date_lost_found: '2024-09-08',
        description: 'Lost my black wireless earbuds in the library. They are in a small black case.',
      });

      const candidate: MatchCandidate = makeItem({
        id: 'item-2',
        type: 'FOUND',
        title: 'Black wireless earbuds',
        category: 'electronics',
        location: 'Library',
        date_lost_found: '2024-09-08',
        description: 'Found black wireless earbuds in the library near the study area.',
      });

      const result = matchItems(source, [candidate]);
      expect(result.matches.length).toBe(1);
      expect(result.matches[0].score.total).toBeGreaterThan(80);
    });
  });

  describe('Moderate match (30-60)', () => {
    it('should score moderately for related but not identical items', () => {
      const source = makeItem({
        type: 'LOST',
        title: 'Blue Nalgene water bottle',
        category: 'clothing',
        location: 'North Dormitory Block A',
        date_lost_found: '2024-09-02',
        description: 'Blue Nalgene water bottle with stickers.',
      });

      const candidate: MatchCandidate = makeItem({
        id: 'item-2',
        type: 'FOUND',
        title: 'Plain container',
        category: 'clothing',
        location: 'South Sports Complex',
        date_lost_found: '2024-09-07',
        description: 'Found a container left on a bench after practice.',
      });

      const result = matchItems(source, [candidate]);
      expect(result.matches.length).toBe(1);
      expect(result.matches[0].score.total).toBeGreaterThanOrEqual(30);
      expect(result.matches[0].score.total).toBeLessThanOrEqual(60);
    });
  });

  describe('Wrong specific categories', () => {
    it('should reject candidates with incompatible specific categories', () => {
      const source = makeItem({
        type: 'LOST',
        category: 'electronics',
        title: 'Lost laptop',
      });

      const candidate: MatchCandidate = makeItem({
        id: 'item-2',
        type: 'FOUND',
        category: 'clothing',
        title: 'Found jacket',
      });

      const result = matchItems(source, [candidate]);
      expect(result.matches.length).toBe(0);
      expect(result.allCandidates.length).toBe(0);
    });
  });

  describe('Category compatibility with "other"', () => {
    it('should NOT auto-reject when one category is "other"', () => {
      const source = makeItem({
        type: 'LOST',
        category: 'electronics',
        title: 'Lost USB-C cable',
        location: 'Library',
        date_lost_found: '2024-09-08',
      });

      const candidate: MatchCandidate = makeItem({
        id: 'item-2',
        type: 'FOUND',
        category: 'other',
        title: 'Found black cable',
        location: 'Library',
        date_lost_found: '2024-09-08',
      });

      const result = matchItems(source, [candidate]);
      expect(result.allCandidates.length).toBe(1);
      expect(isEligibleForMatching(source, candidate)).toBe(true);
    });

    it('should be compatible when both categories are "other"', () => {
      const source = makeItem({
        type: 'LOST',
        category: 'other',
        title: 'Lost something weird',
      });

      const candidate: MatchCandidate = makeItem({
        id: 'item-2',
        type: 'FOUND',
        category: 'other',
        title: 'Found something weird',
      });

      expect(isEligibleForMatching(source, candidate)).toBe(true);
    });
  });

  describe('Same item type', () => {
    it('should reject LOST vs LOST', () => {
      const source = makeItem({ type: 'LOST', id: 'source' });
      const candidate: MatchCandidate = makeItem({
        id: 'candidate',
        type: 'LOST',
        campus_id: CAMPUS,
        category: 'electronics',
      });

      const result = matchItems(source, [candidate]);
      expect(result.matches.length).toBe(0);
    });

    it('should reject FOUND vs FOUND', () => {
      const source = makeItem({ type: 'FOUND', id: 'source' });
      const candidate: MatchCandidate = makeItem({
        id: 'candidate',
        type: 'FOUND',
        campus_id: CAMPUS,
        category: 'electronics',
      });

      const result = matchItems(source, [candidate]);
      expect(result.matches.length).toBe(0);
    });
  });

    });

  describe('Distant dates', () => {
    it('should score low date proximity for items 30+ days apart', () => {
      const source = makeItem({
        type: 'LOST',
        title: 'Black wireless earbuds',
        category: 'electronics',
        location: 'Library',
        date_lost_found: '2024-09-08',
        description: 'Lost my black wireless earbuds in the library.',
      });

      const candidate: MatchCandidate = makeItem({
        id: 'item-2',
        type: 'FOUND',
        title: 'Black wireless earbuds',
        category: 'electronics',
        location: 'Library',
        date_lost_found: '2024-10-15',
        description: 'Found black wireless earbuds in the library.',
      });

      const result = matchItems(source, [candidate]);
      expect(result.matches.length).toBe(1);
      expect(result.matches[0].score.breakdown.date_proximity).toBe(0);
    });
  });

  describe('Same date', () => {
    it('should give full date proximity points for same-day items', () => {
      const source = makeItem({ type: 'LOST', date_lost_found: '2024-09-08' });
      const candidate: MatchCandidate = makeItem({
        id: 'item-2', type: 'FOUND', category: 'electronics',
        date_lost_found: '2024-09-08', location: 'Library',
        title: 'Black wireless earbuds',
        description: 'Lost my black wireless earbuds in the library.',
      });
      const result = matchItems(source, [candidate]);
      expect(result.matches[0].score.breakdown.date_proximity).toBe(20);
    });
  });

  describe('Similar titles', () => {
    it('should score highly for similar titles', () => {
      const source = makeItem({
        type: 'LOST', title: 'Black wireless earbuds', category: 'electronics',
        location: 'Library', date_lost_found: '2024-09-08',
        description: 'Lost my black wireless earbuds.',
      });
      const candidate: MatchCandidate = makeItem({
        id: 'item-2', type: 'FOUND', title: 'Black wireless earbuds', category: 'electronics',
        location: 'Library', date_lost_found: '2024-09-08',
        description: 'Found black wireless earbuds.',
      });
      const result = matchItems(source, [candidate]);
      expect(result.matches[0].score.breakdown.title_similarity).toBe(20);
    });
  });

  describe('Different titles', () => {
    it('should score low for completely different titles', () => {
      const source = makeItem({
        type: 'LOST', title: 'Black wireless earbuds', category: 'electronics',
        location: 'Library', date_lost_found: '2024-09-08',
        description: 'Lost my black wireless earbuds.',
      });
      const candidate: MatchCandidate = makeItem({
        id: 'item-2', type: 'FOUND', title: 'Red lunch box', category: 'electronics',
        location: 'Library', date_lost_found: '2024-09-08',
        description: 'Found red lunch box.',
      });
      const result = matchItems(source, [candidate]);
      expect(result.matches[0].score.breakdown.title_similarity).toBe(0);
    });
  });

  describe('Similar descriptions', () => {
    it('should score for overlapping description keywords', () => {
      const source = makeItem({
        type: 'LOST',
        description: 'Lost my black wireless earbuds with a blue case near the library.',
        title: 'Earbuds', category: 'electronics', location: 'Library', date_lost_found: '2024-09-08',
      });
      const candidate: MatchCandidate = makeItem({
        id: 'item-2', type: 'FOUND',
        description: 'Found black wireless earbuds with blue case at the library.',
        title: 'Earbuds', category: 'electronics', location: 'Library', date_lost_found: '2024-09-08',
      });
      const result = matchItems(source, [candidate]);
      expect(result.matches[0].score.breakdown.description_overlap).toBeGreaterThan(5);
    });
  });

  describe('Empty/short descriptions', () => {
    it('should handle short descriptions gracefully', () => {
      const source = makeItem({
        type: 'LOST', description: 'Lost item', title: 'Earbuds',
        category: 'electronics', location: 'Library', date_lost_found: '2024-09-08',
      });
      const candidate: MatchCandidate = makeItem({
        id: 'item-2', type: 'FOUND', description: 'Found thing', title: 'Earbuds',
        category: 'electronics', location: 'Library', date_lost_found: '2024-09-08',
      });
      const result = matchItems(source, [candidate]);
      expect(result.matches[0].score.breakdown.description_overlap).toBe(0);
    });
  });

  describe('Empty/short titles', () => {
    it('should handle very short titles gracefully', () => {
      const source = makeItem({
        type: 'LOST', title: 'ab', category: 'electronics',
        location: 'Library', date_lost_found: '2024-09-08',
        description: 'Lost my item in the library.',
      });
      const candidate: MatchCandidate = makeItem({
        id: 'item-2', type: 'FOUND', title: 'cd', category: 'electronics',
        location: 'Library', date_lost_found: '2024-09-08',
        description: 'Found an item in the library.',
      });
      const result = matchItems(source, [candidate]);
      expect(result.matches[0].score.breakdown.title_similarity).toBe(0);
    });

  describe('Boundary score around threshold', () => {
    it('should respect a custom minScore threshold', () => {
      const source = makeItem({
        type: 'LOST', title: 'Blue water bottle', category: 'clothing',
        location: 'Student Union', date_lost_found: '2024-09-05',
        description: 'Blue Nalgene water bottle with a dent on the side.',
      });
      const candidate: MatchCandidate = makeItem({
        id: 'item-2', type: 'FOUND', title: 'Blue water bottle found', category: 'clothing',
        location: 'Student Center', date_lost_found: '2024-09-06',
        description: 'Found a blue water bottle near the main entrance.',
      });
      const loose = matchItems(source, [candidate], { minScore: 0 });
      const strict = matchItems(source, [candidate], { minScore: 100 });
      expect(loose.matches.length).toBe(1);
      expect(strict.matches.length).toBe(0);
      expect(loose.matches[0].score.total).toBeGreaterThanOrEqual(30);
      expect(loose.matches[0].score.total).toBeLessThanOrEqual(80);
    });
  });

  describe('Already non-OPEN item', () => {
    it('should reject CLAIMED candidates before scoring', () => {
      const source = makeItem({ type: 'LOST' });
      const candidate: MatchCandidate = makeItem({
        id: 'item-2', type: 'FOUND', status: 'CLAIMED',
      });
      const result = matchItems(source, [candidate]);
      expect(result.matches.length).toBe(0);
      expect(result.allCandidates.length).toBe(0);
      expect(isEligibleForMatching(source, candidate)).toBe(false);
    });

    it('should reject RETURNED and CLOSED candidates before scoring', () => {
      const source = makeItem({ type: 'LOST' });
      for (const status of ['RETURNED', 'CLOSED'] as const) {
        const candidate: MatchCandidate = makeItem({
          id: `item-${status}`, type: 'FOUND', status,
        });
        const result = matchItems(source, [candidate]);
        expect(result.allCandidates.length).toBe(0);
      }
    });
  });
});