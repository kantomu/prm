
import os

TARGET_FOLDERS = [
    r"G:\Keyscape Installation",
    r"G:\Trilian Installation"
]

def analyze_folder(path):
    print(f"--- Analyzing {path} ---")
    if not os.path.exists(path):
        print("Folder not found.")
        return

    total_size = 0
    file_types = {}
    important_files = []
    
    # Check for .steam, .db which are actual library files
    # Check for .exe, .zip, .rar, .iso which are installers
    
    for root, dirs, files in os.walk(path):
        for f in files:
            fp = os.path.join(root, f)
            size = os.path.getsize(fp)
            total_size += size
            ext = os.path.splitext(f)[1].lower()
            
            file_types[ext] = file_types.get(ext, 0) + 1
            
            if ext in [".steam", ".db", ".nki", ".nkx", ".vstsound", ".blob"]:
                # STEAM folder usually has .db files inside "Keyboards" etc.
                # But Keyscape installers also have large .db files inside "STEAM" folder structure within the installer?
                # We need to distinguish "Installed Library" vs "Installer Source"
                # Installer source often has "Wrapper", "Disc 1", "Payload" etc.
                important_files.append(f)
                
    print(f"Total Size: {total_size / (1024**3):.2f} GB")
    print("File Types:")
    for ext, count in file_types.items():
        print(f"  {ext}: {count}")
        
    print("Potential Library Files found:")
    for f in important_files[:10]:
        print(f"  {f}")
        
    # Check if folder structure looks like "STEAM" root
    if os.path.exists(os.path.join(path, "STEAM")):
        print("WARNING: Contains 'STEAM' folder.")
    if os.path.exists(os.path.join(path, "Spectrasonics")):
        print("WARNING: Contains 'Spectrasonics' folder.")
    if os.path.exists(os.path.join(path, "Windows")):
         print("INFO: Contains 'Windows' folder (typical for installers).")
    if os.path.exists(os.path.join(path, "Mac")):
         print("INFO: Contains 'Mac' folder (typical for installers).")

if __name__ == "__main__":
    for p in TARGET_FOLDERS:
        analyze_folder(p)
