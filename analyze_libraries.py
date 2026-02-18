
import os
from pathlib import Path

# Configuration
SEARCH_PATHS = [
    r"G:\\",
    r"C:\ProgramData",
    r"C:\Users\Public\Documents",
    r"C:\Program Files\Common Files",
    r"C:\Users\matsu\AppData\Roaming\Steinberg"
]

# Vendors to watch out for
VENDORS = [
    "Native Instruments", "Steinberg", "Spectrasonics", "Toontrack", 
    "IK Multimedia", "Heavyocity", "Spitfire", "Vienna", "EastWest", 
    "Arturia", "UJAM", "Output", "Izotope"
]

# Extensions that indicate "Library Content"
LIBRARY_EXTENSIONS = [
    ".vstsound", ".nkx", ".nki", ".nwc", ".nkc", # NI / Steinberg
    ".db", ".blob", ".dat", # Spectrasonics / General
    ".obw", ".sound", # Arturia / Others
    ".wav", ".aif", ".flac", # Raw Audio
    ".exs", ".gig", ".sf2" # Samplers
]

# Extensions that indicate "Installer"
INSTALLER_EXTENSIONS = [
    ".exe", ".msi", ".zip", ".rar", ".iso", ".dmg", ".pkg"
]

def get_folder_size(path):
    total_size = 0
    file_count = 0
    
    try:
        if not os.path.exists(path):
            return 0, 0
            
        for dirpath, dirnames, filenames in os.walk(path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                if not os.path.islink(fp):
                    try:
                        total_size += os.path.getsize(fp)
                    except OSError:
                        pass # Skip locked files
                file_count += 1
    except PermissionError:
        pass # Skip folders we can't access
        
    return total_size, file_count

def analyze_folder_content(path):
    is_library = False
    is_installer = False
    
    # Check simple heuristics based on file extensions in the first few levels
    # We don't need to walk everything for classification, just deep enough to find hints.
    
    try:
        for root, dirs, files in os.walk(path):
            # Don't go too deep for classification
            depth = len(Path(root).relative_to(path).parts)
            if depth > 3: continue
            
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in LIBRARY_EXTENSIONS:
                    is_library = True
                if ext in INSTALLER_EXTENSIONS:
                    is_installer = True
            
            if is_library and is_installer:
                break # Found both mixed, or enough info
                
    except Exception:
        pass
        
    return is_library, is_installer

def scan_drive_root(root_path, max_depth=1):
    results = []
    
    print(f"Scanning {root_path}...")
    
    try:
        # Get top level folders
        subdirs = [os.path.join(root_path, d) for d in os.listdir(root_path) if os.path.isdir(os.path.join(root_path, d))]
        
        for folder in subdirs:
            folder_name = os.path.basename(folder)
            
            # Skip Windows System folders
            if folder_name.startswith("$") or folder_name in ["Windows", "PerfLogs", "Program Files", "Program Files (x86)", "Users", "System Volume Information"]:
                # For C: root, we only want to specifically target user libraries if they wandered there, 
                # but generally we skip system roots. 
                # However, for SEARCH_PATHS like "C:\ProgramData", we DO want to scan subfolders.
                # So logic depends on if root_path is a Drive Root or a Folder.
                if len(Path(root_path).parts) == 1: # Drive root (e.g. G:\)
                     # For G drive, we scan everything except recycle bin
                     pass
                else: 
                     # For specific paths, we scan all direct children
                     pass
            
            # Heuristic: Is this a potential library folder?
            # 1. Matches a known vendor
            # 2. Large size (> 500MB)
            # 3. Mentioned in user list (BFD, Superior, etc)
            
            # Check size first? No, slow. Check name first.
            is_interesting = False
            for v in VENDORS:
                if v.lower() in folder_name.lower():
                    is_interesting = True
                    break
            
            # Also check specific user mentions
            if any(k in folder_name.lower() for k in ["bfd", "superior", "keyscape", "trilian", "serum", "library", "content", "sound"]):
                is_interesting = True

            # If interesting, do a deep analysis
            if is_interesting or len(Path(root_path).parts) > 1: # Always analyze children of specific search paths like ProgramData
                
                # Exclude obvious non-audio stuff in ProgramData
                if "Microsoft" in folder_name or "Windows" in folder_name or "NVIDIA" in folder_name:
                    continue

                size, count = get_folder_size(folder)
                if size > 100 * 1024 * 1024: # Only report if > 100MB
                    is_lib, is_inst = analyze_folder_content(folder)
                    
                    type_str = "Unknown"
                    if is_lib and not is_inst: type_str = "Library"
                    elif is_inst and not is_lib: type_str = "Installer"
                    elif is_lib and is_inst: type_str = "Mixed"
                    
                    # Refine Installer check: if folder name contains "Installation" or "Installer"
                    if "install" in folder_name.lower() or "setup" in folder_name.lower():
                        type_str = "Installer (Likely)"
                        
                    results.append({
                        "Path": folder,
                        "Name": folder_name,
                        "Size": size,
                        "Type": type_str
                    })
                    print(f"  Found: {folder_name} ({size / (1024**3):.2f} GB) - {type_str}")

    except Exception as e:
        print(f"Error scanning {root_path}: {e}")
        
    return results

def main():
    all_results = []
    
    for p in SEARCH_PATHS:
        if os.path.exists(p):
            all_results.extend(scan_drive_root(p))
            
    # Sort by size desc
    all_results.sort(key=lambda x: x["Size"], reverse=True)
    
    # Generate Report
    md = "# Plugin Library Analysis\n\n"
    
    md += "## Summary\n"
    total_gb = sum(x['Size'] for x in all_results) / (1024**3)
    md += f"- **Total Detected Library Content**: {total_gb:.2f} GB\n\n"
    
    md += "## Large Folders Detected\n"
    md += "| Name | Path | Size | Type | Notes |\n"
    md += "|---|---|---|---|---|\n"
    
    for r in all_results:
        size_gb = r['Size'] / (1024**3)
        md += f"| {r['Name']} | `{r['Path']}` | {size_gb:.2f} GB | {r['Type']} | |\n"
        
    output_path = r"C:\Users\matsu\.gemini\antigravity\brain\72c689f6-b544-49bc-85ef-636d75eb3d42\library_analysis.md"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(md)
    
    print(f"Report written to {output_path}")

if __name__ == "__main__":
    main()
