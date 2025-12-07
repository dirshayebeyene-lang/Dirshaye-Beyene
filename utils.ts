import { PortfolioItem } from './types';

export const parseCSV = (csvText: string): PortfolioItem[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const items: PortfolioItem[] = [];

  // Simple CSV parser handling quoted strings
  const parseLine = (text: string) => {
    const result = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const values = parseLine(line);
    const item: any = {};
    
    headers.forEach((header, index) => {
      // Clean header name to match object keys somewhat (simplified)
      const key = header; 
      let value = values[index];

      // Remove surrounding quotes if present from CSV parsing artifacts
      if (value && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Map CSV headers to interface keys
      if (key === 'Section') item.section = value;
      if (key === 'Title') item.title = value;
      if (key === 'Content') item.content = value;
      if (key === 'Artifact') item.artifact = value;
      if (key === 'Link') item.link = value;
      if (key === 'Tags') item.tags = value ? value.split(',').map((t: string) => t.trim()) : [];
      if (key === 'Date') item.date = value;
      if (key === 'Item Type') item.itemType = value;
      if (key === 'Status') item.status = value;
      if (key === 'Order') item.order = parseInt(value) || 99;
      if (key === 'Subsection') item.subsection = value;
    });

    if (item.title) {
      items.push(item as PortfolioItem);
    }
  }

  return items;
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};
