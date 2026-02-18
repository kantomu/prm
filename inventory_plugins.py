
import os
import xml.etree.ElementTree as ET
import re
from pathlib import Path

# Paths
VST3_ROOT = r"C:\Program Files\Common Files\VST3"
VST2_XML = r"C:\Users\matsu\AppData\Roaming\Steinberg\Cubase 11_64\Vst2xPlugin Infos Cubase.xml"
OUTPUT_FILE = r"C:\Users\matsu\.gemini\antigravity\brain\72c689f6-b544-49bc-85ef-636d75eb3d42\plugin_inventory.md"

# Categorization Rules
GENRES = {
    "EQ": ["EQ", "Equalizer", "Filter", "Spectral", "Claro", "Pro-Q", "Slay"],
    "Dynamics": ["Compressor", "Limiter", "Gate", "Transient", "De-Esser", "Maximizer", "Dynamics", "Glue", "Multiband", "Pro-C", "Pro-L", "Pro-G", "Pro-MB", "Smack", "Fairchild", "1176", "LA-2A"],
    "Reverb/Delay": ["Reverb", "Verb", "Delay", "Echo", "Room", "Hall", "Plate", "Space", "Pro-R", "Valhalla"],
    "Saturation/Distortion": ["Saturation", "Distortion", "Drive", "Tape", "Amp", "Fuzz", "Overdrive", "Decapitator", "Saturn", "Trash"],
    "Modulation": ["Chorus", "Flanger", "Phaser", "Tremolo", "Vibrato", "Time", "Mod"],
    "Imaging": ["Imager", "Width", "Stereo", "Pan", "Center"],
    "Restoration": ["Denoise", "Declam", "Declick", "Rx", "Breath", "Cleanup"],
    "Analysis": ["Meter", "Scope", "Analyzer", "Spectrum", "Insight", "Levels"],
    "Instrument": ["Synth", "Sampler", "Drum", "Piano", "Bass", "Guitar", "Orchestra", "Strings", "Horn", "Keys", "Kontakt", "Reactor", "Massive", "Serum", "Vital", "Omnisphere", "Keyscape", "Trilian", "HALion", "Padshop", "Retrologue"],
}

EXCELLENT_VENDORS = [
    "FabFilter", "iZotope", "Native Instruments", "Spectrasonics", "Universal Audio", 
    "SSL", "Solid State Logic", "Pulsar", "Soundtheory", "Cableguys", "Xfer Records", 
    "Valhalla", "Soundtoys", "Slate Digital", "Waves", "Softube", "Plugin Alliance", "Brainworx",
    "Steinberg", "Celemony", "Antares", "Spitfire", "Orchestral Tools", "Heavyocity"
]

IGNORE_PATTERNS = [
    "api-ms-win", "msvcp", "msvcr", "qt", "libcef", "d3dcompiler", "steam_api", "physx", 
    "nvcontainer", "gfe", "igdrcl", "opencl", "vulkan", "opengl", "concrt", "vcruntime",
    "mfc", "atl", "freeimage", "assimp", "cuesdk", "discord", "crashpad", "unins000",
    "setup", "install", "update", "bho", "websockets", "webview", "edge", "google"
]

IGNORE_PATHS = [
    r"System32", 
    r"SysWOW64", 
    r"Program Files\Windows", 
    r"Program Files (x86)\Windows", 
    r"Program Files\Microsoft", 
    r"Program Files (x86)\Microsoft",
    r"Program Files\Google",
    r"Program Files (x86)\Google",
    r"Program Files\NVIDIA", 
    r"Program Files (x86)\NVIDIA",
    r"Program Files\ASUS",
    r"Program Files (x86)\ASUS",
    r"Program Files\Intel",
    r"Program Files (x86)\Intel",
    r"Steam\bin", # Steam client binaries
    r"wallpaper_engine\bin", # Wallpaper engine binaries
    r"Battle.net",
    r"Dropbox",
    r"Epic Games",
    r"EaseUS",
    r"MiniTool",
    r"LightingService",
    r"Razer",
    r"Corsair",
    r"Elgato",
    r"OBS",
]

inventory = []

def get_size_str(size_bytes):
    return f"{size_bytes / (1024*1024):.2f} MB"

    return False


def is_ignored(name, path):
    name_lower = name.lower()
    path_lower = path.lower()
    
    # Check filename patterns
    for p in IGNORE_PATTERNS:
        if p in name_lower:
            return True
    
    # Check path patterns
    for p in IGNORE_PATHS:
        if p.lower() in path_lower:
            # Exception: if path contains "VstPlugins" or "VST", keep it (unless it's really noise)
            if "vst" in path_lower:
                return False
            return True
            
    # Extension check (strict)
    if not (path_lower.endswith(".vst3") or path_lower.endswith(".dll")):
        return True

    return False

def categorize_plugin(name, vendor):
    # Check Genre
    genre = "Uncategorized"
    name_lower = name.lower()
    for g, keywords in GENRES.items():
        for k in keywords:
            if k.lower() in name_lower:
                genre = g
                break
        if genre != "Uncategorized":
            break
            
    # Heuristic for Instruments if Uncategorized but heavy size or specific vendor
    if genre == "Uncategorized":
        if "instrument" in name_lower:
             genre = "Instrument"

    # Check Quality
    is_excellent = False
    if vendor:
        for v in EXCELLENT_VENDORS:
            if v.lower() in vendor.lower():
                is_excellent = True
                break
    # Heuristic: iZotope plugins usually excellent
    if "izotope" in name_lower or (vendor and "izotope" in vendor.lower()):
        is_excellent = True
    
    return genre, is_excellent

# 1. Scan VST3
print("Scanning VST3...")
for root, dirs, files in os.walk(VST3_ROOT):
    for file in files:
        if file.endswith(".vst3"):
            path = os.path.join(root, file)
            name = file.replace(".vst3", "")
            
            if is_ignored(name, path): continue

            size = os.path.getsize(path)
            # Vendor guessing for VST3 (folder name often helps)
            vendor = Path(path).parent.name
            if vendor == "Contents": # Go up one more for .vst3 bundle folder
                vendor = Path(path).parent.parent.parent.name
            
            # Refine vendor logic
            if vendor == "VST3" or vendor == "x86_64-win": vendor = "Unknown"
            
            genre, is_excellent = categorize_plugin(name, vendor)
            
            inventory.append({
                "Name": name,
                "Vendor": vendor,
                "Format": "VST3",
                "Path": path,
                "Size": size,
                "Exists": True,
                "Genre": genre,
                "IsExcellent": is_excellent
            })

# 2. Parse VST2 XML
print("Parsing VST2 XML...")
try:
    tree = ET.parse(VST2_XML)
    root = tree.getroot()
    
    # Iterate through <item> elements in the parsed list
    # The structure is specific: <list name="Entries"> -> <item> -> <string name="Group" value="Vst2xPlug\PATH">
    # Then <member name="Values"> -> <member name="Vst2xPlugInfo"> which has details
    
    # We need to find the list named "Entries"
    entries_list = None
    for lst in root.findall(".//list"):
        if lst.get("name") == "Entries":
            entries_list = lst
            break
            
    if entries_list:
        for item in entries_list.findall("item"):
            # Get Group (Path)
            group_elem = item.find("string[@name='Group']")
            if group_elem is None: continue
            
            group_val = group_elem.get("value")
            if not group_val.startswith("Vst2xPlug\\"): continue
            
            full_path = group_val.replace("Vst2xPlug\\", "")
            
            # Get Info
            info_member = item.find(".//member[@name='Vst2xPlugInfo']")
            name = "Unknown"
            vendor = "Unknown"
            
            if info_member is not None:
                name_elem = info_member.find("string[@name='name']")
                if name_elem is not None: name = name_elem.get("value")
                
                vendor_elem = info_member.find("string[@name='vendor']")
                if vendor_elem is not None: vendor = vendor_elem.get("value")

            # Ignore filter
            if is_ignored(name, full_path): continue

            # Check existence
            exists = os.path.exists(full_path)
            size = 0
            if exists:
                size = os.path.getsize(full_path)
            
            genre, is_excellent = categorize_plugin(name, vendor)
            
            inventory.append({
                "Name": name,
                "Vendor": vendor,
                "Format": "VST2",
                "Path": full_path,
                "Size": size,
                "Exists": exists,
                "Genre": genre,
                "IsExcellent": is_excellent
            })
            
except Exception as e:
    print(f"Error parsing VST2 XML: {e}")

# 3. Generate Markdown Report

# Group by Category for Main Table
inventory.sort(key=lambda x: (x['Genre'], x['Name']))

md_content = "# Cubase Plugin Inventory\n\n"

# Stats
total_size = sum(x['Size'] for x in inventory if x['Exists'])
total_count = len(inventory)
missing_count = len([x for x in inventory if not x['Exists']])

md_content += f"## Statistics\n"
md_content += f"- **Total Plugins Scanned**: {total_count}\n"
md_content += f"- **Total Size**: {get_size_str(total_size)}\n"
md_content += f"- **Missing Plugins**: {missing_count}\n\n"

# Table 1: All Plugins
md_content += "## All Plugins (Categorized)\n\n"
md_content += "| Genre | Name | Vendor | Format | Size | Path |\n"
md_content += "|---|---|---|---|---|---|\n"
for p in inventory:
    if p['Exists']:
        md_content += f"| {p['Genre']} | {p['Name']} | {p['Vendor']} | {p['Format']} | {get_size_str(p['Size'])} | {p['Path']} |\n"

# Table 2: Excellent/Paid
md_content += "\n## Premium / Excellent Plugins\n\n"
md_content += "| Genre | Name | Vendor | Format | Path |\n"
md_content += "|---|---|---|---|---|\n"
for p in inventory:
    if p['Exists'] and p['IsExcellent']:
        md_content += f"| {p['Genre']} | {p['Name']} | {p['Vendor']} | {p['Format']} | {p['Path']} |\n"

# Table 3: Missing
md_content += "\n## Missing / Ghost Plugins\n"
md_content += "These plugins are listed in Cubase VST2 configuration but were not found on disk.\n\n"
md_content += "| Name | Vendor | Expected Path |\n"
md_content += "|---|---|---|\n"
for p in inventory:
    if not p['Exists']:
        md_content += f"| {p['Name']} | {p['Vendor']} | {p['Path']} |\n"

# Write File
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(md_content)

print(f"Report generated at {OUTPUT_FILE}")
