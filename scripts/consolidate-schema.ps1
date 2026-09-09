#!/usr/bin/env pwsh
# Consolidate supabase-schema.sql: keep ONE clean claims RLS policy block.
# The existing file has:
#   - 138-152: first claims policy block (WRONG casing: 'PENDING')
#   - 153-301: items/triggers/seed
#   - 302-327: second claims policy block (CORRECT casing: 'pending')
# We keep lines 138-301 plus a corrected single claims policy block
# aligned with src/actions/claims.ts (lowercase 'pending/approved/rejected').

$src = 'supabase-schema.sql'
$lines = [System.IO.File]::ReadAllLines($src)

# ---- Build claims RLS block that matches the code (lowercase status) ----
# Reuse the structure that already exists; the correct casing is in the
# second block (lines 302-326), and the first block (138-151) matches too
# except line 149 uses UPPERCASE 'PENDING'. We rewrite the insert policy
# to lowercase and drop the duplicate block.

$insertPolicy = 'CREATE POLICY "Authenticated users can create claims" ON claims'
# The existing second-block insert policy at line 305-306:
$insertPolicyCorrect = $lines[304]  # 0-indexed 304 == line 305
$updateOwnPolicy = $lines[318]      # 0-indexed 318 == line 319 ('pending')
$updateOwnerPolicy = @(
    $lines[322], # 0-indexed 322 == line 323
    $lines[323], # FOR UPDATE USING (
    $lines[324], # auth.uid() IN (SELECT user_id FROM items WHERE items.id = claims.item_id)
    $lines[325], # );
    '',
)

$newClaimsBlock = @(
    '-- Claims: Owner and item owner only (proof is PRIVATE).',
    'CREATE POLICY "Users can view own claims" ON claims',
    '  FOR SELECT USING (auth.uid() = user_id);',
    'CREATE POLICY "Item owners can view claims on their items" ON claims',
    '  FOR SELECT USING (',
    '    auth.uid() IN (SELECT user_id FROM items WHERE items.id = claims.item_id)',
    '  );',
    'CREATE POLICY "Authenticated users can submit claims" ON claims',
    '  FOR INSERT WITH CHECK (auth.uid() = user_id);',
    'CREATE POLICY "Users can update own pending claims" ON claims',
    '  FOR UPDATE USING (auth.uid() = user_id AND status = ''pending'');',
    'CREATE POLICY "Item owners can update claim status" ON claims',
    '  FOR UPDATE USING (',
    '    auth.uid() IN (SELECT user_id FROM items WHERE items.id = claims.item_id)',
    '  );',
    '',
)

$keep = [System.Collections.Generic.List[string]]::new()
for ($i = 0; $i -lt $lines.Length; $i++) {
    $ln = $i + 1

    # Drop the first claims RLS block (138-152) and the second one (303-327).
    if (($ln -ge 138 -and $ln -le 152) -or ($ln -ge 303 -and $ln -le 327)) {
        continue
    }

    $keep.Add($lines[$i])
}

# Insert the corrected claims RLS block right after line 137 (string 'labels'),
# but we must place it WHERE the schema intends: after items table + RLS,
# before the trigger section. Keep exact position: before the trigger that
# follows the items RLS (which is currently right after line 137).
$insertAt = $lines.Count  # fallback; we want after 'profiles' items labels

# Find the line number of '-- TRIGGER: Auto-create profile on signup' so we
# insert the claims RLS block just before it (mimicking original intent).
$triggerIndex = $null
for ($i = 0; $i -lt $keep.Count; $i++) {
    $trimmed = $keep[$i] -replace '^\s+', ''
    if ($trimmed -match '^-- TRIGGER: Auto-create profile on signup') {
        $triggerIndex = $i
        break
    }
}

if ($triggerIndex -eq $null) {
    Write-Warning '-- TRIGGER: Auto-create profile on signup not found; appending RLS block at end.'
    $keep.AddRange($newClaimsBlock)
} else {
    Write-Output ('Inserting corrected claims RLS block before line ' + ($triggerIndex + 1).ToString() + ' (of ' + $keep.Count.ToString() + ' retained lines).')
    $keep.InsertRange($triggerIndex, $newClaimsBlock)
}

[System.IO.File]::WriteAllLines($src, $keep, [System.Text.UTF8Encoding]::new($false))
Write-Output ('Done. Wrote ' + $keep.Count.ToString() + ' lines to ' + $src + '.')
