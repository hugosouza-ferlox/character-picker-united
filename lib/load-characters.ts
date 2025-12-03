import * as XLSX from 'xlsx';
import { Character } from '@/types/character';
import path from 'path';
import fs from 'fs';

export async function loadCharacters(): Promise<Character[]> {
  try {
    // Read the Excel file from public directory
    const filePath = path.join(process.cwd(), 'public', 'db', 'United DB.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Excel file not found at:', filePath);
      return [];
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    
    // Get the first sheet (Sheet1)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Map the data to Character objects
    const characters: Character[] = data.map((row: any, index: number) => {
      const name = row['Name'] || 'Unknown';
      const type = row['Type'] || 'Hero';
      const set = row['Set'] || '';
      const groupsRaw = row['Groups'] || row['groups'] || '';
      
      // Parse groups - handle comma-separated or single value
      const groups: string[] = groupsRaw
        ? groupsRaw.toString().split(',').map((g: string) => g.trim()).filter(Boolean)
        : [];
      
      // Create ID from name and index
      const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${index}`;
      
      // Map stats from Excel columns
      const stats = [
        {
          value: parseInt(row['nr wild']) || 0,
          icon: 'arrow' as const,
          color: 'gray' as const,
        },
        {
          value: parseInt(row['nr heroics']) || 0,
          icon: 'lightning' as const,
          color: 'yellow' as const,
        },
        {
          value: parseInt(row['nr attacks']) || 0,
          icon: 'explosion' as const,
          color: 'red' as const,
        },
        {
          value: parseInt(row['nr movements']) || 0,
          icon: 'leaf' as const,
          color: 'green' as const,
        },
      ];
      
      // Match image filename to character name
      // Files are named: CHARACTERNAME.ext or CHARACTERNAME_(VARIANT).ext or CHARACTERNAME_Villain.ext
      // No numbers or "_Back" suffix (except Spider-Man 2099)
      const portraitsDir = path.join(process.cwd(), 'public', 'portraits');
      let imageUrl = '/portraits/BATMAN_(CLASSIC).webp'; // Default fallback
      
      // Function to normalize name for filename matching
      function normalizeForFilename(name: string): string {
        return name
          .replace(/\s+/g, '_')
          .replace(/-/g, '_')
          .replace(/['"]/g, '')
          .toUpperCase();
      }
      
      // Remove [Hero] or [Villain] tags from name
      let cleanName = name.replace(/\[.*?\]/g, '').trim();
      
      // Extract variant from name if present (e.g., "Iron Man (Civil War)" -> variant: "Civil War")
      const variantMatch = cleanName.match(/\(([^)]+)\)/);
      const variant = variantMatch ? variantMatch[1].trim() : '';
      const baseName = variantMatch ? cleanName.substring(0, variantMatch.index).trim() : cleanName;
      
      // Generate expected filename patterns to try
      if (fs.existsSync(portraitsDir)) {
        const portraitFiles = fs.readdirSync(portraitsDir);
        const extensions = ['.webp', '.jpg', '.jpeg', '.png'];
        
        // Build possible filename patterns (try most specific first)
        const patterns: string[] = [];
        const baseNormalized = normalizeForFilename(baseName);
        const variantNormalized = variant ? normalizeForFilename(variant) : '';
        const isVillain = type === 'Dual Mode/Anti-Hero';
        
        // Pattern 1: With variant and Villain (if Dual Mode/Anti-Hero)
        if (variant && isVillain) {
          patterns.push(`${baseNormalized}_(${variantNormalized})_Villain`);
        }
        
        // Pattern 2: With variant only (try this even for villains, as some files don't have _Villain)
        if (variant) {
          patterns.push(`${baseNormalized}_(${variantNormalized})`);
        }
        
        // Pattern 3: Base name with Villain (if Dual Mode/Anti-Hero)
        if (isVillain) {
          patterns.push(`${baseNormalized}_Villain`);
        }
        
        // Pattern 4: Base name only
        patterns.push(baseNormalized);
        
        // Try each pattern with each extension
        let found = false;
        for (const pattern of patterns) {
          for (const ext of extensions) {
            const exactMatch = `${pattern}${ext}`;
            if (portraitFiles.includes(exactMatch)) {
              imageUrl = `/portraits/${exactMatch}`;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        
        // If no exact match, try case-insensitive matching
        if (!found) {
          for (const file of portraitFiles) {
            const fileUpper = file.toUpperCase();
            const fileBase = fileUpper.replace(/\.[^.]+$/, ''); // Remove extension
            
            // Must contain base name
            if (!fileBase.includes(baseNormalized)) continue;
            
            // If variant exists, file must contain it (in parentheses)
            if (variant && !fileBase.includes(`(${variantNormalized})`)) continue;
            
            // If no variant, prefer files without variants, but allow if no other match
            if (!variant && fileBase.includes('(')) {
              // Skip files with variants if we don't have a variant
              continue;
            }
            
            // For villains, try to match files with _Villain first, but also accept without
            // For non-villains, skip files with _Villain
            const hasVillain = fileBase.includes('_VILLAIN');
            if (!isVillain && hasVillain) continue;
            
            imageUrl = `/portraits/${file}`;
            found = true;
            break;
          }
        }
        
        // If still no match, log a warning
        if (!found) {
          console.warn(`No image found for character: ${name} (tried patterns: ${patterns.join(', ')})`);
        }
      }
      
      return {
        id,
        name: name.toUpperCase(),
        type: type as 'Hero' | 'Dual Mode/Anti-Hero',
        set,
        groups,
        imageUrl,
        stats,
      };
    });
    
    return characters;
  } catch (error) {
    console.error('Error loading characters:', error);
    return [];
  }
}

