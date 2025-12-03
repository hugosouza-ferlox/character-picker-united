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
      
      // Match image filename - read available portraits and find best match
      const portraitsDir = path.join(process.cwd(), 'public', 'portraits');
      let imageUrl = '/portraits/Batman_29_Back.webp'; // Default fallback
      
      if (fs.existsSync(portraitsDir)) {
        const portraitFiles = fs.readdirSync(portraitsDir);
        const baseName = name.replace(/\s+/g, '_');
        const normalizedName = baseName.toLowerCase();
        
        // Extract variant/set info from name if present (e.g., "Iron Man (Civil War)" -> variant: "Civil War")
        const variantMatch = name.match(/\(([^)]+)\)/);
        const variant = variantMatch ? variantMatch[1].trim() : '';
        
        // Check if name contains "Classic" or other variant keywords (not in parentheses)
        const nameLower = name.toLowerCase();
        const hasClassic = nameLower.includes('classic') && !variantMatch;
        const variantKeyword = hasClassic ? 'classic' : '';
        
        // Check if set contains a number (like "29" for set 29)
        const setNumberMatch = set.match(/(\d+)/);
        const setNumber = setNumberMatch ? setNumberMatch[1] : '';
        
        // Function to check if a filename matches a character name
        function matchesCharacter(fileName: string, charName: string, preferSetNumber?: string, preferVariant?: string): boolean {
          const fileLower = fileName.toLowerCase();
          // Normalize name: replace spaces and hyphens with underscores, remove special chars
          let nameNormalized = charName
            .replace(/\s+/g, '_')
            .replace(/-/g, '_')
            .replace(/[()]/g, '')
            .toLowerCase();
          
          // Extract base name (without variant like "Classic", "Goggles", "Controlled", "Punk")
          const variantSuffixes = ['_classic', '_goggles', '_controlled', '_punk'];
          let baseName = nameNormalized;
          for (const suffix of variantSuffixes) {
            if (baseName.endsWith(suffix)) {
              baseName = baseName.slice(0, -suffix.length);
              break;
            }
          }
          
          // Special handling for specific characters - check exact matches first
          const specialCases: Record<string, string[]> = {
            'black_panther': ['black_panther_29_back_jpg.webp'],
            'spider_punk': ['spider_punk_back.webp'],
            'spider_man_noir': ['spider-man_noir_back.jpg'],
            'spider-man_noir': ['spider-man_noir_back.jpg'],
            'symbiote_spider_man': ['symbiote_spider-man_back.jpg'],
            'symbiote_spider-man': ['symbiote_spider-man_back.jpg'],
            'anti_venom': ['anti-venom_hero_back.jpg'],
            'anti-venom': ['anti-venom_hero_back.jpg'],
            'superior_spider_man': ['superior_spider-man_hero_back.webp'],
            'superior_spider-man': ['superior_spider-man_hero_back.webp'],
            'robin_tim_drake': ['robin_(tim_drake)_back.jpg'],
            'robin_tim-drake': ['robin_(tim_drake)_back.jpg'],
            'robin_(tim_drake)': ['robin_(tim_drake)_back.jpg'],
            'loki': ['loki_29_back_jpg.webp'],
            'catwoman': ['catwoman_29_back.webp'],
            'superman': ['superman_29_back.webp'],
          };
          
          // Check special cases first - must be exact match or start with the key
          for (const [key, patterns] of Object.entries(specialCases)) {
            // Normalize key for comparison (handle both underscore and hyphen variations)
            const keyNormalized = key.replace(/-/g, '_');
            const nameNormalizedForComparison = nameNormalized.replace(/-/g, '_');
            
            // Extract key words for flexible matching
            const keyWords = keyNormalized.split('_').filter(w => w.length > 2);
            const nameWords = nameNormalizedForComparison.split('_').filter(w => w.length > 2);
            
            // Check if this character name exactly matches or starts with the special case key
            // Also check if all key words are present in sequence (for flexible matching)
            const exactMatch = nameNormalized === key || nameNormalizedForComparison === keyNormalized;
            const startsWithMatch = nameNormalized.startsWith(key + '_') ||
                                  nameNormalized.startsWith(key + '-') ||
                                  nameNormalized.startsWith(key + '(') ||
                                  nameNormalizedForComparison.startsWith(keyNormalized + '_') ||
                                  nameNormalizedForComparison.startsWith(keyNormalized + '-');
            
            // Check if all key words appear in sequence in the name
            // This helps match "spider_man_noir" to "spider-man_noir" variations
            const containsAllWordsInSequence = keyWords.length > 0 && 
                                              keyWords.length <= nameWords.length &&
                                              keyWords.every((word, idx) => {
                                                // Find the word in nameWords starting from previous match position
                                                const startIdx = idx === 0 ? 0 : nameWords.indexOf(keyWords[idx - 1]) + 1;
                                                return nameWords.slice(startIdx).includes(word);
                                              }) &&
                                              nameWords[0] === keyWords[0]; // Must start with first key word
            
            const isSpecialCase = exactMatch || startsWithMatch || containsAllWordsInSequence;
            
            if (isSpecialCase) {
              // If it's a special case, only match the specific patterns
              if (patterns.some(pattern => fileLower === pattern)) {
                return true;
              }
              // For special cases, don't fall through to other matching logic
              return false;
            }
          }
          
          // Exact pattern matches
          const exactPatterns = [
            `${nameNormalized}_back_jpg.jpg`,
            `${nameNormalized}_29_back.webp`,
            `${nameNormalized}_back.webp`,
            `${nameNormalized}_back_jpg.webp`,
            `${nameNormalized}_villain_back_jpg.jpg`,
            `${baseName}_back_jpg.jpg`,
            `${baseName}_29_back.webp`,
            `${baseName}_back.webp`,
            `${baseName}_back_jpg.webp`,
            `${baseName}_villain_back_jpg.jpg`,
            `${baseName}_29_back_jpg.webp`, // Pattern for Black Panther, Loki, etc.
          ];
          
          if (exactPatterns.some(pattern => fileLower === pattern)) {
            return true;
          }
          
          // Check if filename starts with the normalized name
          if (fileLower.startsWith(nameNormalized + '_') || fileLower.startsWith(nameNormalized + '(')) {
            return true;
          }
          
          // Special handling for "Iron Man" -> "ironman" (no space/underscore)
          // Also handle "Iron Man (Civil War)" -> should match "iron_man_(civil_war)"
          if (nameNormalized === 'iron_man' || nameNormalized.startsWith('iron_man')) {
            if (fileLower.startsWith('ironman') || fileLower.startsWith('iron_man')) {
              return true;
            }
          }
          
          // Special handling for "Captain America" -> "captain_america"
          // Also handle "Captain America Classic" -> should match "captain_america" + "classic"
          if (nameNormalized.startsWith('captain_america')) {
            if (fileLower.startsWith('captain_america')) {
              return true;
            }
          }
          
          // Check if filename starts with base name (for variants)
          // But exclude cases where baseName is too generic (like "spider" matching "spider_man")
          if (baseName !== nameNormalized && baseName.length > 5 && 
              (fileLower.startsWith(baseName + '_') || fileLower.startsWith(baseName + '('))) {
            return true;
          }
          
          // For multi-word names, check if all significant words are present
          const nameWords = nameNormalized.split('_').filter(w => w.length > 2);
          const baseWords = baseName.split('_').filter(w => w.length > 2);
          
          // Try with full name words - require exact word match, not just substring
          if (nameWords.length > 1) {
            const allWordsMatch = nameWords.every(word => {
              // Check if word appears as a complete word (surrounded by _ or at start/end)
              const wordRegex = new RegExp(`(^|_)${word}(_|$)`);
              return wordRegex.test(fileLower);
            });
            if (allWordsMatch && fileLower.startsWith(nameWords[0] + '_')) {
              return true;
            }
          }
          
          // Try with base name words (for variants) - but only if baseName is specific enough
          if (baseWords.length > 0 && baseWords.length !== nameWords.length && baseName.length > 5) {
            const allBaseWordsMatch = baseWords.every(word => {
              const wordRegex = new RegExp(`(^|_)${word}(_|$)`);
              return wordRegex.test(fileLower);
            });
            if (allBaseWordsMatch && fileLower.startsWith(baseWords[0] + '_')) {
              return true;
            }
          }
          
          return false;
        }
        
        // Try to find matching files - prioritize more specific matches
        let allMatchingFiles = portraitFiles.filter(file => matchesCharacter(file, name, setNumber, variant));
        
        // Handle variant keywords like "Classic" - must be in the filename
        if (variantKeyword) {
          // If name contains "Classic", prefer files with "classic" in the name
          const filesWithKeyword = allMatchingFiles.filter(file => 
            file.toLowerCase().includes(variantKeyword)
          );
          if (filesWithKeyword.length > 0) {
            allMatchingFiles = filesWithKeyword;
          } else {
            // If no files with keyword found, exclude files without the keyword
            allMatchingFiles = [];
          }
        }
        
        // If character has a variant (in parentheses), exclude files without variants (files without parentheses)
        // If character has NO variant, exclude files WITH variants (files with parentheses)
        if (variant) {
          // Character has variant - prefer files that also have variants
          const filesWithVariants = allMatchingFiles.filter(file => file.includes('('));
          if (filesWithVariants.length > 0) {
            allMatchingFiles = filesWithVariants;
          }
        } else if (!variantKeyword) {
          // Character has NO variant and NO variant keyword - exclude files with variants
          // Also exclude files with variant keywords like "classic" if the character name doesn't have it
          allMatchingFiles = allMatchingFiles.filter(file => {
            const fileLower = file.toLowerCase();
            // Exclude files with parentheses (variants)
            if (file.includes('(')) return false;
            // Exclude files with "classic" if character name doesn't have "classic"
            if (fileLower.includes('classic') && !nameLower.includes('classic')) return false;
            return true;
          });
        }
        
        let matchingFile: string | undefined;
        
        if (allMatchingFiles.length > 0) {
          // Prioritize files that match set number or variant
          if (setNumber) {
            const setMatch = allMatchingFiles.find(file => 
              file.toLowerCase().includes(`_${setNumber}_`) || 
              file.toLowerCase().includes(`_${setNumber}.`) ||
              file.toLowerCase().includes(`-${setNumber}-`) ||
              file.toLowerCase().includes(`-${setNumber}.`)
            );
            if (setMatch) {
              matchingFile = setMatch;
            }
          }
          
          // If no set match, try variant match
          if (!matchingFile && variant) {
            // Try multiple variant formats
            const variantUnderscore = variant.toLowerCase().replace(/\s+/g, '_');
            const variantHyphen = variant.toLowerCase().replace(/\s+/g, '-');
            const variantSpace = variant.toLowerCase();
            
            const variantMatch = allMatchingFiles.find(file => {
              const fileLower = file.toLowerCase();
              // Match variant in parentheses with different separators
              return fileLower.includes(`(${variantUnderscore})`) || 
                     fileLower.includes(`(${variantHyphen})`) ||
                     fileLower.includes(`(${variantSpace})`) ||
                     // Match variant with underscores
                     fileLower.includes(`_${variantUnderscore}_`) ||
                     fileLower.includes(`_${variantUnderscore}.`) ||
                     // Match variant with hyphens
                     fileLower.includes(`-${variantHyphen}-`) ||
                     fileLower.includes(`-${variantHyphen}.`);
            });
            if (variantMatch) {
              matchingFile = variantMatch;
            }
          }
          
          // If still no match, prefer files with numbers (more specific) over plain names
          // BUT: if there's a variant, exclude files that DON'T have the variant
          if (!matchingFile) {
            let candidates = allMatchingFiles;
            
            // If we have a variant, prefer files that contain variant-like patterns
            if (variant) {
              const variantUnderscore = variant.toLowerCase().replace(/\s+/g, '_');
              const variantHyphen = variant.toLowerCase().replace(/\s+/g, '-');
              const filesWithVariant = allMatchingFiles.filter(file => {
                const fileLower = file.toLowerCase();
                return fileLower.includes(`(${variantUnderscore})`) || 
                       fileLower.includes(`(${variantHyphen})`) ||
                       fileLower.includes(`_${variantUnderscore}_`) ||
                       fileLower.includes(`-${variantHyphen}-`);
              });
              // If we found files with variant patterns, use those
              if (filesWithVariant.length > 0) {
                candidates = filesWithVariant;
              } else {
                // Otherwise, exclude files that have parentheses (other variants)
                candidates = allMatchingFiles.filter(file => !file.includes('('));
              }
            }
            
            const withNumbers = candidates.filter(file => /\d/.test(file));
            if (withNumbers.length > 0) {
              matchingFile = withNumbers[0];
            } else if (candidates.length > 0) {
              matchingFile = candidates[0];
            } else {
              matchingFile = allMatchingFiles[0];
            }
          }
        }
        
        if (matchingFile) {
          imageUrl = `/portraits/${matchingFile}`;
        } else {
          // Try common patterns as fallback (only if they exist)
          const patterns = [
            `${baseName}_Back_JPG.jpg`,
            `${baseName}_29_Back.webp`,
            `${baseName}_Back.webp`,
            `${baseName}_Back_JPG.webp`,
            `${baseName}_Villain_Back_JPG.jpg`,
          ];
          
          const foundPattern = patterns.find(pattern => {
            const patternLower = pattern.toLowerCase();
            return portraitFiles.some(file => file.toLowerCase() === patternLower);
          });
          
          if (foundPattern) {
            // Get the actual filename with correct case
            const actualFile = portraitFiles.find(f => f.toLowerCase() === foundPattern.toLowerCase());
            if (actualFile) {
              imageUrl = `/portraits/${actualFile}`;
            }
          }
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

