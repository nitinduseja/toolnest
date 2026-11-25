/**
 * Pure list reordering helpers for pinned favorite tools.
 */

export function reorderIds(ids: string[], sourceId: string, targetId: string): string[] {
  if (!sourceId || !targetId || sourceId === targetId) return ids;
  const fromIdx = ids.indexOf(sourceId);
  const toIdx = ids.indexOf(targetId);
  if (fromIdx === -1 || toIdx === -1) return ids;

  const updated = [...ids];
  const [moved] = updated.splice(fromIdx, 1);
  updated.splice(toIdx, 0, moved);
  return updated;
}

export function moveIdByStep(ids: string[], id: string, delta: -1 | 1): string[] {
  const idx = ids.indexOf(id);
  if (idx === -1) return ids;
  const nextIdx = idx + delta;
  if (nextIdx < 0 || nextIdx >= ids.length) return ids;

  const updated = [...ids];
  const [moved] = updated.splice(idx, 1);
  updated.splice(nextIdx, 0, moved);
  return updated;
}
